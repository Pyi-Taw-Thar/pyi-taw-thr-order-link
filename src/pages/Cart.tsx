import { ShoppingCart, Trash2, Plus, Minus, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOrder = () => {
    setIsSuccess(true);
    setTimeout(() => {
      clearCart();
    }, 500);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-40 relative">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="px-4 py-4 md:py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-[#1a1a1a]" />
            <h1 className="text-[16px] md:text-2xl font-bold text-primary-dark">ဈေးဝယ်ခြင်း</h1>
          </div>
          <Link 
            to="/products" 
            className="border border-primary text-primary px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            အခြားဆေးတွေကြည့်မယ်
          </Link>
        </div>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="px-4 py-20 text-center space-y-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-gray-300" />
            </div>
            <h2 className="text-[14px] md:text-xl font-bold text-gray-500">ဈေးဝယ်ခြင်းတွင် ဆေးဝါးများ မရှိသေးပါ</h2>
            <Link to="/products" className="inline-block bg-primary text-white px-6 py-2.5 md:px-8 md:py-3 rounded-2xl font-bold text-sm md:text-base">
              ဆေးဝါးများ ကြည့်မယ်
            </Link>
          </div>
        ) : (
          <div className="px-4 space-y-4">
            {cartItems.map((item, index) => (
              <div key={item.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-blue-100 flex items-center justify-center text-primary text-[10px] md:text-xs font-bold bg-white mt-1 shrink-0">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-[#1a1a1a] text-[14px] md:text-lg leading-tight">
                        {item.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-primary font-bold text-[16px] md:text-xl font-mono">{item.price.toLocaleString()}</span>
                        <span className="text-primary text-[10px] font-bold">MMK</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="bg-[#fff1f0] p-2.5 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Quantity Selector */}
                <div className="mt-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between p-1.5 px-4 md:px-6 shadow-sm">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 md:w-12 md:h-12 bg-primary rounded-lg md:rounded-xl flex items-center justify-center text-white"
                  >
                    <Minus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
                  </button>
                  <span className="text-base md:text-2xl font-bold font-mono">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 md:w-12 md:h-12 bg-primary rounded-lg md:rounded-xl flex items-center justify-center text-white"
                  >
                    <Plus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 pt-4 z-50 shadow-[0_-4px_20px_0_rgba(0,0,0,0.05)] rounded-t-[40px]">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-end justify-between">
                <div className="space-y-0.5">
                  <h2 className="text-[14px] md:text-2xl font-bold text-primary-dark">စုစုပေါင်းဈေးနှုန်း</h2>
                  <p className="text-[8px] md:text-[10px] text-gray-400 leading-tight">
                    ပို့ဆောင်ခနှင့် အခွန်များကို ငွေချေတဲ့အခါ<br />
                    ထည့်သွင်း တွက်ချက်ပေးပါမယ်
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-400 text-xl md:text-3xl font-light">-</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-primary font-bold text-xl md:text-4xl font-mono">{totalPrice.toLocaleString()}</span>
                    <span className="text-primary text-[10px] md:text-xs font-bold">MMK</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button 
                  onClick={handleOrder}
                  className="w-full bg-primary text-white py-3 md:py-4 rounded-2xl font-bold text-[14px] md:text-xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all"
                >
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  အော်ဒါတင်မယ်
                </button>
                <button 
                  onClick={clearCart}
                  className="w-full bg-white text-gray-400 border border-gray-100 py-3 md:py-4 rounded-2xl font-bold text-[12px] md:text-lg active:scale-[0.98] transition-all"
                >
                  ဈေးဝယ်ခြင်းကိုရှင်းမယ်
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsSuccess(false)}
          />
          <div className="relative bg-white rounded-[40px] w-full max-w-sm p-8 text-center space-y-6 shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-green-500 animate-in zoom-in duration-700 delay-200" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl md:text-3xl font-bold text-[#1a1a1a]">အောင်မြင်ပါသည်</h2>
              <p className="text-[12px] md:text-base text-gray-500 font-medium">
                အော်ဒါတင်ခြင်း အောင်မြင်ခဲ့ပါသည်။<br />
                မကြာမီ ဆက်သွယ်ပေးပါမည်။
              </p>
            </div>

            <button 
              onClick={() => setIsSuccess(false)}
              className="w-full bg-primary text-white py-3 md:py-4 rounded-2xl font-bold text-[14px] md:text-lg shadow-lg active:scale-95 transition-all"
            >
              ဆက်လက်ဝယ်ယူမယ်
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
