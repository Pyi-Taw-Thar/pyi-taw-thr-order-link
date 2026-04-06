import { useState } from "react";
import logo from "../assets/images/logo.png";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("09");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber === "09955255972") {
      // Save login state
      localStorage.setItem("user_phone", phoneNumber);
      localStorage.setItem("isLoggedIn", "true");
      // Redirect to home
      window.location.href = "/";
    }
  };

  const isValidPhone = phoneNumber === "09955255972";

  return (
    <div className="h-[calc(100vh-44px)] bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center px-6 pt-20">
        {/* Logo Section */}
        <div className="bg-white flex items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-[28px] font-bold text-primary mb-3 text-center">
          အကောင့် Login ၀င်မယ်
        </h1>

        {/* Subtitle */}
        <p className="text-center text-gray-600 text-[15px] leading-relaxed mb-10 max-w-[320px]">
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
              const value = e.target.value;
              if (value.startsWith("09")) {
                setPhoneNumber(value);
              } else if (value.length < 2) {
                setPhoneNumber("09");
              }
            }}
            className="w-full p-6 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-300 bg-gray-50/30 font-mono"
          />
        </div>
      </div>

      {/* Login Button Area (Pinned to Bottom) */}
      <div className="p-6 bg-white border-t border-gray-100 pb-10">
        <button
          onClick={handleLogin}
          disabled={!isValidPhone}
          className={`w-full py-6 rounded-full text-lg font-bold transition-all ${isValidPhone
            ? "bg-[#2563EB] text-white shadow-md active:scale-[0.98]"
            : "bg-gray-200 text-gray-400"
            }`}
        >
          Login ၀င်မယ်
        </button>
      </div>
    </div>
  );
}
