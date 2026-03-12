import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  title: string;
  description: string;
  featured?: boolean;
}

const categories: Category[] = [
  {
    id: 1,
    title: "နာတာရှည်နှင့်",
    description: "အတွင်းပိုင်းရောဂါများ",
  },
  {
    id: 2,
    title: "အရိုးအကြောနှင့် ",
    description: "အမျိုးသားကျန်းမာရေး",
  },
  {
    id: 3,
    title: "အသက်ရှူလမ်းကြောင်းနှင့်",
    description: "အအေးမိရောဂါ",
    featured: true,
  },
  {
    id: 4,
    title: "အထူးကုသမှု",
    description: "ဆေးများ",
  },
  {
    id: 5,
    title: "အာရုံခံအင်္ဂါနှင့်",
    description: "သွားကျန်းမာရေး",
  },
  {
    id: 6,
    title: "တိုင်းရင်းဆေးနှင့်",
    description: "နာမည်ကြီးတံဆိပ်များ",
  },
  {
    id: 7,
    title: "အရေပြားနှင့်",
    description: "အပြင်လိမ်းဆေးများ",
  },
];

export default function CategorySection() {
  const navigate = useNavigate();
  return (
    <section className="bg-gray-50 py-8">
      <div className="px-4 space-y-4">
        <h2 className="text-gray-700 text-lg font-semibold">
          ရရှိနိုင်သော ဆေးအမျိုးအစားများ
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`rounded-2xl p-4 flex flex-col justify-between min-h-[150px] transition-all ${
                category.featured ? "bg-blue-600" : "bg-blue-600"
              }`}
            >
              <div className="space-y-1 flex-1">
                <h3 className="text-white font-semibold text-base">
                  {category.title}
                </h3>
                <p className="text-blue-100 text-sm">{category.description}</p>
              </div>
              <button
                className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm whitespace-nowrap mt-3"
                onClick={() => {
                  // TODO: Add navigation to product page
                  navigate("/products");
                }}
              >
                ‌ဆေးမှာမယ်
                {/* <ChevronRight className="w-4 h-4" /> */}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
