import { ArrowLeft, Minus, Plus, ShoppingCart, Info, Package, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { findBestTierIndex } from '../utils/pricing';
import paracetamolImg from '../assets/images/products/paracetamol.png';

interface PriceTier {
  unit: string;
  quantity: number;
  price: number;
}

interface ProductDetailData {
  id: string;
  name: string;
  brand: string;
  category: string;
  code: string;
  prices: PriceTier[];
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, setQuantity: cartSetQuantity, cartItems } = useCart();

  const [product, setProduct] = useState<ProductDetailData | null>(
    location.state?.product || null
  );
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    if (product) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch('/medicines.json');
        const data = await response.json();
        const found = data.find((item: any) => item.id === id);
        if (found) {
          setProduct({
            id: found.id,
            name: found.Description,
            brand: found.brand,
            category: found.category || 'အထွေထွေ',
            code: found.Code,
            prices: found.variants.map((v: any) => ({
              unit: v.unit,
              quantity: 1,
              price: v.SP1 || v.nan1 || 0
            }))
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, product]);

  useEffect(() => {
    if (product) {
      const variant = product.prices[selectedVariantIndex];
      const cartQty = getVariantCartQty(variant.unit);
      if (cartQty > 0) {
        setQuantity(cartQty);
      } else {
        setQuantity(1);
      }
    }
  }, [selectedVariantIndex, product]);

  useEffect(() => {
    if (!product) return;
    const currentUnit = product.prices[selectedVariantIndex]?.unit;
    if (!currentUnit || quantity <= 0) return;
    const bestIndex = findBestTierIndex(product.prices, currentUnit, quantity);
    if (bestIndex !== selectedVariantIndex) {
      setSelectedVariantIndex(bestIndex);
    }
  }, [quantity, selectedVariantIndex, product]);

  const getVariantCartQty = (variantUnit: string) => {
    const variantId = `${id}-${variantUnit}`;
    const cartItem = cartItems.find(item => item.id === variantId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      const variant = product.prices[selectedVariantIndex];
      const variantId = `${product.id}-${variant.unit}`;
      const isAlreadyInCart = getVariantCartQty(variant.unit) > 0;

      if (isAlreadyInCart) {
        cartSetQuantity(variantId, quantity);
      } else {
        addToCart({
          id: variantId,
          inventoryId: product.id,
          name: `${product.name} (${variant.unit})`,
          price: variant.price,
          unit: variant.unit,
          prices: product.prices
        }, quantity);
      }

      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-primary font-bold animate-pulse">အချက်အလက်များ ရှာဖွေနေပါသည်...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-500">ဆေးဝါး ရှာမတွေ့ပါ။</p>
        <button onClick={() => navigate(-1)} className="text-primary font-bold">နောက်သို့ပြန်သွားရန်</button>
      </div>
    );
  }

  const selectedVariant = product.prices[selectedVariantIndex];

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24 font-ChivoMono">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-sm font-bold text-gray-800 truncate">
          {product.name}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="relative aspect-square rounded-[10px] overflow-hidden bg-white border border-gray-100 shadow-sm flex items-center justify-center">
          <img
            src={paracetamolImg}
            alt={product.name}
            className="w-full h-full object-contain opacity-90 transition-transform active:scale-110 duration-500"
          />
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded">
                {product.code}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Tag className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Brand</span>
              </div>
              <p className="font-bold text-[13px] text-gray-800 truncate">{product.brand}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Package className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Category</span>
              </div>
              <p className="font-bold text-[13px] text-gray-800 truncate">{product.category}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pb-10">
          <h3 className="text-primary font-bold text-sm px-1 flex items-center gap-2">
            <Info className="w-4 h-4" /> ဝယ်ယူမည့်အမျိုးအစား ရွေးချယ်ပါ
          </h3>
          <div className="grid gap-3">
            {product.prices.map((p, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariantIndex(index)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${selectedVariantIndex === index
                  ? 'border-primary bg-white shadow-md'
                  : 'border-transparent bg-white hover:border-gray-200'
                  }`}
              >
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[15px] font-bold ${selectedVariantIndex === index ? 'text-primary' : 'text-gray-700'}`}>
                      {p.unit}
                    </span>
                    {getVariantCartQty(p.unit) > 0 && (
                      <span className="bg-green-100 text-green-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <ShoppingCart className="w-2.5 h-2.5" /> {getVariantCartQty(p.unit)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-lg font-bold ${selectedVariantIndex === index ? 'text-primary' : 'text-gray-900 font-mono'}`}>
                    {p.price?.toLocaleString()}
                  </span>
                  <span className={`text-[10px] font-bold ${selectedVariantIndex === index ? 'text-primary' : 'text-gray-500'}`}>MMK</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 pt-3 pb-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col">
              <span className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">ကျသင့်ငွေ စုစုပေါင်း</span>
              {getVariantCartQty(selectedVariant.unit) > 0 && (
                <span className="text-green-600 text-[9px] font-bold mt-0.5">စျေးခြင်းထဲတွင် - {getVariantCartQty(selectedVariant.unit)} ခုရှိနေသည်</span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                {(quantity * selectedVariant.price).toLocaleString()}
              </span>
              <span className="text-[12px] font-bold text-primary">MMK</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 bg-gray-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-600 hover:text-primary transition-all active:scale-90 shadow-sm"
              >
                <Minus className="w-4 h-4 stroke-[3px]" />
              </button>
              <span className="text-xl font-bold font-mono w-8 text-center text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white transition-all active:scale-90 shadow-md shadow-blue-100"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-white py-3 rounded-2xl font-bold text-[15px] tracking-wide active:scale-95 transition-all shadow-lg shadow-blue-100 border-b-4 border-blue-700"
            >
              ဆေးယူမယ်
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
