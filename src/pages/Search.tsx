import { Search as SearchIcon, X, ArrowLeft, History, ShoppingCart, Plus, Minus, ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Product } from './products/types';
import { useProducts } from '../services/productQueries';

export default function Search() {
  // ရှာထားသောစာကို URL ?q= တွင်ထား၍ detail မှ back ပြန်လာလျှင် မပျောက်
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [history, setHistory] = useState<string[]>([]);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    // back ပြန်လာ၍ ရှာထားသောစာ ရှိလျှင် keyboard မဖွင့်
    if (!initialQuery) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ရိုက်ပြီး 400ms ကြာမှ ရှာ (debounce) + URL ?q= ကို update
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const q = query.trim();
      setDebouncedQuery(q);
      setSearchParams(q ? { q } : {}, { replace: true });
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query, setSearchParams]);

  const hasQuery = Boolean(debouncedQuery) && Boolean(query.trim());
  const { data: searchData, isPending } = useProducts(
    { search: debouncedQuery },
    { enabled: Boolean(debouncedQuery) },
  );
  const results: Product[] = hasQuery ? searchData ?? [] : [];
  const loading = Boolean(query.trim()) && (query.trim() !== debouncedQuery || isPending);

  const suggestions: Product[] = [];

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);

    // Update history
    if (!history.includes(q)) {
      setHistory(prev => [q, ...prev.slice(0, 4)]);
    }
  };

  const clearResults = () => setQuery('');

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
        inventoryId: product.id,
        name: `${product.name} (${selectedVariant.unit})`,
        price: selectedVariant.price,
        unit: selectedVariant.unit,
        prices: product.prices,
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
    <div className="bg-white min-h-screen max-w-3xl mx-auto">
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
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 md:py-3 px-10 md:px-12 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
              {loading ? (
                <div className="py-20 text-center space-y-4">
                  <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
                  <p className="text-gray-400 font-medium">
                    ဆေးဝါးများ ရှာဖွေနေပါသည်...
                  </p>
                </div>
              ) : results.length > 0 ? (
                results.map((product, idx) => {
                  const isOutOfStock = Boolean(product.isOutOfStock);
                  return (
                    <div key={product.id} className="space-y-4">
                      <div
                        className={`bg-white rounded-2xl border border-gray-100 shadow-sm transition-all overflow-hidden ${
                          isOutOfStock ? "opacity-60 bg-gray-50/70" : ""
                        } ${!isOutOfStock && expandedProductId === product.id ? "bg-[#f2f2f2]" : ""}`}
                      >
                        {/* ProductRow နှင့် တူ — နာမည်သာ ကြောင်းခွဲ၊ ညာဘက်ခလုတ် size မပြောင်း */}
                        <div className="p-3 flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0 flex items-start gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-blue-100 flex items-center justify-center text-primary text-[10px] md:text-sm font-bold bg-white font-mono shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                              <h3 className="text-[#1a1a1a] font-bold text-[13px] md:text-base leading-snug break-words">
                                {product.name}
                              </h3>
                              {((product.chemicalNames && product.chemicalNames.length > 0) ||
                                getProductCartQty(product.id) > 0) && (
                                <div className="flex flex-wrap gap-1">
                                  {getProductCartQty(product.id) > 0 && (
                                    <span className="bg-green-100 text-green-600 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <ShoppingCart className="w-3 h-3" /> {getProductCartQty(product.id)}
                                    </span>
                                  )}
                                  {(product.chemicalNames || []).map((chem, cIdx) => (
                                    <span
                                      key={`${chem}-${cIdx}`}
                                      className="bg-blue-50 text-blue-600 text-[10px] font-medium px-2 py-0.5 rounded-full"
                                    >
                                      {chem}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {isOutOfStock ? (
                            <span className="shrink-0 min-w-[120px] md:min-w-[156px] inline-flex items-center justify-center whitespace-nowrap text-[12px] md:text-sm font-semibold text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
                              ပစ္စည်းပြတ်
                            </span>
                          ) : (
                            <button
                              onClick={() => toggleProduct(product.id)}
                              className={`shrink-0 min-w-[120px] md:min-w-[156px] inline-flex items-center justify-center whitespace-nowrap gap-1 border px-3 py-1.5 rounded-full text-[12px] md:text-sm font-semibold transition-colors ${
                                expandedProductId === product.id
                                  ? "bg-white border-primary text-primary"
                                  : "border-primary text-primary hover:bg-primary-light/10"
                              }`}
                            >
                              {expandedProductId === product.id
                                ? "ပိတ်မယ်"
                                : "ဈေးကြည့်မယ်"}
                              {expandedProductId === product.id ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>

                        {!isOutOfStock && expandedProductId === product.id && (
                          <div className="px-4 pb-4 space-y-2">
                            <div className="text-[10px] font-bold text-gray-400 px-6 uppercase tracking-wider mb-1">
                              ဝယ်ယူမည့်အမျိုးအစား ရွေးချယ်ပါ
                            </div>
                            {product.prices.map((price, pIdx) => (
                              <div
                                key={pIdx}
                                onClick={() => setSelectedVariantIndex(pIdx)}
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

                      {!isOutOfStock && expandedProductId === product.id && (
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
                              value={quantities[product.id] || ""}
                              onChange={(e) =>
                                setQuantityValue(product.id, e.target.value)
                              }
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
                            className={`shrink-0 whitespace-nowrap px-5 py-2.5 md:px-8 md:py-4 rounded-full font-bold text-[13px] md:text-lg shadow-md transition-all ${
                              (quantities[product.id] || 0) > 0
                                ? "bg-primary text-white active:scale-95"
                                : "bg-[#dcdcdc] text-gray-500 cursor-not-allowed uppercase"
                            }`}
                          >
                            ဆေးယူမယ်
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
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
