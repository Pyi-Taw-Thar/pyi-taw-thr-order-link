import { ChevronRight } from 'lucide-react';

interface Category {
  id: number;
  title: string;
  description: string;
  featured?: boolean;
}

const categories: Category[] = [
  {
    id: 1,
    title: 'အဆစ်ရောင်မှုကို',
    description: 'အဆစ်ဆိုင်ရာ ကျန်းမာရေး'
  },
  {
    id: 2,
    title: 'အနေအထားလွန်းမှုကို',
    description: 'အုပ်စုတွင်သည့် ဆေးဝါး'
  },
  {
    id: 3,
    title: 'အသkirk်ဆုံးကွင်းကို',
    description: 'အများအဆာ ကျန်းမာရေး',
    featured: true
  },
  {
    id: 4,
    title: 'အများအားခြင်း',
    description: 'အမျူးယောင်း'
  },
  {
    id: 5,
    title: 'အခြင်းအခါ',
    description: 'အခြင်းအခါမျူးယောင်း'
  },
  {
    id: 6,
    title: 'အရည်အသွေးမြင့်',
    description: 'ရည်ရွယ်ချက်အလျှောက်'
  },
  {
    id: 7,
    title: 'အုံးအုံးသည့်',
    description: 'အုံးအုံးဖြည့်စွက်မှုများ'
  }
];

export default function CategorySection() {
  return (
    <section className="bg-gray-50 py-8">
      <div className="px-4 space-y-4">
        <h2 className="text-gray-700 text-lg font-semibold">
          ဆေးခွဲခြင်းအလယ်း အဆင့်များ
        </h2>

        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`rounded-2xl p-4 flex items-end justify-between min-h-[120px] transition-all ${
                category.featured
                  ? 'bg-blue-600 col-span-2'
                  : 'bg-blue-600'
              }`}
            >
              <div className="space-y-1 flex-1">
                <h3 className="text-white font-semibold text-base">
                  {category.title}
                </h3>
                <p className="text-blue-100 text-sm">
                  {category.description}
                </p>
              </div>
              <button
                className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm whitespace-nowrap ml-3"
              >
                ဆေးဝိုင်း
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
