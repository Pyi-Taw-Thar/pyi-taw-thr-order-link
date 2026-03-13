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
    <section className="py-8 px-0 md:px-40 md:py-10">
      <div className="px-4 space-y-6 md:space-y-10">
        <h2 className="text-primary-dark text-[20px] md:text-2xl font-semibold">
          ရရှိနိုင်သော ဆေးအမျိုးအစားများ
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`rounded-2xl p-4 flex flex-col justify-between items-end min-h-[104px] transition-all bg-primary-light ${category.featured ? "col-span-2" : ""}`}
            >
              <div className="space-y-1 flex-1 w-full">
                <h3 className="text-white font-semibold text-[16px] md:text-xl">
                  {category.title}
                </h3>
                <p className="text-blue-100 text-[14px]">{category.description}</p>
              </div>
              <button
                className="bg-white text-primary-light w-[100px] px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors items-center gap-1 text-[12px] md:text-base whitespace-nowrap mt-3"
                onClick={() => {

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
