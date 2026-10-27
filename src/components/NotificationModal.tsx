import { Bell, CheckCheck, PencilLine, Truck, XCircle, Info, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import BottomSheet from "./BottomSheet";
import { formatRelativeTime, getDayGroup } from "../utils/orderStatus";

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

const GROUP_LABELS = {
  today: "ယနေ့",
  yesterday: "မနေ့က",
  earlier: "ယခင်",
} as const;

// type အလိုက် icon — order_edited ✎ amber / ပယ်ဖျက် ✕ red / အခြား status 🚚 blue
const getTypeIcon = (item: CustomerNotificationItem) => {
  if (item.type === "order_edited") {
    return { Icon: PencilLine, className: "bg-amber-100 text-[#B45309]" };
  }
  if (item.type === "order_status") {
    return item.title.includes("ပယ်ဖျက်")
      ? { Icon: XCircle, className: "bg-red-100 text-[#B91C1C]" }
      : { Icon: Truck, className: "bg-blue-100 text-[#007FFF]" };
  }
  return { Icon: Info, className: "bg-gray-100 text-gray-500" };
};

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
    // sheet ဖွင့်ချိန်တစ်ကြိမ်သာ ယူ (fetchNotifications ကို dependency မထည့်)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ဖတ်ပြီးမှတ် → order ရှိလျှင် ထို order ၏ detail sheet ကို တန်းဖွင့်
  const openNotification = async (item: CustomerNotificationItem) => {
    if (!item.isRead) {
      try {
        await api.patch(`/customer/notifications/${item._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === item._id ? { ...n, isRead: true } : n))
        );
        if (onRefreshCount) onRefreshCount();
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }

    onClose();
    if (item.orderId) {
      navigate(`/profile?order=${item.orderId}`);
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

  const hasUnread = notifications.some((n) => !n.isRead);
  const groups = (["today", "yesterday", "earlier"] as const)
    .map((key) => ({
      key,
      items: notifications.filter((n) => getDayGroup(n.createdAt) === key),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="notification-sheet-title"
      title="အသိပေးချက်များ"
      headerAction={
        hasUnread && (
          <button
            onClick={markAllAsRead}
            className="shrink-0 min-h-[44px] inline-flex items-center gap-1 px-2 text-[12px] font-bold text-[#007FFF] hover:text-blue-700 rounded-lg focus-visible:ring-2 focus-visible:ring-[#007FFF] outline-none"
          >
            <CheckCheck className="w-4 h-4" />
            အားလုံးဖတ်ပြီး
          </button>
        )
      }
    >
      {loading && notifications.length === 0 ? (
        <div className="px-5 py-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[76px] rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="px-8 py-14 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <Bell className="w-6 h-6" />
          </div>
          <p className="mt-3 text-[13px] font-bold text-[#1A1A1A]">အသိပေးချက် မရှိသေးပါ</p>
          <p className="mt-1 text-[12px] text-gray-500 leading-relaxed">
            အော်ဒါ အခြေအနေ ပြောင်းလျှင် ဤနေရာတွင် ပြပါမည်
          </p>
        </div>
      ) : (
        <div className="pb-3">
          {groups.map((group) => (
            <section key={group.key}>
              <h3 className="px-5 pt-4 pb-1.5 text-[12px] font-bold text-gray-500">
                {GROUP_LABELS[group.key]}
              </h3>
              <ul className="px-2">
                {group.items.map((item) => {
                  const { Icon, className } = getTypeIcon(item);
                  return (
                    <li key={item._id}>
                      <button
                        type="button"
                        onClick={() => openNotification(item)}
                        className={`w-full text-left flex items-start gap-3 rounded-2xl px-3 py-3 transition-colors focus-visible:ring-2 focus-visible:ring-[#007FFF] outline-none ${
                          item.isRead ? "hover:bg-gray-50" : "bg-blue-50/70 hover:bg-blue-50"
                        }`}
                      >
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${className}`}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="flex items-start gap-2">
                            <span
                              className={`flex-1 min-w-0 text-[13px] leading-snug break-words ${
                                item.isRead ? "font-medium text-gray-700" : "font-bold text-[#1A1A1A]"
                              }`}
                            >
                              {item.title}
                            </span>
                            {!item.isRead && (
                              <span
                                className="w-2 h-2 rounded-full bg-[#007FFF] shrink-0 mt-1.5"
                                aria-label="မဖတ်ရသေး"
                              />
                            )}
                          </span>
                          <span className="block mt-1 text-[12px] text-gray-600 leading-relaxed line-clamp-2 whitespace-pre-line break-words">
                            {item.message}
                          </span>
                          <span className="mt-1.5 flex items-center justify-between gap-2 text-[12px]">
                            <span className="text-gray-400">{formatRelativeTime(item.createdAt)}</span>
                            {item.orderId && (
                              <span className="inline-flex items-center font-bold text-[#007FFF]">
                                အော်ဒါကြည့်မယ် <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </BottomSheet>
  );
}
