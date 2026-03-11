import { Search as SearchIcon, X, ArrowLeft, History, ShoppingCart, Plus, Minus, ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Reusing product data for searching
const productData = [
  { id: 1, name: 'တစ်ကိုယ်လုံး နာလုံးအားဆေး', price: 1400 },
  { id: 2, name: 'ယူငါးကောင် ဆီးချို', price: 5000 },
  { id: 3, name: 'ဟေမီတွံ ဆီးချို', price: 1500 },
  { id: 4, name: 'ရွှေသဇင် ဆီးချို', price: 3500 },
  { id: 6, name: 'အမေ့သား ဆီးချို', price: 800 },
  { id: 7, name: 'ဆေးနက်ကျော် (ဘုရားကြီး)', price: 12000 },
  { id: 8, name: 'ရှန်ဘာလာ ဆီးချိုဆေး', price: 2000 },
  { id: 9, name: 'ယူငါးကောင် သွေးတိုး', price: 4500 },
  { id: 10, name: 'ဟေမီတွံ သွေးတိုးကျ', price: 1800 },
];

export default function Search() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>(['ဆီးချိုဆေး', 'အားဆေး', 'mask']);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = query 
    ? productData.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q && !history.includes(q)) {
      setHistory(prev => [q, ...prev.slice(0, 4)]);
    }
  };

  const clearHistory = () => setHistory([]);

  const toggleProduct = (id: number) => {
    setExpandedProductId(expandedProductId === id ? null : id);
  };

  const updateQuantity = (id: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const handleAddToCart = (product: any) => {
    const qty = quantities[product.id] || 0;
    if (qty > 0) {
      addToCart(product, qty);
      setQuantities(prev => ({ ...prev, [product.id]: 0 }));
      setExpandedProductId(null);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Search Header */}
      <div className="sticky top-0 z-50 bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="ဆေးဝါးနှင့်ကျန်းမာရေးပစ္စည်းများ ရှာဖွေရန်"
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 px-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 bg-gray-200 rounded-full text-white hover:bg-gray-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-8">
        {!query ? (
          /* Search History */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-500" />
                ရှာဖွေခဲ့ဖူးသည်များ
              </h2>
              <button 
                onClick={clearHistory}
                className="text-sm text-blue-500 font-medium hover:underline"
              >
                အကုန်ဖျက်မယ်
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.length > 0 ? (
                history.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(item)}
                    className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-full text-sm text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
                  >
                    {item}
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic py-4">ရှာဖွေမှုမှတ်တမ်း မရှိသေးပါ</p>
              )}
            </div>
          </div>
        ) : (
          /* Search Results */
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">
              ရှာဖွေတွေ့ရှိမှုများ ({results.length})
            </h2>
            <div className="space-y-3">
              {results.length > 0 ? (
                results.map((product) => (
                  <div key={product.id} className="space-y-4">
                    <div
                      className={`bg-white rounded-2xl border border-gray-100 shadow-sm transition-all overflow-hidden ${
                        expandedProductId === product.id ? 'bg-[#f2f2f2]' : ''
                      }`}
                    >
                      <div className="p-3 pr-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full border border-blue-100 flex items-center justify-center text-blue-500 text-sm font-bold bg-white">
                            {product.id}
                          </div>
                          <span className="text-[#1a1a1a] font-bold text-base">
                            {product.name}
                          </span>
                        </div>
                        <button 
                          onClick={() => toggleProduct(product.id)}
                          className={`flex items-center gap-1 border px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                            expandedProductId === product.id 
                              ? 'bg-white border-blue-500 text-blue-500' 
                              : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          {expandedProductId === product.id ? 'ပိတ်မယ်' : 'ဈေးကြည့်မယ်'}
                          {expandedProductId === product.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {expandedProductId === product.id && (
                        <div className="px-10 pb-4 space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">မူရင်းဈေးနှုန်း</span>
                            <div className="flex-1 border-b border-dotted border-gray-400 mx-4 h-0 mt-2" />
                            <div className="flex items-baseline gap-1">
                              <span className="text-blue-600 font-bold text-lg">{product.price.toLocaleString()}</span>
                              <span className="text-blue-600 text-[10px] font-bold">MMK</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {expandedProductId === product.id && (
                      <div className="flex items-center justify-between px-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-6">
                          <button 
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-14 h-14 bg-[#007bff] rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
                          >
                            <Minus className="w-6 h-6 stroke-[3px]" />
                          </button>
                          <span className="text-3xl font-bold min-w-[1.2em] text-center">
                            {quantities[product.id] || 0}
                          </span>
                          <button 
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-14 h-14 bg-[#007bff] rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
                          >
                            <Plus className="w-6 h-6 stroke-[3px]" />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          disabled={(quantities[product.id] || 0) === 0}
                          className={`px-8 py-4 rounded-full font-bold text-lg shadow-md transition-all ${
                            (quantities[product.id] || 0) > 0
                              ? 'bg-[#007bff] text-white active:scale-95'
                              : 'bg-[#dcdcdc] text-gray-500 cursor-not-allowed uppercase'
                          }`}
                        >
                          ဆေးယူမယ်
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <SearchIcon className="w-10 h-10 text-gray-200" />
                  </div>
                  <p className="text-gray-400 font-medium whitespace-pre-wrap">
                    စိတ်မရှိပါနဲ့... ရှာဖွေမှုအတွက်{'\n'}အချက်အလက် မရှိသေးပါ
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
