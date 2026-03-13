import { Search, ChevronDown, Filter, XCircle, ChevronUp, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

interface PriceTier {
  quantity: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  prices: PriceTier[];
}

interface Category {
  title: string;
  products: Product[];
}

interface DrawerCategory {
  title: string;
  count: number;
}

const productData: Category[] = [
  {
    title: 'ဆီးချိုရောဂါဆေးများ',
    products: [
      {
        id: 1,
        name: 'တစ်ကိုယ်လုံး နာလုံးအားဆေး',
        prices: [
          { quantity: '10 ကတ်', price: 1400 },
          { quantity: '50 ကတ်', price: 1300 },
          { quantity: '100 ကတ်', price: 1200 },
        ]
      },
      {
        id: 2,
        name: 'ယူငါးကောင် ဆီးချို',
        prices: [
          { quantity: '1 ဗူး', price: 5000 },
        ]
      },
      {
        id: 3,
        name: 'ဟေမီတွံ ဆီးချို',
        prices: [
          { quantity: '10 လုံး', price: 1500 },
        ]
      },
      {
        id: 4,
        name: 'ရွှေသဇင် ဆီးချို',
        prices: [
          { quantity: '1 ဗူး', price: 3500 },
        ]
      },
      {
        id: 6,
        name: 'အမေ့သား ဆီးချို',
        prices: [
          { quantity: '1 ကတ်', price: 800 },
        ]
      },
      {
        id: 7,
        name: 'ဆေးနက်ကျော် (ဘုရားကြီး)',
        prices: [
          { quantity: '1 ဗူး', price: 12000 },
        ]
      },
      {
        id: 8,
        name: 'ရှန်ဘာလာ ဆီးချိုဆေး',
        prices: [
          { quantity: '1 ထုပ်', price: 2000 },
        ]
      },
    ]
  },
  {
    title: 'သွေးတိုးရောဂါဆေးများ',
    products: [
      {
        id: 10,
        name: 'ယူငါးကောင် သွေးတိုး',
        prices: [
          { quantity: '1 ဗူး', price: 4500 },
        ]
      },
      {
        id: 11,
        name: 'ဟေမီတွံ သွေးတိုးကျ',
        prices: [
          { quantity: '10 လုံး', price: 1800 },
        ]
      },
    ]
  }
];

const drawerCategories: DrawerCategory[] = [
  { title: 'နာတာရှည်နှင့် အတွင်းပိုင်းရောဂါများ', count: 21 },
  { title: 'အရိုး၊ အကြောနှင့် အမျိုးသားကျန်းမာရေး', count: 97 },
  { title: 'အသက်ရှူလမ်းကြောင်းနှင့် အအေးမိရောဂါ', count: 52 },
  { title: 'အထူးကုသမှုဆေးများ', count: 70 },
  { title: 'အာရုံခံအင်္ဂါနှင့် သွားကျန်းမာရေး', count: 44 },
  { title: 'တိုင်းရင်းဆေးနှင့် နာမည်ကြီးတံဆိပ်များ', count: 38 },
  { title: 'အားဖြည့်ပစ္စည်းနှင့် လူသုံးကုန်', count: 19 },
];

import { useNavigate } from 'react-router-dom';

export default function Products() {
  const navigate = useNavigate();
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { addToCart } = useCart();

  const toggleProduct = (id: number) => {
    setExpandedProductId(expandedProductId === id ? null : id);
  };

  const updateQuantity = (id: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 0;
    if (qty > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.prices[0].price
      }, qty);

      setQuantities(prev => ({ ...prev, [product.id]: 0 }));
      setExpandedProductId(null);
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Search Bar section */}
      <div className="bg-white px-4 py-4 sticky top-16 z-40">
        <div
          onClick={() => navigate('/search')}
          className="relative max-w-2xl mx-auto cursor-text"
        >
          <div className="w-full bg-[#f8f9fa] border border-gray-200 rounded-full py-3 px-6 pr-12 text-sm text-gray-400">
            ဆေးဝါးနှင့်ကျန်းမာရေးပစ္စည်းများ ရှာဖွေရန်
          </div>
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-8 max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <button
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="flex items-center gap-2 group transition-all"
            >
              <h1 className=" md:text-2xl text-[14px] font-bold text-primary group-hover:text-blue-600 transition-colors">နာတာရှည်ရောဂါများ</h1>
              <ChevronDown className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            </button>
            <p className="text-gray-500 text-[10px]">
              ရောဂါ <span className="font-bold text-gray-800">၅</span> မျိုး / ဆေးဝါး <span className="font-bold text-gray-800">၃၁</span> မျိုး
            </p>
          </div>
          {/* <button className="flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-full text-[8px] font-semibold bg-white hover:bg-blue-50 transition-colors">
            ရောဂါအလိုက်ကြည့်မယ်
            <Filter className="w-4 h-4" />
          </button> */}
        </div>

        {/* Product Sections */}
        {productData.map((category, catIdx) => (
          <div key={catIdx} className="space-y-4">
            <h2 className="text-blue-600 font-bold text-base px-1">
              {category.title}
            </h2>
            <div className="space-y-3">
              {category.products.map((product) => (
                <div key={product.id} className="space-y-4">
                  <div
                    className={`bg-white rounded-2xl border border-gray-100 shadow-sm transition-all overflow-hidden ${expandedProductId === product.id ? 'bg-[#f2f2f2]' : ''
                      }`}
                  >
                    <div className="p-3 pr-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-blue-100 flex items-center justify-center text-blue-500 text-sm font-bold bg-white">
                          {product.id}
                        </div>
                        <span className="text-[#1a1a1a] font-bold text-[12px] md:text-[14px]">
                          {product.name}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleProduct(product.id)}
                        className={`flex items-center text-primary gap-1 border px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${expandedProductId === product.id
                          ? 'bg-white border-blue-500 text-[8px] md:text-[12px]'
                          : 'border-blue-500 text-[8px] md:text-[12px] hover:bg-blue-50'
                          }`}
                      >
                        {expandedProductId === product.id ? 'ပိတ်မယ်' : 'ဈေးကြည့်မယ်'}
                        {expandedProductId === product.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {expandedProductId === product.id && (
                      <div className="px-10 pb-4 space-y-3">
                        {product.prices.map((price, pIdx) => (
                          <div key={pIdx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium text-[12px] md:text-[14px]">{price.quantity}</span>
                            <div className="flex-1 border-b border-dotted border-gray-400 mx-4 h-0 mt-2" />
                            <div className="flex items-baseline gap-1">
                              <span className="text-blue-600 font-bold text-[12px] md:text-[14px]">{price.price.toLocaleString()}</span>
                              <span className="text-blue-600 text-[10px] font-bold">MMK</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {expandedProductId === product.id && (
                    <div className="flex items-center justify-between px-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="w-7 md:w-14 h-7 md:h-14 bg-[#007bff] rounded-md md:rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
                        >
                          <Minus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
                        </button>
                        <span className="text-[12px] md:text-3xl font-bold min-w-[1.2em] text-center">
                          {quantities[product.id] || 0}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="w-7 md:w-14 h-7 md:h-14 bg-[#007bff] rounded-md md:rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
                        >
                          <Plus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={(quantities[product.id] || 0) === 0}
                        className={`py-2 px-4 md:px-8 md:py-4 rounded-full font-bold text-[12px] md:text-lg shadow-md transition-all ${(quantities[product.id] || 0) > 0
                          ? 'bg-[#007bff] text-white active:scale-95'
                          : 'bg-[#dcdcdc] text-gray-500 cursor-not-allowed uppercase'
                          }`}
                      >
                        ဆေးယူမယ်
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Category Selection Drawer */}
      {isCategoryDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsCategoryDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-50 p-6 pt-8 animate-in slide-in-from-bottom duration-300">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="md:text-2xl text-[14px ] font-bold text-primary">ရောဂါအမျိုးအစားများ</h2>
                <button
                  onClick={() => setIsCategoryDrawerOpen(false)}
                  className="flex items-center gap-1 border border-primary text-primary px-3 py-1.5 rounded-full text-[8px] font-bold bg-white hover:bg-blue-50 transition-colors"
                >
                  ပိတ်မယ် <XCircle className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {drawerCategories.map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between py-4 border-b border-dashed border-gray-200 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors group text-left"
                    onClick={() => setIsCategoryDrawerOpen(false)}
                  >
                    <span className="font-bold text-[12px]">{item.title}</span>
                    <span className="text-gray-500 font-medium text-[12px]">
                      ဆေးဝါး <span className="font-bold text-gray-800">{item.count}</span> မျိုး
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
