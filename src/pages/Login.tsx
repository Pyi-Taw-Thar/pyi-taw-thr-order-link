import { useState } from "react";
import { User, Phone } from "lucide-react";
import logo from "../assets/images/logo.jpg";
import authService from "../services/auth.service";

export default function Login() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("09");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidName = name.trim().length >= 2;
  const isValidPhone = phoneNumber.startsWith("09") && phoneNumber.length >= 8;
  const isFormValid = isValidName && isValidPhone;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidName || !isValidPhone) return;

    setLoading(true);
    try {
      await authService.login(phoneNumber, name.trim().toLowerCase());
      window.location.href = "/";
    } catch (err: any) {
      let msg = "Login ဝင်ရာတွင် ပြဿနာရှိနေပါသည်။ နောက်မှ ထပ်ကြိုးစားပါ။";
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.response?.status === 401 || err?.response?.status === 404) {
        msg = "အမည် သို့မဟုတ် ဖုန်းနံပါတ် မှားယွင်းနေပါသည် သို့မဟုတ် အကောင့်မရှိပါ။ ပြန်လည်စစ်ဆေးပါ။";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-44px)] bg-gray-50/50 md:bg-gray-50 flex flex-col md:justify-center md:items-center p-0 md:p-6">
      <div className="w-full md:max-w-md bg-white md:rounded-3xl md:shadow-lg md:border md:border-gray-100 flex flex-col h-[calc(100vh-44px)] md:h-auto overflow-hidden">
        <div className="flex-1 flex flex-col items-center px-6 pt-12 md:pt-10 md:pb-6">
          {/* Logo Section */}
          <div className="bg-white flex items-center justify-center mb-4">
            <img
              src={logo}
              alt="Logo"
              className="w-32 h-32 md:w-36 md:h-36 object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-[26px] md:text-2xl font-bold text-primary mb-2 text-center">
            အကောင့် Login ၀င်မယ်
          </h1>

          {/* Subtitle */}
          <p className="text-center text-gray-600 text-[14px] leading-relaxed mb-6 max-w-[320px]">
            ဆေးများအော်ဒါတင်ပြီး မှာယူရန်အတွက် <br />
            အကောင့်ဖွင့်ထားသော <span className="font-semibold text-gray-800">အမည်</span> နှင့် <span className="font-semibold text-gray-800">ဖုန်းနံပါတ်</span> ဖြင့် <br />
            login ၀င်ရန်လိုအပ်ပါသည်။
          </p>

          {/* Input Fields */}
          <form onSubmit={handleLogin} className="w-full max-w-sm px-2 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 ml-1">
                ဝယ်ယူသူ အမည်
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="အမည် ထည့်ပါ"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value.toLowerCase());
                    setError("");
                  }}
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-300 bg-gray-50/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 ml-1">
                ဖုန်းနံပါတ်
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  placeholder="ဖုန်းနံပါတ် ထည့်ပါ (09...)"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.startsWith("09")) {
                      setPhoneNumber(value);
                    } else if (value.length < 2) {
                      setPhoneNumber("09");
                    }
                    setError("");
                  }}
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-300 bg-gray-50/30 font-mono"
                />
              </div>
            </div>

            {error && (
              <p className="mt-3 text-red-500 text-xs font-medium text-center bg-red-50 py-2 px-3 rounded-lg border border-red-100">
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Login Button Area (Pinned to Bottom on Mobile, Regular on Laptop) */}
        <div className="p-6 bg-white border-t border-gray-100 pb-10 md:pb-8 md:border-t-0 md:pt-0">
          <button
            type="submit"
            onClick={handleLogin}
            disabled={!isFormValid || loading}
            className={`w-full py-4 rounded-full text-base font-bold transition-all flex items-center justify-center gap-2 ${
              isFormValid && !loading
                ? "bg-[#2563EB] text-white shadow-md active:scale-[0.98] cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                ဝင်နေပါသည်...
              </>
            ) : (
              "Login ၀င်မယ်"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
