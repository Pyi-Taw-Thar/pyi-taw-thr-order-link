import { ArrowLeft, ShoppingCart, AlertTriangle, Search, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import ProductCard from "../components/ProductCard";

interface LimitedProduct {
  id: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  code: string;
  prices: { unit: string; quantity: string; price: number }[];
}

export default function LimitedProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<LimitedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await api.get("/ecommerce/products", {
          params: { limitedOnly: true },
        });
        const items = response.data.data;
        const mapped = items.map((item: any) => {
          const p = item.product;
          return {
            id: p._id,
            name: p.productName,
            price: p.sellingPrice,
            brand: p.brand,
            category: p.category || 'အထွေထွေ',
            code: p.productCode,
            prices: [
              { unit: p.unitOfMeasure, quantity: p.unitOfMeasure, price: p.sellingPrice },
              ...(p.wholesalePrices || []).map((w: any) => ({
                unit: w.unit,
                quantity: w.unit,
                price: w.price,
              })),
            ],
          };
        });
        setProducts(mapped);
      } catch (error) {
        console.error("Error fetching limited products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  if (loading) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center">
        <div className="text-primary font-bold animate-pulse">
          ဆေးဝါးများ ရှာဖွေနေပါသည်...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] container mx-auto min-h-screen pb-20 font-ChivoMono">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-sm font-bold text-gray-800">အကန့်သတ်ရသောဆေးများ</h1>
      </div>

      {/* Search Bar */}
      <div className="sticky top-[57px] z-40 bg-[#f8f9fa] px-4 py-3 border-b border-gray-100">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ဆေးဝါးများ ရှာဖွေရန်"
            className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-10 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 bg-gray-200 rounded-full text-white hover:bg-gray-300">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto py-6 space-y-4">
        <div className="flex items-center gap-2 bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
          <p className="text-yellow-700 text-[12px] font-medium">
            ဤဆေးဝါးများသည် အရေတွက်အကန့်သတ်ဖြင့်သာ ဝယ်ယူနိုင်ပါသည်။
            တစ်ဦးချင်းစီအတွက် သတ်မှတ်ထားသော အရေအတွက်ထက် ပိုမိုမှာယူ၍ မရပါ။
          </p>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium text-sm">
              အကန့်သတ်ရသောဆေးများ မရှိသေးပါ
            </p>
          </div>
        ) : (
          <>
            {query && (
              <p className="text-gray-500 text-[12px] px-1">
                ရှာဖွေတွေ့ရှိမှု <span className="font-bold text-gray-800">{filtered.length}</span> မျိုး
              </p>
            )}
            {filtered.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-gray-400 font-medium text-sm">
                  ရှာဖွေတွေ့ရှိမှုမရှိပါ
                </p>
                <button onClick={() => setQuery("")} className="text-primary text-xs font-bold hover:underline">
                  ရှင်းလင်းမည်
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    data={product}
                    showBadge
                    showPrice
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
