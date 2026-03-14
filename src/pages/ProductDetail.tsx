import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import paracetamolImg from '../assets/images/products/paracetamol.png';

export default function ProductDetail() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const product = {
    id: 3, // Matching ID from Products.tsx for "ဟေမီတွံ ဆီးချို" or similar, but following the image.
    name: 'ပါရာစီတမော ၅၀၀ မီလီဂရမ် (၁၀ လုံးပါ)',
    price: 1500,
    description: 'The ပါရာစီတမော ၅၀၀ မီလီဂရမ် (၁၀ လုံးပါ) represents the highest standard of OTC Medicine care. Meticulously developed to provide pharmaceutical-grade support, it meets the rigorous safety requirements of healthcare essentials.',
    brand: '0001 - OTC Medicine Series',
    year: '2024',
    guarantee: '2 Years'
  };

  const tabs = [
    'ဆေးဝါးအချက်အလက်',
    'သောက်ပုံအသေးစိတ်',
    'အကျိုးကျေးဇူးများ'
  ];

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price
      }, quantity);
      setQuantity(0);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-800 truncate">
          {product.name}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Product Image */}
        <div className="relative aspect-square rounded-[40px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
          <img
            src={paracetamolImg}
            alt={product.name}
            className="w-full h-full object-contain p-8"
          />
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-center gap-3 py-2">
          <span className="text-[#1a1a1a] font-bold text-xl md:text-2xl">
            တစ်ကဒ်ဈေးနှုန်း -
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-[#007FFF] font-bold text-2xl md:text-3xl font-mono">
              {product.price.toLocaleString()}
            </span>
            <span className="text-[#007FFF] font-bold text-lg md:text-xl font-mono">
              MMK
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <div className="flex border-b border-gray-100">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex-1 pb-3 text-[13px] md:text-base font-bold transition-all relative ${activeTab === index ? 'text-blue-600' : 'text-gray-400'
                  }`}
              >
                {tab}
                {activeTab === index && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-gray-600 leading-relaxed text-[13px] md:text-base">
              {product.description}
            </p>
          </div>
        </div>

        {/* Specs Table */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between py-3 border-b border-dotted border-gray-200">
            <span className="text-gray-700 font-bold text-[13px] md:text-base">အမှတ်တံဆိပ်</span>
            <span className="text-gray-900 font-bold text-[13px] md:text-base">{product.brand}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-dotted border-gray-200">
            <span className="text-gray-700 font-bold text-[13px] md:text-base">သက်တမ်းကုန်ဆုံး/ထုတ်လုပ်သည့် ခုနှစ်</span>
            <span className="text-gray-900 font-bold text-[13px] md:text-base font-mono">{product.year}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-dotted border-gray-200">
            <span className="text-gray-700 font-bold text-[13px] md:text-base">ဆေးအာမခံ</span>
            <span className="text-gray-900 font-bold text-[13px] md:text-base font-mono">{product.guarantee}</span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              className="w-[40px] md:w-14 h-[36px] md:h-14 bg-[#E5E5E5] rounded-lg md:rounded-2xl flex items-center justify-center text-gray-600 transition-all active:scale-95"
            >
              <Minus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
            </button>
            <span className="text-lg md:text-3xl font-bold font-mono w-6 md:w-12 text-center text-[#1a1a1a]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 md:w-14 h-8 md:h-14 bg-primary rounded-lg md:rounded-2xl flex items-center justify-center text-white transition-all active:scale-95 shadow-lg shadow-blue-100"
            >
              <Plus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={quantity === 0}
            className={`py-2 px-6 md:px-10 md:py-4 rounded-full font-bold text-sm md:text-lg transition-all shadow-md ${quantity > 0
                ? 'bg-primary text-white active:scale-95'
                : 'bg-[#dcdcdc] text-gray-500 cursor-not-allowed uppercase'
              }`}
          >
            ဆေးယူမယ်
          </button>
        </div>
      </div>
    </div>
  );
}
