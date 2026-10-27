import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Truck, MessageCircle, Phone, MapPin, Clock, Mail, Facebook } from "lucide-react";
import api from "../services/axios";
import logo from "../assets/images/logo.jpg";

// Dashboard ၏ Settings တွင် သတ်မှတ်ထားသော ဆိုင်အချက်အလက် (GET /shop-settings — public)
interface ShopSettings {
  shopName?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  logo?: string;
  businessHours?: Record<string, { open?: string; close?: string; closed?: boolean }>;
  socialMedia?: { facebook?: string | null };
}

const DAY_LABELS: [string, string][] = [
  ["monday", "တနင်္လာ"],
  ["tuesday", "အင်္ဂါ"],
  ["wednesday", "ဗုဒ္ဓဟူး"],
  ["thursday", "ကြာသပတေး"],
  ["friday", "သောကြာ"],
  ["saturday", "စနေ"],
  ["sunday", "တနင်္ဂနွေ"],
];

const SERVICES = [
  { icon: ShieldCheck, title: "စစ်မှန်သော ဆေးဝါးများ", desc: "တရားဝင် ဖြန့်ချိသူများထံမှ တိုက်ရိုက်ယူထားသော ဆေးဝါးများ" },
  { icon: Truck, title: "အမြန် ပို့ဆောင်ပေးခြင်း", desc: "အော်ဒါတင်ပြီး မကြာမီ ဆိုင်မှ ဆက်သွယ်ပြီး ပို့ဆောင်ပေးပါသည်" },
  { icon: MessageCircle, title: "တိုက်ရိုက် ဆက်သွယ်နိုင်ခြင်း", desc: "ဆေးဝါးနှင့် အော်ဒါဆိုင်ရာ မေးမြန်းလိုသည်များကို ဆက်သွယ်နိုင်ပါသည်" },
];

export default function About() {
  const navigate = useNavigate();
  const [shop, setShop] = useState<ShopSettings | null>(null);

  useEffect(() => {
    api
      .get("/shop-settings")
      .then((res) => setShop(res.data?.data || null))
      .catch(() => setShop(null));
  }, []);

  const shopName = shop?.shopName || "ပြည်တော်သာ";
  const hours = shop?.businessHours;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 font-ChivoMono">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-sm font-bold text-gray-800">ဆိုင်အကြောင်း</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Shop intro */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 text-center space-y-3">
          <img src={shop?.logo || logo} alt={shopName} className="w-24 h-24 object-contain mx-auto" />
          <h2 className="text-xl font-bold text-primary-dark">{shopName}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            လိုအပ်သော ဆေးဝါးနှင့် ကျန်းမာရေး ပစ္စည်းများကို ဖုန်းမှတစ်ဆင့် လွယ်ကူလျင်မြန်စွာ မှာယူနိုင်ရန်
            ဝန်ဆောင်မှုပေးနေပါသည်။
          </p>
        </div>

        {/* Services */}
        <div className="grid gap-3">
          {SERVICES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-gray-800">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact — shop settings တွင် ထည့်ထားသော အချက်များသာ ပြ */}
        {shop && (shop.phoneNumber || shop.address || shop.email || shop.socialMedia?.facebook) && (
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm">ဆက်သွယ်ရန်</h3>
            <div className="space-y-3 text-sm text-gray-700">
              {shop.phoneNumber && (
                <a href={`tel:${shop.phoneNumber}`} className="flex items-center gap-3 hover:text-primary">
                  <Phone className="w-4 h-4 text-primary shrink-0" /> {shop.phoneNumber}
                </a>
              )}
              {shop.address && (
                <p className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {shop.address}
                </p>
              )}
              {shop.email && (
                <a href={`mailto:${shop.email}`} className="flex items-center gap-3 hover:text-primary">
                  <Mail className="w-4 h-4 text-primary shrink-0" /> {shop.email}
                </a>
              )}
              {shop.socialMedia?.facebook && (
                <a href={shop.socialMedia.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary">
                  <Facebook className="w-4 h-4 text-primary shrink-0" /> Facebook
                </a>
              )}
            </div>
          </div>
        )}

        {/* Business hours */}
        {hours && (
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 space-y-3">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> ဖွင့်ချိန်
            </h3>
            <div className="divide-y divide-gray-100 text-sm">
              {DAY_LABELS.map(([key, label]) => {
                const day = hours[key];
                return (
                  <div key={key} className="flex justify-between py-2">
                    <span className="text-gray-600">{label}</span>
                    <span className={day?.closed ? "text-red-500" : "text-gray-800 font-medium"}>
                      {day?.closed ? "ပိတ်" : day?.open && day?.close ? `${day.open} - ${day.close}` : "-"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
