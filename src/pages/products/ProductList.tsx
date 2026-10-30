import { ArrowLeft, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Product } from "./types";
import ProductRow from "./ProductRow";
import SearchHeader from "../../components/SearchHeader";
import { getTierState } from "../../utils/pricing";

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
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // ဆေးနာမည် A → Z / Z → A — အကြီးအသေး မခွဲ၊ ဂဏန်းကို တန်ဖိုးအတိုင်း (B2 < B12)
  const sortedProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) =>
      a.name.localeCompare(b.name, "en", { sensitivity: "base", numeric: true })
    );
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [products, sortDir]);

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
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  };

  const setQuantityValue = (id: string, value: string) => {
    const num = parseInt(value);
    setQuantities((prev) => ({
      ...prev,
      [id]: isNaN(num) ? 1 : Math.max(1, num),
    }));
  };

  // Product ID အလိုက် cart ထဲရှိ စုစုပေါင်း အရေအတွက်
  const getProductCartQty = (productId: string) => {
    return cartItems
      .filter((item) => item.inventoryId === productId || item.id.startsWith(productId))
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  // Product ID အလိုက် unit အလိုက် cart ထဲရှိ အရေအတွက်
  const cartQtyByUnitMap = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    for (const item of cartItems) {
      const pId = item.inventoryId;
      if (!map[pId]) map[pId] = {};
      map[pId][item.unit] = (map[pId][item.unit] || 0) + item.quantity;
    }
    return map;
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] ?? 1;
    if (qty > 0) {
      const selectedVariant =
        product.prices[selectedVariantIndex] || product.prices[0];
      const currentUnitCartQty =
        cartQtyByUnitMap[product.id]?.[selectedVariant.unit] || 0;
      const totalQty = currentUnitCartQty + qty;
      const tierState = getTierState(selectedVariant, totalQty);

      addToCart(
        {
          id: `${product.id}-${selectedVariant.unit}`,
          inventoryId: product.id,
          name: `${product.name} (${selectedVariant.unit})`,
          price: tierState.price,
          unit: selectedVariant.unit,
          prices: product.prices,
        },
        qty,
      );
      setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
      setExpandedProductId(null);
    }
  };

  return (
    <div className="bg-[#f8f9fa] max-w-3xl mx-auto min-h-screen pb-20 font-ChivoMono">
      <SearchHeader />

      <div className="px-4 py-6 space-y-6">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1 min-w-0">
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
          {/* A → Z ⇄ Z → A ပြောင်းရန် */}
          {products.length > 1 && (
            <button
              type="button"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              aria-label={
                sortDir === "asc"
                  ? "ဆေးနာမည် A မှ Z စီထားသည် — Z မှ A သို့ ပြောင်းရန်"
                  : "ဆေးနာမည် Z မှ A စီထားသည် — A မှ Z သို့ ပြောင်းရန်"
              }
              className="shrink-0 min-h-[44px] inline-flex items-center gap-1.5 whitespace-nowrap px-3.5 rounded-full border border-gray-200 bg-white text-[12px] md:text-[14px] font-bold text-gray-700 hover:border-blue-300 hover:text-primary focus-visible:ring-2 focus-visible:ring-blue-500 outline-none transition-colors"
            >
              {sortDir === "asc" ? "A → Z" : "Z → A"}
              <ArrowUpDown className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-3 md:space-y-4">
          {sortedProducts.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              expanded={expandedProductId === product.id}
              selectedVariantIndex={
                expandedProductId === product.id ? selectedVariantIndex : 0
              }
              quantity={quantities[product.id] ?? 1}
              cartQty={getProductCartQty(product.id)}
              cartQtyByUnit={cartQtyByUnitMap[product.id] || {}}
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
