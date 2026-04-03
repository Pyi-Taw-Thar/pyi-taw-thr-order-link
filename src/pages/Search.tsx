import { Search as SearchIcon, X, ArrowLeft, History, ShoppingCart, Plus, Minus, ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface PriceTier {
  unit: string;
  quantity: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  prices: PriceTier[];
  brand?: string;
  category?: string;
  code?: string;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [allMedicines, setAllMedicines] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    inputRef.current?.focus();
    const fetchMedicines = async () => {
      try {
        const response = await fetch('/medicines.json');
        const data = await response.json();
        const medicines: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.Description,
          brand: item.brand,
          category: item.category || 'အထွေထွေ',
          code: item.Code,
          prices: item.variants.map((v: any) => ({
            unit: v.unit,
            quantity: `${v.Qty} ${v.Unit}`,
            price: v.SP1 || v['nan.1'] || 0
          }))
        }));
        setAllMedicines(medicines);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  // Show ephemeral suggestions while typing
  const suggestions = query
    ? allMedicines.filter(item =>
      (item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.brand?.toLowerCase().includes(query.toLowerCase()) ||
        item.code?.toLowerCase().includes(query.toLowerCase())) &&
      !results.some(r => r.id === item.id)
    )
    : [];

  const handleSearch = (q: string) => {
    if (!q) return;
    setQuery(q);

    // Update history
    if (!history.includes(q)) {
      setHistory(prev => [q, ...prev.slice(0, 4)]);
    }

    // Find matches
    const matches = allMedicines.filter(item =>
      item.name.toLowerCase().includes(q.toLowerCase()) ||
      item.brand?.toLowerCase().includes(q.toLowerCase()) ||
      item.code?.toLowerCase().includes(q.toLowerCase())
    );

    // Merge with persistent results (keeping unique by ID)
    setResults(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newUniqueMatches = matches.filter(m => !existingIds.has(m.id));
      return [...newUniqueMatches, ...prev]; // Newest found on top
    });
  };

  const clearResults = () => setResults([]);

  const clearHistory = () => setHistory([]);

  const toggleProduct = (id: string) => {
    if (expandedProductId === id) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(id);
      setSelectedVariantIndex(0);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const setQuantityValue = (id: string, value: string) => {
    const num = parseInt(value);
    setQuantities(prev => ({
      ...prev,
      [id]: isNaN(num) ? 0 : Math.max(0, num)
    }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 0;
    if (qty > 0) {
      const selectedVariant = product.prices[selectedVariantIndex] || product.prices[0];
      addToCart({
        id: `${product.id}-${selectedVariant.unit}`,
        name: `${product.name} (${selectedVariant.unit})`,
        price: selectedVariant.price
      }, qty);
      setQuantities(prev => ({ ...prev, [product.id]: 0 }));
      setExpandedProductId(null);
    }
  };

  const getProductCartQty = (productId: string) => {
    return cartItems
      .filter(item => item.id.startsWith(productId))
      .reduce((sum, item) => sum + item.quantity, 0);
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
            placeholder={loading ? "ဆေးဝါးများ ရှာဖွေနေပါသည်..." : "ဆေးဝါးနှင့်ကျန်းမာရေးပစ္စည်းများ ရှာဖွေရန်"}
            disabled={loading}
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 md:py-3 px-10 md:px-12 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
          <SearchIcon className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
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
        {/* Search History (Visible when query is empty and results is low) */}
        {!query && results.length === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] md:text-lg font-bold text-primary-dark flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                ရှာဖွေခဲ့ဖူးသည်များ
              </h2>
              <button
                onClick={clearHistory}
                className="text-[12px] md:text-sm text-primary font-medium hover:underline"
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
                    className="bg-gray-50 border border-gray-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[12px] md:text-sm text-gray-600 hover:bg-primary-light/10 hover:border-primary-light hover:text-primary transition-all"
                  >
                    {item}
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-[12px] md:text-sm italic py-4">ရှာဖွေမှုမှတ်တမ်း မရှိသေးပါ</p>
              )}
            </div>
          </div>
        )}

        {/* Search Results (Persistent List) */}
        {(results.length > 0 || query) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] md:text-lg font-bold text-primary-dark">
                {results.length > 0 ? 'ရှာဖွေတွေ့ရှိမှုများ' : 'ရှာဖွေနေသည်'} <span className="font-mono">({results.length})</span>
              </h2>
              {results.length > 0 && (
                <button
                  onClick={clearResults}
                  className="text-[12px] md:text-sm text-red-500 font-medium hover:underline"
                >
                  စာရင်းရှင်းမယ်
                </button>
              )}
            </div>

            {/* Suggestions while typing (New items not already in results) */}
            {query && suggestions.length > 0 && (
              <div className="space-y-2 pb-4 border-b border-dashed border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">အကြံပြုချက်များ</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 3).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSearch(s.name)}
                      className="bg-primary/5 text-primary border border-primary/20 px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {results.length > 0 ? (
                results.map((product, idx) => (
                  <div key={product.id} className="space-y-4">
                    <div
                      className={`bg-white rounded-2xl border border-gray-100 shadow-sm transition-all overflow-hidden ${expandedProductId === product.id ? 'bg-[#f2f2f2]' : ''
                        }`}
                    >
                      <div className="p-3 pr-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-blue-100 flex items-center justify-center text-primary text-[10px] md:text-sm font-bold bg-white font-mono">
                            {idx + 1}
                          </div>
                          <span className="text-[#1a1a1a] font-bold text-[12px] md:text-base flex items-center gap-2">
                            {product.name}
                            {getProductCartQty(product.id) > 0 && (
                              <span className="bg-green-100 text-green-600 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                <ShoppingCart className="w-3 h-3" /> {getProductCartQty(product.id)}
                              </span>
                            )}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleProduct(product.id)}
                          className={`flex items-center gap-1 border px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold transition-colors ${expandedProductId === product.id
                            ? 'bg-white border-primary text-primary'
                            : 'border-primary text-primary hover:bg-primary-light/10'
                            }`}
                        >
                          {expandedProductId === product.id ? 'ပိတ်မယ်' : 'ဈေးကြည့်မယ်'}
                          {expandedProductId === product.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {expandedProductId === product.id && (
                        <div className="px-4 pb-4 space-y-2">
                          <div className="text-[10px] font-bold text-gray-400 px-6 uppercase tracking-wider mb-1">ဝယ်ယူမည့်အမျိုးအစား ရွေးချယ်ပါ</div>
                          {product.prices.map((price, pIdx) => (
                            <div
                              key={pIdx}
                              onClick={() => setSelectedVariantIndex(pIdx)}
                              className={`flex items-center justify-between p-3 px-6 rounded-xl cursor-pointer transition-all border-2 ${selectedVariantIndex === pIdx
                                ? 'bg-white border-blue-500 shadow-sm'
                                : 'border-transparent hover:bg-white/50'
                                }`}
                            >
                              <div className="flex flex-col">
                                <span className={`font-bold text-[12px] md:text-[14px] ${selectedVariantIndex === pIdx ? 'text-blue-600' : 'text-gray-700'}`}>
                                  {price.quantity}
                                </span>
                              </div>
                              <div className="flex-1 border-b border-dotted border-gray-300 mx-4 h-0 mt-1" />
                              <div className="flex items-baseline gap-1">
                                <span className={`font-bold text-[12px] md:text-[14px] ${selectedVariantIndex === pIdx ? 'text-blue-600' : 'text-gray-900'}`}>
                                  {price.price.toLocaleString()}
                                </span>
                                <span className={`text-[10px] font-bold ${selectedVariantIndex === pIdx ? 'text-blue-600' : 'text-gray-500'}`}>MMK</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {expandedProductId === product.id && (
                      <div className="flex items-center justify-between px-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-4 md:gap-6">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-10 h-10 md:w-14 md:h-14 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
                          >
                            <Minus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
                          </button>
                          <input
                            type="number"
                            value={quantities[product.id] || ''}
                            onChange={(e) => setQuantityValue(product.id, e.target.value)}
                            className="text-xl md:text-3xl font-bold w-12 md:w-20 text-center bg-white rounded-xl border border-gray-200 py-1 md:py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-mono"
                            placeholder="0"
                          />
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-10 h-10 md:w-14 md:h-14 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
                          >
                            <Plus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={(quantities[product.id] || 0) === 0}
                          className={`px-6 py-2.5 md:px-8 md:py-4 rounded-full font-bold text-[14px] md:text-lg shadow-md transition-all ${(quantities[product.id] || 0) > 0
                            ? 'bg-primary text-white active:scale-95'
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
