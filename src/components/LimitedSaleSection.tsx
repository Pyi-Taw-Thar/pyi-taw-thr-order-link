import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  quantity: string;
  price: number;
  originalPrice: number;
  discount: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "ပါရာစီတမော ၅၀၀ မိလီဂရမ် (၁၀ လုံးပါ)",
    quantity: "ဒီလိုက်စုံ (၃၀ ကျပ်)",
    price: 1500,
    originalPrice: 3000,
    discount: "စျေးလျော့",
  },
  {
    id: 2,
    name: "ပါရာစီတမော ၅၀၀ မိလီဂရမ် (၁၀ လုံးပါ)",
    quantity: "ဒီလိုက်စုံ (၁၀၀ ကျပ်)",
    price: 1500,
    originalPrice: 3000,
    discount: "စျေးလျော့",
  },
  {
    id: 3,
    name: "ပါရာစီတမော ၅၀၀ မိလီဂရမ် (၁၀ လုံးပါ)",
    quantity: "ဒီလိုက်စုံ (၃၀ ကျပ်)",
    price: 1500,
    originalPrice: 3000,
    discount: "စျေးလျော့",
  },
  {
    id: 4,
    name: "ပါရာစီတမော ၅၀၀ မိလီဂရမ် (၁၀ လုံးပါ)",
    quantity: "ဒီလိုက်စုံ (၁၀၀ ကျပ်)",
    price: 1500,
    originalPrice: 3000,
    discount: "စျေးလျော့",
  },
];

export default function LimitedSaleSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-8">
      <div className="px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-800 text-lg font-semibold">
              အကန့်သတ်ရသောဆေးများ
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              အရေတွက် အကန့်သန့်ဖြင့်သာ <br /> ဝယ်ယူလို့ရသောဆေးများ
            </p>
          </div>
          <button
            onClick={() => {
              navigate("/products");
            }}
            className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center gap-1 text-sm whitespace-nowrap"
          >
            ကြည့်မယ်
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-50 rounded-lg px-4 py-6 flex flex-col space-y-5"
            >
              <div className="space-y-2">
                <h3 className="text-gray-800 font-semibold text-sm">
                  {product.name}
                </h3>
                {/* <p className="text-gray-600 text-xs">{product.quantity}</p> */}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold text-base">
                  {product.price.toLocaleString()} MMK
                </span>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded">
                  ဘူး ၁၀၀ သာ
                </span>
              </div>

              <button
                onClick={() => navigate("/products")}
                className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors text-sm"
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
