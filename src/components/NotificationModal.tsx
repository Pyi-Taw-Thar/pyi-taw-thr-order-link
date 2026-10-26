import { X, Bell, CheckCheck, AlertCircle, Clock, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";

export interface CustomerNotificationItem {
  _id: string;
  orderId?: string | null;
  orderNumber?: string | null;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshCount?: () => void;
}

export default function NotificationModal({
  isOpen,
  onClose,
  onRefreshCount,
}: NotificationModalProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<CustomerNotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customer/notifications");
      setNotifications(res.data.data || []);
      if (onRefreshCount) onRefreshCount();
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const markAsRead = async (id: string, orderNumber?: string | null) => {
    try {
      await api.patch(`/customer/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      if (onRefreshCount) onRefreshCount();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }

    onClose();
    if (orderNumber) {
      navigate("/profile");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/customer/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      if (onRefreshCount) onRefreshCount();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("my-MM", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 border border-gray-100 font-ChivoMono">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[15px] md:text-base font-bold text-gray-900 leading-tight">
                အသိပေးချက်များ
              </h2>
              <p className="text-[10px] text-gray-400">
                အော်ဒါနှင့် ဝန်ဆောင်မှုဆိုင်ရာ အသိပေးချက်များ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-primary hover:text-blue-700 flex items-center gap-1 transition-colors"
                title="အားလုံးဖတ်ပြီးမှတ်သားမည်"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ဖတ်ပြီးမှတ်မည်</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1 divide-y divide-gray-50">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 text-xs">အသိပေးချက်များ ရယူနေပါသည်...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-gray-400 text-sm font-medium">အသိပေးချက် မရှိသေးပါ</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item._id}
                onClick={() => markAsRead(item._id, item.orderNumber)}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 pt-3 ${
                  item.isRead
                    ? "bg-white hover:bg-gray-50 text-gray-700"
                    : "bg-blue-50/60 hover:bg-blue-50 text-gray-900 border border-blue-100/80"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    item.type === "order_edited"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-blue-100 text-primary"
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-[13px] line-clamp-1">
                      {item.title}
                    </h3>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {formatTime(item.createdAt)}
                    </span>
                    {item.orderNumber && (
                      <span className="text-[10px] text-primary font-bold hover:underline inline-flex items-center gap-0.5">
                        အော်ဒါကြည့်ရန် <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <button
            onClick={() => {
              onClose();
              navigate("/profile");
            }}
            className="text-[12px] font-bold text-primary hover:underline"
          >
            မှာယူမှုမှတ်တမ်း (Order History) သို့ သွားမည်
          </button>
        </div>
      </div>
    </div>
  );
}
