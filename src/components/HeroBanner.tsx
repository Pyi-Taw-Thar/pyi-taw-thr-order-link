import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import banner from "../assets/images/pyitawtarbanner.jpg";

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-primary-dark to-primary-light relative overflow-hidden">
      <div className="container mx-auto py-8 md:py-20  ">
        <div className="grid grid-cols-7 gap-2 items-center">
          <div className="text-white space-y-6 px-4 col-span-4">
            <h1 className="text-[16px] md:text-xl lg:text-4xl font-bold leading-[1.8] lg:leading-[1.5]">
              လိုအပ်သော ဆေးဝါးနှင့် ကျန်းမာရေးပစ္စည်းများကို လွယ်ကူ လျှင်မြန်စွာဖြင့် ချက်ချင်း မှာယူလိုက်ပါ
            </h1>
            <button
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 text-[10px] md:text-base"
              onClick={() => {
                // TODO: Add navigation to order page
                navigate("/products");
              }}
            >
              အော်ဒါတင်မယ်
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative h-48 md:h-80 col-span-3">
            <img
              src={banner}
              alt="Medical Products"
              className="absolute right-0 top-0 w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
