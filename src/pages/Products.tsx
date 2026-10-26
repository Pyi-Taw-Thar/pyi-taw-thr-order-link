import { ShoppingCart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/axios";
import { ApiProductItem } from "./products/types";
import { mapApiProduct } from "../utils/mapProduct";
import BrandGrid from "./products/BrandGrid";
import ProductList from "./products/ProductList";

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSubCategory = searchParams.get("subCategory") || null;
  const selectedBrand = searchParams.get("brand") || null;

  const [brands, setBrands] = useState<string[]>([]);
  const [products, setProducts] = useState<ApiProductItem[]>([]);
  const [prodLoading, setProdLoading] = useState(false);

  // Fetch brands matching the subCategory (or all brands if no subCategory)
  useEffect(() => {
    if (selectedBrand) return;
    const fetchBrands = async () => {
      try {
        const response = await api.get("/ecommerce/products/brands", {
          params: { subCategory: selectedSubCategory }
        });
        setBrands(response.data.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, [selectedBrand, selectedSubCategory]);

  // Fetch all products under the selected brand directly (skip category selection)
  useEffect(() => {
    if (!selectedBrand) {
      setProducts([]);
      return;
    }
    const fetchProducts = async () => {
      setProdLoading(true);
      try {
        const params: Record<string, string> = { brand: selectedBrand };
        if (selectedSubCategory) {
          params.subCategory = selectedSubCategory;
        }
        const response = await api.get("/ecommerce/products", { params });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProdLoading(false);
      }
    };
    fetchProducts();
  }, [selectedBrand, selectedSubCategory]);

  const formattedProducts = useMemo(
    () => products.map(mapApiProduct),
    [products],
  );

  const handleBrandSelect = (brandName: string) => {
    const params: Record<string, string> = { brand: brandName };
    if (selectedSubCategory) params.subCategory = selectedSubCategory;
    setSearchParams(params);
  };

  const goBackToBrands = () => {
    const params: Record<string, string> = {};
    if (selectedSubCategory) params.subCategory = selectedSubCategory;
    setSearchParams(params);
  };

  const goBackToHome = () => {
    navigate("/");
  };

  // Step 1: If no brand selected, show BrandGrid
  if (!selectedBrand) {
    return (
      <BrandGrid
        brands={brands}
        onSelect={handleBrandSelect}
        showBackButton={true}
        onBack={goBackToHome}
        subtitle={
          selectedSubCategory
            ? `${selectedSubCategory} - အမှတ်တံဆိပ် ${brands.length} ခု`
            : undefined
        }
      />
    );
  }

  // Step 2: Directly show all products under selected brand (category grid skipped)
  if (prodLoading) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center">
        <div className="text-primary font-bold animate-pulse">
          ဆေးဝါးများ ရှာဖွေနေပါသည်...
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex flex-col items-center justify-center pb-20 font-ChivoMono">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-10 h-10 text-gray-200" />
        </div>
        <p className="text-gray-400 font-medium text-sm">
          ဆေးဝါးများ မရှိသေးပါ
        </p>
        <button
          onClick={goBackToBrands}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all"
        >
          နောက်သို့ ပြန်သွားမည်
        </button>
      </div>
    );
  }

  return (
    <ProductList
      brand={selectedBrand}
      subCategory={selectedSubCategory}
      products={formattedProducts}
      onBackToBrands={goBackToBrands}
    />
  );
}
