import { ShoppingCart, User, Home, Bell } from "lucide-react";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import NotificationModal from "./NotificationModal";
import api from "../services/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const { cartCount } = useCart();

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUnreadNotificationsCount(0);
      return;
    }
    try {
      const res = await api.get("/customer/notifications?limit=1");
      setUnreadNotificationsCount(res.data.unreadCount || 0);
    } catch {
      // ignore
    }
  };

  // App ထဲ ဝင်ချိန် (Navbar mount) တွင် တစ်ကြိမ်သာ စစ်သည် — polling / socket မသုံး
  // (bell နှိပ်ချိန်နှင့် ဖတ်ပြီးမှတ်ချိန်တွင် NotificationModal က ပြန်စစ်သည်)
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="bg-primary p-2.5 rounded-xl hover:bg-primary-dark transition-colors"
          >
            <Home className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>

          {/* Logout ကို bell ဘေးတွင် မှားနှိပ်မိလွယ်၍ Profile page သို့ ရွှေ့ထား */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="relative group focus:outline-none"
              title="အသိပေးချက်များ"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:border-amber-100 hover:bg-amber-50 transition-all">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-500 group-hover:text-amber-600 transition-colors" />
              </div>
              {unreadNotificationsCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300 font-mono text-center">
                  {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                </div>
              )}
            </button>

            <Link to="/profile" className="relative group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:border-blue-100 hover:bg-blue-50 transition-all">
                <User className="w-5 h-5 md:w-6 md:h-6 text-gray-500 group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link to="/cart" className="relative group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white border border-primary-light/30 rounded-xl flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              {cartCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-[#ff3b30] text-white text-[10px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300 font-mono text-center">
                  {cartCount}
                </div>
              )}
            </Link>
          </div>
        </div>

      </div>
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onRefreshCount={fetchUnreadCount}
      />
    </nav>
  );
}
