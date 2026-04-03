import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Category {
  id: string | number;
  title: string;
}

export default function CategorySection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("/medicines.json");
        const data = await response.json();

        // Extract unique brands and categories
        const brands = data.filter((m: any) => m.brand).map((m: any) => m.brand.trim());
        // const categoriesData = data.filter((m: any) => m.category).map((m: any) => m.category.trim());

        // Merge and deduplicate
        const uniqueItems = [...new Set([...brands])];

        // Format them as Category objects
        const formattedCategories = uniqueItems.map((item, index) => ({
          id: index + 1,
          title: item
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  if (loading) return null;

  return (
    <section className="py-8 px-0 md:px-40 md:py-10">
      <div className="px-4 space-y-6 md:space-y-10">
        <h2 className="text-primary-dark text-[20px] md:text-2xl font-semibold">
          နာမည်ကြီး ဆေးအမှတ်တံဆိပ်များ
        </h2>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => navigate(`/products?brand=${encodeURIComponent(category.title)}`)}
              className="px-5 h-16 md:h-16 rounded-xl bg-white border border-gray-100 shadow-sm text-primary-dark font-semibold text-[13px] md:text-[18px] hover:bg-blue-50 hover:border-blue-200 hover:scale-105 transition-all text-center min-w-[100px] md:min-w-[160px] animate-in fade-in slide-in-from-bottom duration-500 font-ChivoMono"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
