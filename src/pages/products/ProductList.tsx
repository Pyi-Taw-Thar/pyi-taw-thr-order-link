import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Product } from "./types";
import ProductRow from "./ProductRow";
import SearchHeader from "../../components/SearchHeader";
import { findBestTierIndex } from "../../utils/pricing";

interface ProductListProps {
  brand: string;
  subCategory?: string | null;
  products: Product[];
  onBackToBrands: () => void;
}

export default function ProductList({
  brand,
  subCategory,
  products,
  onBackToBrands,
}: ProductListProps) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!expandedProductId) return;
    const product = products.find((p) => p.id === expandedProductId);
    if (!product) return;
    const qty = quantities[expandedProductId] || 0;
    const currentUnit = product.prices[selectedVariantIndex]?.unit;
    if (!currentUnit || qty <= 0) return;
    const bestIndex = findBestTierIndex(product.prices, currentUnit, qty);
    if (bestIndex !== selectedVariantIndex) {
      setSelectedVariantIndex(bestIndex);
    }
  }, [expandedProductId, quantities, selectedVariantIndex, products]);

  const toggleProduct = (id: string) => {
    if (expandedProductId === id) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(id);
      setSelectedVariantIndex(0);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const setQuantityValue = (id: string, value: string) => {
    const num = parseInt(value);
    setQuantities((prev) => ({
      ...prev,
      [id]: isNaN(num) ? 0 : Math.max(0, num),
    }));
  };

  const getProductCartQty = (productId: string) => {
    return cartItems
      .filter((item) => item.id.startsWith(productId))
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 0;
    if (qty > 0) {
      const selectedVariant =
        product.prices[selectedVariantIndex] || product.prices[0];
      addToCart(
        {
          id: `${product.id}-${selectedVariant.unit}`,
          inventoryId: product.id,
          name: `${product.name} (${selectedVariant.unit})`,
          price: selectedVariant.price,
          unit: selectedVariant.unit,
          prices: product.prices,
        },
        qty,
      );
      setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
      setExpandedProductId(null);
    }
  };

  return (
    <div className="bg-[#f8f9fa] container mx-auto min-h-screen pb-20 font-ChivoMono">
      <SearchHeader />

      <div className="py-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToBrands}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2 text-[14px] md:text-2xl">
                <span className="font-bold text-primary">
                  {brand}
                </span>
                {subCategory && (
                  <span className="text-xs md:text-sm text-gray-500 font-normal">
                    ({subCategory})
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-10">
              <p className="text-gray-500 text-[10px] md:text-[16px]">
                ဆေးဝါး{" "}
                <span className="font-bold text-gray-800">{products.length}</span>{" "}
                မျိုး
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              expanded={expandedProductId === product.id}
              selectedVariantIndex={selectedVariantIndex}
              quantity={quantities[product.id] || 0}
              cartQty={getProductCartQty(product.id)}
              onToggle={() => toggleProduct(product.id)}
              onVariantSelect={setSelectedVariantIndex}
              onQuantityDelta={(delta) => updateQuantity(product.id, delta)}
              onQuantityChange={(value) =>
                setQuantityValue(product.id, value)
              }
              onAddToCart={() => handleAddToCart(product)}
              onNavigate={() =>
                navigate(`/product/${product.id}`, { state: { product } })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
