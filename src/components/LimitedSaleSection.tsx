import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function LimitedSaleSection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLimitedProducts = async () => {
      try {
        const response = await fetch("/medicines.json");
        const data = await response.json();

        // Filter products with limit: true
        const limited = data
          .filter((item: any) => item.limit === true)
          .slice(0, 4) // Show only first 4 for display
          .map((item: any) => ({
            id: item.id,
            name: item.Description,
            price: item.variants?.[0]?.SP1 || 0,
          }));

        setProducts(limited);
      } catch (error) {
        console.error("Error fetching limited products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLimitedProducts();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="bg-white py-8 font-ChivoMono">
      <div className="px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-primary-dark text-[20px] md:text-2xl font-semibold">
              အကန့်သတ်ရသောဆေးများ
            </h2>
            <p className="text-gray-600 text-[10px] mt-1">
              အရေတွက် အကန့်သန့်ဖြင့်သာ <br /> ဝယ်ယူလို့ရသောဆေးများ
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="border-2 border-primary text-primary px-4 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center gap-1 text-sm whitespace-nowrap"
          >
            ကြည့်မယ်
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-50 rounded-lg px-3 py-6 flex flex-col justify-between space-y-4 border border-transparent hover:border-blue-100 transition-all"
            >
              <div className="space-y-0">
                <h3 className="text-gray-800 font-bold text-[12px] line-clamp-2 min-h-[32px]">
                  {product.name}
                </h3>
                <span className="inline-block bg-yellow-100 text-[#BFGA02] text-[9px] font-bold px-2 py-1 rounded w-fit">
                  အကန့်သတ်ဖြင့်သာ
                </span>
              </div>
              {/* 
              <div className="space-y-0">
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-[14px]">
                    {product.price.toLocaleString()} <span className="text-[10px]">MMK</span>
                  </span>
                </div>
              </div> */}

              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all text-[11px]"
              >
                ဆေးမှာမယ်
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
