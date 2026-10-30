import { useState, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import { Product } from "./types";
import { getTierState } from "../../utils/pricing";

// ProductList နှင့် AllProducts တို့တွင် product row ၏ expand, quantity, variant နှင့် cart လုပ်ဆောင်ချက်များကို မျှဝေသုံးစွဲရန် hook
export function useProductRowActions() {
  const { addToCart, cartItems } = useCart();
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

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

  return {
    expandedProductId,
    selectedVariantIndex,
    quantities,
    toggleProduct,
    setSelectedVariantIndex,
    updateQuantity,
    setQuantityValue,
    getProductCartQty,
    cartQtyByUnitMap,
    handleAddToCart,
  };
}
