import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Info,
  Package,
  Tag,
  Pill,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { findBestTierIndex } from "../utils/pricing";
import { mapApiProduct } from "../utils/mapProduct";
import { Product } from "./products/types";
import api from "../services/axios";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, setQuantity: cartSetQuantity, cartItems } = useCart();

  // List မှ ဝင်လာလျှင် state ကို ချက်ချင်းပြရန်သာ သုံးပြီး data အသစ်ကို အမြဲ fetch လုပ်သည်
  const initialProduct: Product | null = location.state?.product ?? null;
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(!initialProduct);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const fetchProduct = async () => {
      try {
        const response = await api.get("/ecommerce/products", {
          params: { id },
        });
        const item = response.data.data?.[0];
        if (cancelled) return;
        const fresh = item ? mapApiProduct(item) : null;
        setProduct(fresh);
        // ဈေးနှုန်း tier အရေအတွက် ပြောင်းသွားပါက index range ကျော်မသွားစေရန်
        if (fresh) {
          setSelectedVariantIndex((i) => (i < fresh.prices.length ? i : 0));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // state မှ data ရှိပြီးသားဆိုလျှင် ဆက်ပြထားမည်
        if (!cancelled && !initialProduct) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (product) {
      const variant = product.prices[selectedVariantIndex];
      const cartQty = getVariantCartQty(variant.unit);
      if (cartQty > 0) {
        setQuantity(cartQty);
      } else {
        setQuantity(1);
      }
    }
  }, [selectedVariantIndex, product]);

  useEffect(() => {
    if (!product) return;
    const currentUnit = product.prices[selectedVariantIndex]?.unit;
    if (!currentUnit || quantity <= 0) return;
    const bestIndex = findBestTierIndex(product.prices, currentUnit, quantity);
    if (bestIndex !== selectedVariantIndex) {
      setSelectedVariantIndex(bestIndex);
    }
  }, [quantity, selectedVariantIndex, product]);

  const getVariantCartQty = (variantUnit: string) => {
    const variantId = `${id}-${variantUnit}`;
    const cartItem = cartItems.find((item) => item.id === variantId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      const variant = product.prices[selectedVariantIndex];
      const variantId = `${product.id}-${variant.unit}`;
      const isAlreadyInCart = getVariantCartQty(variant.unit) > 0;

      if (isAlreadyInCart) {
        cartSetQuantity(variantId, quantity);
      } else {
        addToCart(
          {
            id: variantId,
            inventoryId: product.id,
            name: `${product.name} (${variant.unit})`,
            price: variant.price,
            unit: variant.unit,
            prices: product.prices,
          },
          quantity,
        );
      }

      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-primary font-bold animate-pulse">
          အချက်အလက်များ ရှာဖွေနေပါသည်...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-500">ဆေးဝါး ရှာမတွေ့ပါ။</p>
        <button onClick={() => navigate(-1)} className="text-primary font-bold">
          နောက်သို့ပြန်သွားရန်
        </button>
      </div>
    );
  }

  const isOutOfStock = Boolean(
    product.isOutOfStock ||
      (product.quantity !== undefined && product.quantity <= 0),
  );
  const selectedVariant = product.prices[selectedVariantIndex];

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24 font-ChivoMono">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-sm font-bold text-gray-800 truncate">
          {product.name}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div
          className={`relative aspect-square rounded-[10px] overflow-hidden bg-white border border-gray-100 shadow-sm flex items-center justify-center ${
            isOutOfStock ? "opacity-75 grayscale-[20%]" : ""
          }`}
        >
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-contain opacity-90 transition-transform active:scale-110 duration-500"
            />
          ) : (
            // ပုံမရှိလျှင် ဆေးတစ်မျိုးမျိုးကို ကိုယ်စားမပြုသော ယေဘုယျ placeholder
            <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-3 text-gray-300">
              <Pill className="w-20 h-20" strokeWidth={1.25} />
              <span className="text-sm font-medium text-gray-400">ပုံ မရှိသေးပါ</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded">
                {product.code}
              </span>
              {isOutOfStock && (
                <span className="bg-red-50 text-red-500 border border-red-200 text-[10px] font-bold px-2 py-1 rounded">
                  ပစ္စည်းပြတ်နေပါသည်
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h2>
          </div>

          {isOutOfStock && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-4 py-3 rounded-2xl">
              ပစ္စည်းလက်ကျန် ပြတ်နေပါသည်
            </div>
          )}

          {product.maxPerUser ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium px-4 py-3 rounded-2xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                အကန့်အသတ်ဖြင့်သာ — တစ်ယောက်လျှင် အများဆုံး {product.maxPerUser.toLocaleString()} {product.baseUnit}
              </span>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Tag className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  အမှတ်တံဆိပ်
                </span>
              </div>
              <p className="font-bold text-[13px] text-gray-800 truncate">
                {product.brand}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Package className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  အမျိုးအစား
                </span>
              </div>
              <p className="font-bold text-[13px] text-gray-800 truncate">
                {product.category}
              </p>
            </div>
          </div>

          {product.chemicalNames && product.chemicalNames.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                ဓာတုအမည်များ
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.chemicalNames.map((chem, idx) => (
                  <span
                    key={`${chem}-${idx}`}
                    className="bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-bold px-2.5 py-1 rounded-full"
                  >
                    {chem}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 pb-10">
          <h3 className="text-primary font-bold text-sm px-1 flex items-center gap-2">
            <Info className="w-4 h-4" /> ဝယ်ယူမည့်အမျိုးအစား ရွေးချယ်ပါ
          </h3>
          <div className="grid gap-3">
            {product.prices.map((p, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariantIndex(index)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${
                  selectedVariantIndex === index
                    ? "border-primary bg-white shadow-md"
                    : "border-transparent bg-white hover:border-gray-200"
                }`}
              >
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[15px] font-bold ${selectedVariantIndex === index ? "text-primary" : "text-gray-700"}`}
                    >
                      {p.unit}
                    </span>
                    {getVariantCartQty(p.unit) > 0 && (
                      <span className="bg-green-100 text-green-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <ShoppingCart className="w-2.5 h-2.5" />{" "}
                        {getVariantCartQty(p.unit)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-lg font-bold ${selectedVariantIndex === index ? "text-primary" : "text-gray-900 font-mono"}`}
                  >
                    {p.price?.toLocaleString()}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${selectedVariantIndex === index ? "text-primary" : "text-gray-500"}`}
                  >
                    MMK
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 pt-3 pb-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col">
              <span className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                ကျသင့်ငွေ စုစုပေါင်း
              </span>
              {getVariantCartQty(selectedVariant.unit) > 0 && (
                <span className="text-green-600 text-[9px] font-bold mt-0.5">
                  စျေးခြင်းထဲတွင် - {getVariantCartQty(selectedVariant.unit)}{" "}
                  ခုရှိနေသည်
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                {(quantity * selectedVariant.price).toLocaleString()}
              </span>
              <span className="text-[12px] font-bold text-primary">MMK</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div
              className={`flex items-center gap-4 bg-gray-100 p-1.5 rounded-2xl ${
                isOutOfStock ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isOutOfStock}
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-600 hover:text-primary transition-all active:scale-90 shadow-sm"
              >
                <Minus className="w-4 h-4 stroke-[3px]" />
              </button>
              <span className="text-xl font-bold font-mono w-8 text-center text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={isOutOfStock}
                className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white transition-all active:scale-90 shadow-md shadow-blue-100"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || quantity === 0}
              className={`flex-1 py-3 rounded-2xl font-bold text-[15px] tracking-wide transition-all shadow-lg ${
                isOutOfStock || quantity === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed border-b-4 border-gray-400"
                  : "bg-primary text-white active:scale-95 shadow-blue-100 border-b-4 border-blue-700"
              }`}
            >
              {isOutOfStock ? "ပစ္စည်းပြတ်နေပါသည်" : "ဆေးယူမယ်"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
