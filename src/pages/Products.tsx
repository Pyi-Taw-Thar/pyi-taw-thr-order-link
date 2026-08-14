import { ShoppingCart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/axios";
import { Product, ApiProductItem } from "./products/types";
import BrandGrid from "./products/BrandGrid";
import CategoryGrid from "./products/CategoryGrid";
import ProductList from "./products/ProductList";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSubCategory = searchParams.get("subCategory") || null;
  const selectedBrand = searchParams.get("brand") || null;
  const selectedCategory = searchParams.get("category") || null;

  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [products, setProducts] = useState<ApiProductItem[]>([]);
  const [prodLoading, setProdLoading] = useState(false);

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

  useEffect(() => {
    if (!selectedBrand) {
      setCategories([]);
      return;
    }
    const fetchCategories = async () => {
      setCatLoading(true);
      try {
        const response = await api.get("/ecommerce/products/categories", {
          params: { brand: selectedBrand },
        });
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCatLoading(false);
      }
    };
    fetchCategories();
  }, [selectedBrand]);

  useEffect(() => {
    if (!selectedBrand || !selectedCategory) {
      setProducts([]);
      return;
    }
    const fetchProducts = async () => {
      setProdLoading(true);
      try {
        const response = await api.get("/ecommerce/products", {
          params: { brand: selectedBrand, category: selectedCategory },
        });
        console.log("response", response.data.data);

        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProdLoading(false);
      }
    };
    fetchProducts();
  }, [selectedBrand, selectedCategory]);

  const productData = useMemo(() => {
    const categoriesMap: Record<string, Product[]> = {};
    // console.log("products", products);
    products.forEach((item) => {
      console.log("item", item);
      const p = item.product;
      const cat = p.category || "အထွေထွေ";
      const product: Product = {
        id: p._id,
        name: p.productName,
        brand: p.brand,
        category: cat,
        code: p.productCode,
        images: p.images || [],
        prices: [
          {
            unit: p.unitOfMeasure,
            quantity: 1,
            price: p.sellingPrice,
          },
          ...p.wholesalePrices.map((w) => ({
            unit: w.unit,
            quantity: w.quantity,
            price: w.price,
          })),
        ],
      };
      if (!categoriesMap[cat]) categoriesMap[cat] = [];
      categoriesMap[cat].push(product);
    });
    return Object.entries(categoriesMap).map(([title, prods]) => ({
      title,
      products: prods,
    }));
  }, [products]);

  const handleBrandSelect = (brandName: string) => {
    const params: Record<string, string> = { brand: brandName };
    if (selectedSubCategory) params.subCategory = selectedSubCategory;
    setSearchParams(params);
  };
  const handleCategorySelect = (catName: string) => {
    const params: Record<string, string> = { brand: selectedBrand!, category: catName };
    if (selectedSubCategory) params.subCategory = selectedSubCategory;
    setSearchParams(params);
  };
  const goBackToBrands = () => {
    const params: Record<string, string> = {};
    if (selectedSubCategory) params.subCategory = selectedSubCategory;
    setSearchParams(params);
  };
  const goBackToCategories = () => {
    const params: Record<string, string> = { brand: selectedBrand! };
    if (selectedSubCategory) params.subCategory = selectedSubCategory;
    setSearchParams(params);
  };

  if (!selectedBrand) {
    return <BrandGrid brands={brands} onSelect={handleBrandSelect} />;
  }

  if (!selectedCategory) {
    return (
      <CategoryGrid
        brand={selectedBrand}
        categories={categories}
        loading={catLoading}
        onSelect={handleCategorySelect}
        onBack={goBackToBrands}
        onChangeBrand={goBackToBrands}
      />
    );
  }

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
      </div>
    );
  }

  return (
    <ProductList
      brand={selectedBrand}
      category={selectedCategory}
      productData={productData}
      onBackToCategories={goBackToCategories}
      onBackToBrands={goBackToBrands}
    />
  );
}
