import { ShoppingCart, Trash2, Plus, Minus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from '../services/axios';
import authService from '../services/auth.service';

interface ErrorDetails {
  code?: 'OUT_OF_STOCK' | 'LIMIT_EXCEEDED' | 'PRODUCT_UNAVAILABLE' | 'INVALID_QUANTITY' | 'STOCK_CHANGED';
  inventoryId?: string;
  productName?: string;
}

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, setQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  // Error ဖြစ်ပေါ်သည့် ပစ္စည်းအတွက် highlight နှင့် short warning message ပြရန် state
  const [highlightedInventoryId, setHighlightedInventoryId] = useState<string | null>(null);
  const [itemErrorText, setItemErrorText] = useState<string>('');

  // Cart ထဲရှိ ပစ္စည်းအရေအတွက် ပြောင်းလဲခြင်း သို့မဟုတ် ဖယ်ရှားခြင်း ပြုလုပ်ပါက highlight ဖယ်ရှားသည်
  const handleQuantityChange = (itemId: string, invId: string, newQty: number) => {
    if (highlightedInventoryId === invId) {
      setHighlightedInventoryId(null);
      setItemErrorText('');
    }
    setQuantity(itemId, newQty);
  };

  const handleUpdateQuantity = (itemId: string, invId: string, delta: number) => {
    if (highlightedInventoryId === invId) {
      setHighlightedInventoryId(null);
      setItemErrorText('');
    }
    updateQuantity(itemId, delta);
  };

  const handleRemoveFromCart = (itemId: string, invId: string) => {
    if (highlightedInventoryId === invId) {
      setHighlightedInventoryId(null);
      setItemErrorText('');
    }
    removeFromCart(itemId);
  };

  const handleOrder = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Login screen ပြပြီး login ဝင်လျှင် /cart သို့ ပြန်ရောက်မည် (cart item များ မပျောက်)
      authService.logout();
      window.location.reload();
      return;
    }

    setOrderLoading(true);
    setOrderError('');

    try {
      const products = cartItems.map(item => ({
        inventoryId: item.inventoryId,
        quantity: item.quantity,
        unit: item.unit,
      }));

      await api.post('/ecommerce/order', { products });
      setIsSuccess(true);
      // အော်ဒါအောင်မြင်ပါက highlight ရှင်းလင်းသည်
      setHighlightedInventoryId(null);
      setItemErrorText('');
      setTimeout(() => clearCart(), 500);
      // လက်ကျန် ပြောင်းသွား၍ product cache ကို နောက်တစ်ကြိမ်ကြည့်လျှင် အသစ်ယူစေ
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    } catch (err) {
      const msg = (axios.isAxiosError(err) && err.response?.data?.message) || 'အော်ဒါတင်ရာတွင် ပြဿနာရှိနေပါသည်။ နောက်မှ ထပ်ကြိုးစားပါ။';
      setOrderError(msg);

      // Backend မှ ပြန်ပို့သော details ပါရှိပါက သက်ဆိုင်ရာ ပစ္စည်း row ကို အနီရောင် border ဖြင့် highlight ပြသည်
      if (axios.isAxiosError(err) && err.response?.data?.details) {
        const details: ErrorDetails = err.response.data.details;
        if (details.inventoryId) {
          setHighlightedInventoryId(details.inventoryId);
          let shortMsg = 'အော်ဒါတွင် ပြဿနာရှိပါသည်';
          if (details.code === 'OUT_OF_STOCK') {
            shortMsg = 'လက်ကျန် မလုံလောက်ပါ — အရေအတွက် လျှော့ပါ';
          } else if (details.code === 'PRODUCT_UNAVAILABLE') {
            shortMsg = 'ဝယ်၍ မရတော့ပါ — ဖယ်ပါ';
          } else if (details.code === 'LIMIT_EXCEEDED') {
            shortMsg = 'ဝယ်ခွင့် ကျော်နေပါသည်';
          } else if (details.code === 'INVALID_QUANTITY') {
            shortMsg = 'အရေအတွက် မမှန်ကန်ပါ';
          } else if (details.code === 'STOCK_CHANGED') {
            shortMsg = 'လက်ကျန် ပြောင်းသွားပါသည်';
          }
          setItemErrorText(shortMsg);
        }
      }
    } finally {
      setOrderLoading(false);
    }
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
          <div className="px-4 space-y-4 pb-20">
            {cartItems.map((item, index) => {
              const isHighlighted = highlightedInventoryId === item.inventoryId;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl p-5 border shadow-sm relative overflow-hidden transition-all duration-300 ${
                    isHighlighted ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-full border flex items-center justify-center text-[10px] md:text-xs font-bold mt-1 shrink-0 ${
                          isHighlighted
                            ? 'border-red-200 text-red-600 bg-red-50'
                            : 'border-blue-100 text-primary bg-white'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-[#1a1a1a] text-[14px] md:text-lg leading-tight">
                          {item.name}
                        </h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-primary font-bold text-[16px] md:text-xl font-mono">{item.price.toLocaleString()}</span>
                          <span className="text-primary text-[10px] font-bold">MMK</span>
                          <span className="text-gray-400 text-[10px]">/ {item.unit}</span>
                        </div>
                        {/* Line subtotal */}
                        <p className="text-[11px] md:text-sm text-gray-500 font-mono">
                          {item.quantity} × {item.price.toLocaleString()} ={" "}
                          <span className="font-bold text-gray-800">
                            {(item.quantity * item.price).toLocaleString()} MMK
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.id, item.inventoryId)}
                      className="bg-[#fff1f0] p-2.5 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                      title="ဖယ်ရှားမည်"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mt-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between p-1.5 px-4 md:px-6 shadow-sm">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.inventoryId, -1)}
                      className="w-8 h-8 md:w-12 md:h-12 bg-primary rounded-lg md:rounded-xl flex items-center justify-center text-white"
                    >
                      <Minus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, item.inventoryId, parseInt(e.target.value) || 1)}
                      className="text-base md:text-2xl font-bold font-mono w-12 md:w-20 text-center bg-transparent border-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.inventoryId, 1)}
                      className="w-8 h-8 md:w-12 md:h-12 bg-primary rounded-lg md:rounded-xl flex items-center justify-center text-white"
                    >
                      <Plus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
                    </button>
                  </div>

                  {/* Highlight warning message */}
                  {isHighlighted && itemErrorText && (
                    <div className="mt-3 pt-2.5 border-t border-red-100 flex items-center gap-1.5 text-red-600 text-[11px] md:text-sm font-medium animate-in fade-in duration-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{itemErrorText}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 pt-4 z-50 shadow-[0_-4px_20px_0_rgba(0,0,0,0.05)] rounded-t-[40px]">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-end justify-between">
                <div className="space-y-0.5">
                  <h2 className="text-[14px] md:text-2xl font-bold text-primary-dark">စုစုပေါင်းဈေးနှုန်း</h2>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-primary font-bold text-xl md:text-4xl font-mono">{totalPrice.toLocaleString()}</span>
                    <span className="text-primary text-[10px] md:text-xs font-bold">MMK</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleOrder}
                  disabled={orderLoading}
                  className="w-full bg-primary text-white py-3 md:py-4 rounded-2xl font-bold text-[14px] md:text-xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  {orderLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      တင်နေပါသည်...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                      အော်ဒါတင်မယ်
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setHighlightedInventoryId(null);
                    setItemErrorText('');
                    clearCart();
                  }}
                  disabled={orderLoading}
                  className="w-full bg-white text-gray-400 border border-gray-100 py-3 md:py-4 rounded-2xl font-bold text-[12px] md:text-lg active:scale-[0.98] transition-all disabled:opacity-40"
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
              onClick={() => {
                setIsSuccess(false);
                navigate("/");
              }}
              className="w-full bg-primary text-white py-3 md:py-4 rounded-2xl font-bold text-[14px] md:text-lg shadow-lg active:scale-95 transition-all"
            >
              ဆက်လက်ဝယ်ယူမယ်
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {orderError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setOrderError('')}
          />
          <div className="relative bg-white rounded-[40px] w-full max-w-sm p-8 text-center space-y-6 shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 animate-in zoom-in duration-700 delay-200" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl md:text-3xl font-bold text-[#1a1a1a]">မအောင်မြင်ပါ</h2>
              <p className="text-[12px] md:text-base text-red-500 font-medium whitespace-pre-wrap">
                {orderError}
              </p>
            </div>

            <button
              onClick={() => setOrderError('')}
              className="w-full bg-primary text-white py-3 md:py-4 rounded-2xl font-bold text-[14px] md:text-lg shadow-lg active:scale-95 transition-all"
            >
              ပြန်ကြိုးစားမည်
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
