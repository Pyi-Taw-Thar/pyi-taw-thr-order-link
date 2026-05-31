import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  showBadge?: boolean;
  showPrice?: boolean;
  buttonText?: string;
  data?: any;
}

export default function ProductCard({ id, name, price, showBadge, showPrice, buttonText, data }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 rounded-lg px-3 py-6 md:px-6 md:py-8 flex flex-col justify-between space-y-4 border border-transparent hover:border-blue-100 transition-all">
      <div className="space-y-0">
        <h3 className="text-gray-800 font-bold text-[14px] md:text-lg line-clamp-2 min-h-[32px]">
          {name}
        </h3>
        {showBadge && (
          <span className="inline-block bg-yellow-100 text-[#BFGA02] text-[9px] md:text-base font-bold px-2 py-1 rounded w-fit">
            အကန့်သတ်ဖြင့်သာ
          </span>
        )}
      </div>
      {showPrice && (
        <p className="text-primary font-bold text-[13px] font-mono">
          {price.toLocaleString()} <span className="text-[9px]">MMK</span>
        </p>
      )}
      <button
        onClick={() => navigate(`/product/${id}`, { state: { product: data } })}
        className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all text-[11px] md:text-lg"
      >
        {buttonText || 'ဆေးမှာမယ်'}
      </button>
    </div>
  );
}
