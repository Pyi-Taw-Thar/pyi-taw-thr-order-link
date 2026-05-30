import { Search, ChevronDown, ChevronUp, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/axios';

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

interface WholesalePrice {
  unit: string;
  quantity: number;
  price: number;
}

interface ApiProductItem {
  _id: string;
  quantity: number;
  product: {
    _id: string;
    productName: string;
    productCode: string;
    SKU: string;
    category: string;
    brand: string;
    unitOfMeasure: string;
    sellingPrice: number;
    wholesalePrices: WholesalePrice[];
    images: string[];
  };
}

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBrand = searchParams.get('brand') || null;
  const selectedCategory = searchParams.get('category') || null;

  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<ApiProductItem[]>([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get('/ecommerce/products/brands');
        setBrands(response.data.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    if (!selectedBrand) {
      fetchBrands();
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (!selectedBrand) {
      setCategories([]);
      return;
    }

    const fetchCategories = async () => {
      setCatLoading(true);
      try {
        const response = await api.get('/ecommerce/products/categories', {
          params: { brand: selectedBrand }
        });
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCatLoading(false);
      }
    };

    fetchCategories();
  }, [selectedBrand]);

  useEffect(() => {
    if (!selectedBrand || !selectedCategory) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setProdLoading(true);
      try {
        const response = await api.get('/ecommerce/products', {
          params: { brand: selectedBrand, category: selectedCategory }
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProdLoading(false);
      }
    };

    fetchProducts();
  }, [selectedBrand, selectedCategory]);

  const productData = useMemo(() => {
    const categoriesMap: Record<string, Product[]> = {};

    products.forEach(item => {
      const p = item.product;
      const cat = p.category || 'အထွေထွေ';

      const product: Product = {
        id: p._id,
        name: p.productName,
        brand: p.brand,
        category: cat,
        code: p.productCode,
        prices: [
          { unit: p.unitOfMeasure, quantity: p.unitOfMeasure, price: p.sellingPrice },
          ...p.wholesalePrices.map(w => ({
            unit: w.unit,
            quantity: w.unit,
            price: w.price
          }))
        ]
      };

      if (!categoriesMap[cat]) categoriesMap[cat] = [];
      categoriesMap[cat].push(product);
    });

    return Object.entries(categoriesMap).map(([title, prods]) => ({
      title,
      products: prods
    }));
  }, [products]);

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
        inventoryId: product.id,
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
    setExpandedProductId(null);
  };

  const handleCategorySelect = (catName: string) => {
    setSearchParams({ brand: selectedBrand!, category: catName });
  };

  const goBackToBrands = () => {
    setSearchParams({});
  };

  const goBackToCategories = () => {
    setSearchParams({ brand: selectedBrand! });
  };

  // ─── STAGE 1: Brand Grid ───
  if (!selectedBrand) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen pb-20 font-ChivoMono">
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

        <div className="px-4 py-6 max-w-2xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-[14px] md:text-2xl font-bold text-primary">
              ဆေးအမှတ်တံဆိပ်များ
            </h1>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {brands.map((brand, index) => (
              <button
                key={brand}
                onClick={() => handleBrandSelect(brand)}
                className="px-5 h-16 md:h-16 rounded-xl bg-white border border-gray-100 shadow-sm text-primary-dark font-semibold text-[13px] md:text-[18px] hover:bg-blue-50 hover:border-blue-200 hover:scale-105 transition-all text-center min-w-[100px] md:min-w-[160px] animate-in fade-in slide-in-from-bottom duration-500 font-ChivoMono"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── STAGE 2: Category Grid ───
  if (selectedBrand && !selectedCategory) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen pb-20 font-ChivoMono">
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

        <div className="px-4 py-6 max-w-2xl mx-auto">
          <div className="flex items-start justify-between mb-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={goBackToBrands}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-[14px] md:text-2xl font-bold text-primary">
                  {selectedBrand}
                </h1>
                <button
                  onClick={goBackToBrands}
                  className="border border-primary text-primary px-3 py-1 rounded-full text-[8px] md:text-[12px] font-bold hover:bg-blue-50 transition-colors"
                >
                  ပြောင်းမယ်
                </button>
              </div>
              <p className="text-gray-500 text-[10px] ml-10">
                အမျိုးအစား <span className="font-bold text-gray-800">{categories.length}</span> မျိုး
              </p>
            </div>
          </div>

          {catLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-primary font-bold animate-pulse">အမျိုးအစားများ ရှာဖွေနေပါသည်...</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              {categories.map((cat, index) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className="px-5 h-20 md:h-24 rounded-xl bg-white border border-gray-100 shadow-sm text-primary-dark font-semibold text-[13px] md:text-[16px] hover:bg-blue-50 hover:border-blue-200 hover:scale-105 transition-all text-center min-w-[120px] animate-in fade-in slide-in-from-bottom duration-500 font-ChivoMono"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── STAGE 3: Product List ───
  if (prodLoading) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center">
        <div className="text-primary font-bold animate-pulse">ဆေးဝါးများ ရှာဖွေနေပါသည်...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex flex-col items-center justify-center pb-20 font-ChivoMono">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-10 h-10 text-gray-200" />
        </div>
        <p className="text-gray-400 font-medium text-sm">ဆေးဝါးများ မရှိသေးပါ</p>
      </div>
    );
  }

  const totalCategories = productData.length;
  const totalProducts = productData.reduce((sum, cat) => sum + cat.products.length, 0);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 font-ChivoMono">
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
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                onClick={goBackToCategories}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2 text-[14px] md:text-2xl">
                <button
                  onClick={goBackToBrands}
                  className="font-bold text-primary hover:text-blue-600 transition-colors"
                >
                  {selectedBrand}
                </button>
                <span className="text-gray-300 font-light">/</span>
                <button
                  onClick={goBackToCategories}
                  className="font-bold text-primary hover:text-blue-600 transition-colors"
                >
                  {selectedCategory}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-10">
              <p className="text-gray-500 text-[10px]">
                အမျိုးအစား <span className="font-bold text-gray-800">{totalCategories}</span> မျိုး / ဆေးဝါး <span className="font-bold text-gray-800">{totalProducts}</span> မျိုး
              </p>
            </div>
          </div>
        </div>

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
                            onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
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
    </div>
  );
}
