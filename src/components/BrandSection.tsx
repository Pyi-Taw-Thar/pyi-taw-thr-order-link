import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/axios";

interface Brand {
  id: string | number;
  title: string;
}

export default function BrandSection() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get("/ecommerce/products/brands");
        const data: string[] = response.data.data;
        const formatted = data.map((item, index) => ({
          id: index + 1,
          title: item,
        }));
        setBrands(formatted);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) return null;

  return (
    <section className="container mx-auto py-8 md:py-20">
      <div className="px-4 space-y-6 md:space-y-10">
        <h2 className="text-primary-dark text-[20px] md:text-2xl font-semibold">
          နာမည်ကြီး ဆေးအမှတ်တံဆိပ်များ
        </h2>

        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
          {brands.map((brand, index) => (
            <button
              key={brand.id}
              onClick={() =>
                navigate(`/products?brand=${encodeURIComponent(brand.title)}`)
              }
              className="px-5 h-16 md:h-16 rounded-xl bg-white border border-gray-100 shadow-sm text-primary-dark font-semibold text-[13px] md:text-[18px] hover:bg-blue-50 hover:border-blue-200 hover:scale-105 transition-all text-center min-w-[100px] md:min-w-[160px] animate-in fade-in slide-in-from-bottom duration-500 font-ChivoMono"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {brand.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
