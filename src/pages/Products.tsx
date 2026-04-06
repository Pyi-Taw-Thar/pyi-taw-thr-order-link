import { Search, ChevronDown, Filter, XCircle, ChevronUp, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

interface DrawerCategory {
  title: string;
  count: number;
}

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBrand = searchParams.get('brand') || null;

  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [allMedicines, setAllMedicines] = useState<Product[]>([]);
  const [drawerCategories, setDrawerCategories] = useState<DrawerCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch('/medicines.json');
        const data = await response.json();

        const brandCount: Record<string, number> = {};
        const medicines: Product[] = data.map((item: any) => {
          const brand = item.brand || 'အခြား';
          brandCount[brand] = (brandCount[brand] || 0) + 1;

          return {
            id: item.id,
            name: item.Description,
            brand: item.brand,
            category: item.category || 'အထွေထွေ',
            code: item.Code,
            prices: item.variants.map((v: any) => ({
              unit: v.unit,
              quantity: `${v.unit}`,
              price: v.SP1 || v.nan1 || 0
            }))
          };
        });

        const formattedDrawerCats: DrawerCategory[] = Object.entries(brandCount).map(([title, count]) => ({
          title,
          count
        }));

        setAllMedicines(medicines);
        setDrawerCategories(formattedDrawerCats);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // Filter and Group products based on selectedBrand
  const productData = useMemo(() => {
    let filtered = allMedicines;
    if (selectedBrand) {
      filtered = allMedicines.filter(m => m.brand === selectedBrand);
    }

    const categoriesMap: Record<string, Product[]> = {};
    filtered.forEach(product => {
      const cat = product.category || 'အထွေထွေ';
      if (!categoriesMap[cat]) categoriesMap[cat] = [];
      categoriesMap[cat].push(product);
    });

    return Object.entries(categoriesMap).map(([title, products]) => ({
      title,
      products
    }));
  }, [allMedicines, selectedBrand]);

  const toggleProduct = (id: string) => {
    if (expandedProductId === id) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(id);
      setSelectedVariantIndex(0); // Reset to first variant when expanding
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

  const getProductCartQty = (productId: string) => {
    return cartItems
      .filter(item => item.id.startsWith(productId))
      .reduce((sum, item) => sum + item.quantity, 0);
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

  const handleBrandSelect = (brandName: string | null) => {
    if (brandName) {
      setSearchParams({ brand: brandName });
    } else {
      setSearchParams({});
    }
    setIsCategoryDrawerOpen(false);
    setExpandedProductId(null);
  };

  if (loading) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center">
        <div className="text-primary font-bold animate-pulse">ဆေးဝါးများ ရှာဖွေနေပါသည်...</div>
      </div>
    );
  }

  // Calculate stats
  const totalCategories = productData.length;
  const totalProducts = productData.reduce((sum, cat) => sum + cat.products.length, 0);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 font-ChivoMono">
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
              <h1 className=" md:text-2xl text-[14px] font-bold text-primary group-hover:text-blue-600 transition-colors">
                {selectedBrand || 'ဆေးအမှတ်တံဆိပ်များ'}
              </h1>
              <ChevronDown className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            </button>
            <div className="flex items-center gap-2">
              <p className="text-gray-500 text-[10px]">
                အမျိုးအစား <span className="font-bold text-gray-800">{totalCategories}</span> မျိုး / ဆေးဝါး <span className="font-bold text-gray-800">{totalProducts}</span> မျိုး
              </p>
              {selectedBrand && (
                <button
                  onClick={() => handleBrandSelect(null)}
                  className="text-red-500 text-[10px] font-bold hover:underline flex items-center gap-0.5"
                >
                  <XCircle className="w-3 h-3" /> အကုန်ပြမယ်
                </button>
              )}
            </div>
          </div>
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
                        <span
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="text-[#1a1a1a] font-bold text-[14px] md:text-[14px] cursor-pointer hover:text-blue-600 transition-colors inline-flex items-center gap-2"
                        >
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
                              {/* <span className="text-[10px] text-gray-400">{price.quantity}</span> */}
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
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="w-[40px] md:w-14 h-[36px] md:h-14 bg-[#007bff] rounded-md md:rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
                        >
                          <Minus className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
                        </button>
                        <input
                          type="number"
                          value={quantities[product.id] || ''}
                          onChange={(e) => setQuantityValue(product.id, e.target.value)}
                          className="text-[12px] md:text-3xl font-bold w-[100px] md:w-[100px] text-center bg-white rounded-lg border border-gray-200 py-2 md:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="w-[40px] md:w-14 h-[36px] md:h-14 bg-[#007bff] rounded-md md:rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
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
                <h2 className="md:text-2xl text-[14px] font-bold text-primary">ဆေးအမှတ်တံဆိပ်များ</h2>
                <button
                  onClick={() => setIsCategoryDrawerOpen(false)}
                  className="flex items-center gap-1 border border-primary text-primary px-3 py-1.5 rounded-full text-[8px] font-bold bg-white hover:bg-blue-50 transition-colors"
                >
                  ပိတ်မယ် <XCircle className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <button
                  className={`w-full flex items-center justify-between py-4 border-b border-dashed border-gray-200 hover:bg-gray-50 px-2 rounded-lg transition-colors group text-left ${!selectedBrand ? 'bg-blue-50' : ''}`}
                  onClick={() => handleBrandSelect(null)}
                >
                  <span className="font-bold text-[12px]">အကုန်ပြမယ်</span>
                  <span className="text-gray-500 font-medium text-[12px]">
                    ဆေးဝါး <span className="font-bold text-gray-800">{allMedicines.length}</span> မျိုး
                  </span>
                </button>
                {drawerCategories.map((item, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center justify-between py-4 border-b border-dashed border-gray-200 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors group text-left ${selectedBrand === item.title ? 'bg-blue-50' : ''}`}
                    onClick={() => handleBrandSelect(item.title)}
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
