import { ArrowLeft, Minus, Plus, ShoppingCart, Info, Package, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import paracetamolImg from '../assets/images/products/paracetamol.png';

interface Variant {
  unit: string;
  Qty: number;
  Unit: string;
  SP1: number;
}

interface Product {
  id: string;
  Description: string;
  brand: string;
  category: string;
  Code: string;
  variants: Variant[];
  limit: boolean;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, setQuantity: cartSetQuantity, cartItems } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/medicines.json');
        const data = await response.json();
        const found = data.find((item: any) => item.id === id);
        if (found) {
          setProduct(found);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Sync quantity with cart when variant changes
  useEffect(() => {
    if (product) {
      const variant = product.variants[selectedVariantIndex];
      const cartQty = getVariantCartQty(variant.unit);
      if (cartQty > 0) {
        setQuantity(cartQty);
      } else {
        setQuantity(1);
      }
    }
  }, [selectedVariantIndex, product]);

  const getVariantCartQty = (variantUnit: string) => {
    const variantId = `${id}-${variantUnit}`;
    const cartItem = cartItems.find(item => item.id === variantId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      const variant = product.variants[selectedVariantIndex];
      const variantId = `${product.id}-${variant.unit}`;
      const isAlreadyInCart = getVariantCartQty(variant.unit) > 0;

      if (isAlreadyInCart) {
        // Update existing quantity
        cartSetQuantity(variantId, quantity);
      } else {
        // Add new item
        addToCart({
          id: variantId,
          name: `${product.Description} (${variant.unit})`,
          price: variant.SP1
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

  const selectedVariant = product.variants[selectedVariantIndex];

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24 font-ChivoMono">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-sm font-bold text-gray-800 truncate">
          {product.Description}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Product Image */}
        <div className="relative aspect-square rounded-[10px] overflow-hidden bg-white border border-gray-100 shadow-sm flex items-center justify-center">
          <img
            src={paracetamolImg}
            alt={product.Description}
            className="w-full h-full object-contain opacity-90 transition-transform active:scale-110 duration-500"
          />
        </div>

        {/* Product Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded">
                {product.Code}
              </span>
              {product.limit && (
                <span className="bg-yellow-50 text-yellow-600 text-[10px] font-bold px-2 py-1 rounded">
                  Limited
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {product.Description}
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

        {/* Pricing Options */}
        <div className="space-y-4 pb-10">
          <h3 className="text-primary font-bold text-sm px-1 flex items-center gap-2">
            <Info className="w-4 h-4" /> ဝယ်ယူမည့်အမျိုးအစား ရွေးချယ်ပါ
          </h3>
          <div className="grid gap-3">
            {product.variants.map((v, index) => (
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
                      {v.unit}
                    </span>
                    {getVariantCartQty(v.unit) > 0 && (
                      <span className="bg-green-100 text-green-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <ShoppingCart className="w-2.5 h-2.5" /> {getVariantCartQty(v.unit)}
                      </span>
                    )}
                  </div>
                  {/* <span className="text-[11px] text-gray-400 font-medium">အရည်အတွက် - {v.Qty} {v.Unit}</span> */}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-lg font-bold ${selectedVariantIndex === index ? 'text-primary' : 'text-gray-900 font-mono'}`}>
                    {v.SP1?.toLocaleString()}
                  </span>
                  <span className={`text-[10px] font-bold ${selectedVariantIndex === index ? 'text-primary' : 'text-gray-500'}`}>MMK</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 pt-3 pb-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Total Price Display */}
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col">
              <span className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">ကျသင့်ငွေ စုစုပေါင်း</span>
              {getVariantCartQty(selectedVariant.unit) > 0 && (
                <span className="text-green-600 text-[9px] font-bold mt-0.5">စျေးခြင်းထဲတွင် - {getVariantCartQty(selectedVariant.unit)} ခုရှိနေသည်</span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                {(quantity * selectedVariant.SP1).toLocaleString()}
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
              {product && getVariantCartQty(product.variants[selectedVariantIndex].unit) > 0 ? 'ဆေးယူမယ်' : 'ဆေးယူမယ်'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
