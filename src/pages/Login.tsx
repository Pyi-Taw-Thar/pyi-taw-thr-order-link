import { useState } from "react";
import logo from "../assets/images/logo.png";
import authService from "../services/auth.service";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("09");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (phoneNumber.length < 8) return;

    setLoading(true);
    try {
      await authService.login(phoneNumber);
      window.location.href = "/";
    } catch (err: any) {
      let msg = "Login ဝင်ရာတွင် ပြဿနာရှိနေပါသည်။ နောက်မှ ထပ်ကြိုးစားပါ။";
      if (err?.response?.status === 401 || err?.response?.status === 404) {
        msg = "ဖုန်းနံပါတ် မှားယွင်းနေပါသည် သို့မဟုတ် အကောင့်မရှိပါ။ ဖုန်းနံပါတ် ပြန်လည်စစ်ဆေးပါ။";
      } else if (err?.response?.data?.message) {
        msg = err.response.data.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isValidPhone = phoneNumber.startsWith("09") && phoneNumber.length >= 8;

  return (
    <div className="min-h-[calc(100vh-44px)] bg-gray-50/50 md:bg-gray-50 flex flex-col md:justify-center md:items-center p-0 md:p-6">
      <div className="w-full md:max-w-md bg-white md:rounded-3xl md:shadow-lg md:border md:border-gray-100 flex flex-col h-[calc(100vh-44px)] md:h-auto overflow-hidden">
        <div className="flex-1 flex flex-col items-center px-6 pt-16 md:pt-12 md:pb-6">
          {/* Logo Section */}
          <div className="bg-white flex items-center justify-center mb-6">
            <img
              src={logo}
              alt="Logo"
              className="w-40 h-40 object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-[28px] md:text-2xl font-bold text-primary mb-3 text-center">
            အကောင့် Login ၀င်မယ်
          </h1>

          {/* Subtitle */}
          <p className="text-center text-gray-600 text-[15px] leading-relaxed mb-8 max-w-[320px]">
            ဆေးများအော်ဒါတင်ပြီး မှာယူရန်အတွက် <br />
            အကောင့်ဖွင့်ထားသော ဖုန်းနံပါတ်ဖြင့် login <br />
            ၀င်ရန်လိုအပ်ပါသည်။
          </p>

          {/* Input Field */}
          <div className="w-full max-w-sm px-2">
            <input
              type="tel"
              placeholder="ဖုန်းနံပါတ်ထည့်ပါ"
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
              className="w-full p-6 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-300 bg-gray-50/30 font-mono"
            />
          </div>

          {error && (
            <p className="mt-4 text-red-500 text-sm font-medium text-center max-w-sm">
              {error}
            </p>
          )}
        </div>

        {/* Login Button Area (Pinned to Bottom on Mobile, Regular on Laptop) */}
        <div className="p-6 bg-white border-t border-gray-100 pb-10 md:pb-8 md:border-t-0 md:pt-0">
          <button
            onClick={handleLogin}
            disabled={!isValidPhone || loading}
            className={`w-full py-6 md:py-4 rounded-full text-lg font-bold transition-all flex items-center justify-center gap-2 ${
              isValidPhone && !loading
                ? "bg-[#2563EB] text-white shadow-md active:scale-[0.98]"
                : "bg-gray-200 text-gray-400"
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
