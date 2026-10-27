import {
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Product } from "./types";

interface ProductRowProps {
  product: Product;
  expanded: boolean;
  selectedVariantIndex: number;
  quantity: number;
  cartQty: number;
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
  onToggle,
  onVariantSelect,
  onQuantityDelta,
  onQuantityChange,
  onAddToCart,
  onNavigate,
}: ProductRowProps) {
  const isOutOfStock = Boolean(product.isOutOfStock);

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

        {!isOutOfStock && expanded && (
          <div className="px-4 pb-4 space-y-2">
            <div className="text-[10px] font-bold text-gray-400 px-6 uppercase tracking-wider mb-1">
              ဝယ်ယူမည့်အမျိုးအစား ရွေးချယ်ပါ
            </div>
            {product.prices.map((price, pIdx) => (
              <div
                key={pIdx}
                    onClick={() => {
                      onVariantSelect(pIdx);
                      onQuantityChange(String(price.quantity));
                    }}
                className={`flex items-center justify-between p-3 px-6 rounded-xl cursor-pointer transition-all border-2 ${
                  selectedVariantIndex === pIdx
                    ? "bg-white border-blue-500 shadow-sm"
                    : "border-transparent hover:bg-white/50"
                }`}
              >
                <div className="flex flex-col">
                  <span
                    className={`font-bold text-[12px] md:text-[14px] ${
                      selectedVariantIndex === pIdx
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {price.quantity} {price.unit}
                  </span>
                </div>
                <div className="flex-1 border-b border-dotted border-gray-300 mx-4 h-0 mt-1" />
                <div className="flex items-baseline gap-1">
                  <span
                    className={`font-bold text-[12px] md:text-[14px] ${
                      selectedVariantIndex === pIdx
                        ? "text-blue-600"
                        : "text-gray-900"
                    }`}
                  >
                    {price.price.toLocaleString()}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      selectedVariantIndex === pIdx
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    MMK
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isOutOfStock && expanded && (
        // ဖုန်းကျဉ်းလျှင် qty input သာ ကျုံ့ပြီး "ဆေးယူမယ်" ခလုတ် ကြောင်းမခွဲ
        <div className="flex items-center justify-between gap-3 px-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 md:gap-6 min-w-0">
            <button
              onClick={() => onQuantityDelta(-1)}
              className="w-[40px] md:w-14 h-[36px] md:h-14 bg-[#007bff] rounded-md md:rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
            >
              <Minus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
            </button>
            <input
              type="number"
              value={quantity || ""}
              onChange={(e) => onQuantityChange(e.target.value)}
              className="text-[13px] md:text-3xl font-bold w-16 min-w-0 md:w-[100px] text-center bg-white rounded-lg border border-gray-200 py-2 md:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <button
              onClick={() => onQuantityDelta(1)}
              className="w-[40px] md:w-14 h-[36px] md:h-14 bg-[#007bff] rounded-md md:rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
            </button>
          </div>
          <button
            onClick={onAddToCart}
            disabled={quantity === 0}
            className={`shrink-0 whitespace-nowrap py-2 px-4 md:px-8 md:py-4 rounded-full font-bold text-[12px] md:text-lg shadow-md transition-all ${
              quantity > 0
                ? "bg-[#007bff] text-white active:scale-95"
                : "bg-[#dcdcdc] text-gray-500 cursor-not-allowed uppercase"
            }`}
          >
            ဆေးယူမယ်
          </button>
        </div>
      )}
    </div>
  );
}
