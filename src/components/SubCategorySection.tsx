import { useNavigate } from "react-router-dom";
import { useSubCategories } from "../services/productQueries";

export default function SubCategorySection() {
  const navigate = useNavigate();
  const { data: subCategories = [], isPending: loading } = useSubCategories();

  if (!loading && subCategories.length === 0) return null;

  return (
    <section className="container mx-auto py-8 md:py-20">
      <div className="px-4 space-y-6 md:space-y-10">
        <h2 className="text-primary-dark text-[20px] md:text-2xl font-semibold">
          ကုန်ပစ္စည်းအမျိုးအစားများ
        </h2>

        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-gray-100 animate-pulse"
                />
              ))
            : subCategories.map((subCategory, index) => (
                <button
                  key={subCategory}
                  onClick={() =>
                    navigate(`/products?subCategory=${encodeURIComponent(subCategory)}`)
                  }
                  title={subCategory}
                  className="px-3 md:px-5 h-16 rounded-xl bg-white border border-gray-100 shadow-sm text-primary-dark font-semibold text-[13px] md:text-[18px] hover:bg-blue-50 hover:border-blue-200 hover:scale-105 transition-all flex items-center justify-center text-center min-w-[100px] md:min-w-[160px] animate-in fade-in slide-in-from-bottom duration-500 font-ChivoMono"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="line-clamp-2 text-ellipsis overflow-hidden break-words leading-tight">
                    {subCategory}
                  </span>
                </button>
              ))}
        </div>
      </div>
    </section>
  );
}
