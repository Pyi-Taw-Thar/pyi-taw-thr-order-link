import { ChevronRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="bg-blue-600 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="text-white space-y-6">
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">
              ဆေးဝါးဆိုင် ဆေးဝါးနှင့်
              <br />
              ကျန်းမာရေးဖြည့်စွက်မှုကို
              <br />
              လွယ်ကူ လျင်မြန်ဖြင့်
              <br />
              ချက်ချင်း ဝယ်ယူလိုက်ပါ
            </h1>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm md:text-base">
              ဆေးဝိုင်းစာရင်း
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative h-48 md:h-64">
            <img
              src="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Medical Products"
              className="absolute right-0 top-0 w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
