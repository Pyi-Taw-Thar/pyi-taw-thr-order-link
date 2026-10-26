import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  showBadge?: boolean;
  showPrice?: boolean;
  buttonText?: string;
  data?: any;
  isOutOfStock?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  showBadge,
  showPrice,
  buttonText,
  data,
  isOutOfStock = false,
}: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-gray-50 rounded-lg px-3 py-6 md:px-6 md:py-8 flex flex-col justify-between space-y-4 border border-transparent hover:border-blue-100 transition-all ${
        isOutOfStock ? "opacity-60 grayscale-[30%] bg-gray-100/80" : ""
      }`}
    >
      <div className="space-y-1">
        <h3 className="text-gray-800 font-bold text-[14px] md:text-lg line-clamp-2 min-h-[32px]">
          {name}
        </h3>
        {isOutOfStock ? (
          <span className="inline-block bg-red-100 text-red-600 text-[9px] md:text-xs font-bold px-2 py-1 rounded w-fit">
            ပစ္စည်းပြတ်နေပါသည်
          </span>
        ) : showBadge ? (
          <span className="inline-block bg-yellow-100 text-[#BFGA02] text-[9px] md:text-base font-bold px-2 py-1 rounded w-fit">
            အကန့်သတ်ဖြင့်သာ
          </span>
        ) : null}
      </div>
      {showPrice && (
        <p className="text-primary font-bold text-[13px] font-mono">
          {price.toLocaleString()} <span className="text-[9px]">MMK</span>
        </p>
      )}
      <button
        disabled={isOutOfStock}
        onClick={() =>
          !isOutOfStock &&
          navigate(`/product/${id}`, { state: { product: data } })
        }
        className={`w-full py-2.5 rounded-xl font-bold transition-all text-[11px] md:text-lg ${
          isOutOfStock
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
        }`}
      >
        {isOutOfStock ? "ပစ္စည်းပြတ်နေပါသည်" : buttonText || "ဆေးမှာမယ်"}
      </button>
    </div>
  );
}
