import {
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Product } from "./types";
import { getTierState } from "../../utils/pricing";

interface ProductRowProps {
  product: Product;
  expanded: boolean;
  selectedVariantIndex: number;
  quantity: number;
  cartQty: number;
  cartQtyByUnit: Record<string, number>;
  onToggle: () => void;
  onVariantSelect: (index: number) => void;
  onQuantityDelta: (delta: number) => void;
  onQuantityChange: (value: string) => void;
  onAddToCart: () => void;
  onNavigate: () => void;
}

export default function ProductRow({
  product,
  expanded,
  selectedVariantIndex,
  quantity,
  cartQty,
  cartQtyByUnit,
  onToggle,
  onVariantSelect,
  onQuantityDelta,
  onQuantityChange,
  onAddToCart,
  onNavigate,
}: ProductRowProps) {
  const isOutOfStock = Boolean(product.isOutOfStock);
  const selectedVariant = product.prices[selectedVariantIndex] || product.prices[0];
  const unitCartQty = selectedVariant ? (cartQtyByUnit[selectedVariant.unit] || 0) : 0;
  // ခြင်းထဲရှိ အရေအတွက်နှင့် stepper တွင် ထည့်ထားသော အရေအတွက် ပေါင်း၍ tier စစ်ဆေးသည်
  const q = unitCartQty + (quantity || 0);
  const tierState = selectedVariant ? getTierState(selectedVariant, q) : null;

  return (
    <div className="space-y-4">
      <div
        className={`bg-white rounded-2xl py-0 md:py-2 border border-gray-100 shadow-sm transition-all overflow-hidden ${
          isOutOfStock ? "opacity-60 bg-gray-50/70" : ""
        } ${expanded && !isOutOfStock ? "bg-[#f2f2f2]" : ""}`}
      >
        {/* ဘယ်ဘက် (နာမည်/tag) က ကျန်နေရာသာယူ၍ မဆန့်လျှင် နာမည်သာ ကြောင်းခွဲ — ညာဘက်ခလုတ် size မပြောင်း */}
        <div className="p-3 md:p-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <h3
              onClick={onNavigate}
              className="text-[#1a1a1a] font-bold text-[14px] md:text-[18px] leading-snug break-words cursor-pointer hover:text-blue-600 transition-colors"
            >
              {product.name}
            </h3>
            {((product.chemicalNames && product.chemicalNames.length > 0) || cartQty > 0) && (
              <div className="flex flex-wrap gap-1">
                {cartQty > 0 && (
                  <span className="bg-green-100 text-green-600 text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShoppingCart className="w-3 h-3" /> {cartQty}
                  </span>
                )}
                {(product.chemicalNames || []).map((chem, idx) => (
                  <span
                    key={`${chem}-${idx}`}
                    className="bg-blue-50 text-blue-600 text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-full"
                  >
                    {chem}
                  </span>
                ))}
              </div>
            )}
          </div>
          {isOutOfStock ? (
            <span className="shrink-0 min-w-[120px] md:min-w-[156px] inline-flex items-center justify-center whitespace-nowrap text-[12px] md:text-[15px] font-semibold text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
              ပစ္စည်းပြတ်
            </span>
          ) : (
            <button
              onClick={onToggle}
              className={`shrink-0 min-w-[120px] md:min-w-[156px] inline-flex items-center justify-center whitespace-nowrap text-primary gap-1 border border-blue-500 px-3 py-1.5 rounded-full text-[12px] md:text-[15px] font-semibold transition-colors ${
                expanded ? "bg-white" : "hover:bg-blue-50"
              }`}
            >
              {expanded ? "ပိတ်မယ်" : "ဈေးကြည့်မယ်"}
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* ဖွင့်ထားသောအခါ ပြသသည့် Option 2 Unit ခလုတ်များ၊ ဈေးနှုန်းနှင့် Tier စာသား */}
        {!isOutOfStock && expanded && (
          <div className="px-4 pb-4 space-y-3 border-t border-gray-100/60 pt-3">
            {/* ① Unit ရွေးချယ်ရန် Segmented control ခလုတ်များ */}
            <div className="grid grid-cols-3 gap-2">
              {product.prices.map((price, pIdx) => {
                const isSelected = selectedVariantIndex === pIdx;
                const countInCart = cartQtyByUnit[price.unit] || 0;
                return (
                  <button
                    key={price.unit}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      onVariantSelect(pIdx);
                      onQuantityChange("1");
                    }}
                    className={`min-h-[44px] px-2 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs md:text-sm font-bold transition-all ${
                      isSelected
                        ? "bg-white text-primary border-2 border-blue-500 shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
                    }`}
                  >
                    <span>{price.unit}</span>
                    {countInCart > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-green-100 text-green-700">
                        {countInCart.toLocaleString("en-US")}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ② ရွေးချယ်ထားသော unit ၏ ဈေးနှုန်း (လက်ကားဈေးရရှိပါက လက်လီဈေးကို ဖြတ်ပြသည်) */}
            {selectedVariant && tierState && (
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-xl md:text-2xl font-bold text-gray-900">
                  {tierState.price.toLocaleString("en-US")} ကျပ်
                </span>
                <span className="text-xs md:text-sm text-gray-500">
                  / {selectedVariant.unit}
                </span>
                {tierState.current && tierState.price < tierState.retailPrice && (
                  <span className="text-sm md:text-base text-gray-400 line-through">
                    {tierState.retailPrice.toLocaleString("en-US")}
                  </span>
                )}
              </div>
            )}

            {/* ③ Wholesale Tier စာသားများ */}
            {selectedVariant?.wholesaleTiers &&
              selectedVariant.wholesaleTiers.length > 0 &&
              tierState && (
                <div className="space-y-1">
                  {/* အဆင့် ၁ - မည်သည့် tier မှ မရောက်သေးသော အခြေအနေ (current = null) */}
                  {!tierState.current && tierState.next && (
                    <>
                      <div className="text-xs md:text-sm font-semibold text-amber-700">
                        {tierState.next.minQty.toLocaleString("en-US")} {selectedVariant.unit}နဲ့အထက် {tierState.next.price.toLocaleString("en-US")}
                      </div>
                      <div className="text-xs md:text-sm font-semibold text-amber-700">
                        နောက် {tierState.remaining.toLocaleString("en-US")} {selectedVariant.unit} ထပ်ယူရင် လက်ကားဈေး ရမယ်
                      </div>
                    </>
                  )}

                  {/* အဆင့် ၂ - လက်ရှိ tier ရောက်ရှိပြီး နောက်ထပ် tier ရှိသေးသော အခြေအနေ */}
                  {tierState.current && tierState.next && (
                    <>
                      <div className="text-xs md:text-sm font-semibold text-green-700">
                        ✓ လက်ကားဈေး ရပြီ
                      </div>
                      <div className="text-xs md:text-sm font-semibold text-amber-700">
                        {tierState.next.minQty.toLocaleString("en-US")} {selectedVariant.unit}နဲ့အထက် {tierState.next.price.toLocaleString("en-US")}
                      </div>
                      <div className="text-xs md:text-sm font-semibold text-amber-700">
                        နောက် {tierState.remaining.toLocaleString("en-US")} {selectedVariant.unit} ထပ်ယူရင် {tierState.next.price.toLocaleString("en-US")} ဈေး ရမယ်
                      </div>
                    </>
                  )}

                  {/* အဆင့် ၃ - နောက်ဆုံး tier သို့ ရောက်ရှိပြီးဖြစ်သော အခြေအနေ */}
                  {tierState.current && !tierState.next && (
                    <div className="text-xs md:text-sm font-semibold text-green-700">
                      ✓ အကောင်းဆုံး လက်ကားဈေး ရပြီ
                    </div>
                  )}

                  {/* Cart ထဲတွင် ရှိပြီးသား unit အတွက် အသိပေးစာသား */}
                  {unitCartQty > 0 && (
                    <div className="text-xs text-gray-500">
                      (ခြင်းထဲ {unitCartQty.toLocaleString("en-US")} {selectedVariant.unit} ပါပြီး တွက်ထားသည်)
                    </div>
                  )}
                </div>
              )}

            {/* ④ အရေအတွက် stepper ၊ ဆေးယူမယ် ခလုတ် နှင့် စုစုပေါင်း ကျသင့်ငွေ */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 md:gap-4 min-w-0">
                  <button
                    type="button"
                    onClick={() => onQuantityDelta(-1)}
                    className="w-[40px] md:w-14 h-[36px] md:h-14 bg-primary rounded-lg md:rounded-2xl flex items-center justify-center text-white shadow active:scale-95 transition-transform"
                  >
                    <Minus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
                  </button>
                  <input
                    type="number"
                    value={quantity || ""}
                    onChange={(e) => onQuantityChange(e.target.value)}
                    className="text-[13px] md:text-2xl font-bold w-16 min-w-0 md:w-[100px] text-center bg-white rounded-lg border border-gray-200 py-1.5 md:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                  <button
                    type="button"
                    onClick={() => onQuantityDelta(1)}
                    className="w-[40px] md:w-14 h-[36px] md:h-14 bg-primary rounded-lg md:rounded-2xl flex items-center justify-center text-white shadow active:scale-95 transition-transform"
                  >
                    <Plus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onAddToCart}
                  disabled={quantity === 0}
                  className={`shrink-0 whitespace-nowrap py-2.5 px-4 md:px-8 rounded-full font-bold text-[13px] md:text-lg shadow transition-all ${
                    quantity > 0
                      ? "bg-primary text-white hover:bg-blue-600 active:scale-95"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed uppercase"
                  }`}
                >
                  ဆေးယူမယ်
                </button>
              </div>
              <div className="text-[12px] md:text-sm font-medium text-gray-600">
                စုစုပေါင်း{" "}
                <span className="font-bold text-gray-900">
                  {(((tierState?.price || 0) * (quantity || 0))).toLocaleString("en-US")}
                </span>{" "}
                ကျပ်
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
