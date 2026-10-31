// Order status / payment label + အရောင် နှင့် အချိန်ပြ helper (Profile + Notification မျှသုံး)

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "စောင့်ဆိုင်းဆဲ",
  confirmed: "ထုပ်ပိုးဆဲ",
  shipped: "ပို့ဆောင်ဆဲ",
  delivered: "ရောက်ရှိပြီး",
  cancelled: "ပယ်ဖျက်ပြီး",
};

// status တစ်ခုချင်း၏ အရောင် — text (စာ/အစက်), bar (card ဘယ်ဘက်ဘား), soft (နောက်ခံ)
export const ORDER_STATUS_COLORS: Record<
  string,
  { text: string; dot: string; bar: string; soft: string }
> = {
  pending: { text: "text-[#B45309]", dot: "bg-[#B45309]", bar: "bg-[#F59E0B]", soft: "bg-amber-50" },
  confirmed: { text: "text-[#007FFF]", dot: "bg-[#007FFF]", bar: "bg-[#007FFF]", soft: "bg-blue-50" },
  shipped: { text: "text-[#4338CA]", dot: "bg-[#4338CA]", bar: "bg-[#6366F1]", soft: "bg-indigo-50" },
  delivered: { text: "text-[#15803D]", dot: "bg-[#15803D]", bar: "bg-[#22C55E]", soft: "bg-green-50" },
  cancelled: { text: "text-[#B91C1C]", dot: "bg-[#B91C1C]", bar: "bg-[#EF4444]", soft: "bg-red-50" },
};

const FALLBACK_COLOR = { text: "text-gray-600", dot: "bg-gray-400", bar: "bg-gray-300", soft: "bg-gray-50" };

export const getStatusColor = (status: string) =>
  ORDER_STATUS_COLORS[status] || FALLBACK_COLOR;

export const getStatusLabel = (status: string) =>
  ORDER_STATUS_LABELS[status] || status;

// "လုပ်ဆောင်ဆဲ" filter — မပြီးသေးသော order များ
export const ACTIVE_STATUSES = ["pending", "confirmed", "shipped"];

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: "ငွေမချေရသေး",
  partial: "တစ်စိတ်တစ်ပိုင်း ပေးပြီး",
  paid: "ငွေချေပြီး",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash_on_delivery: "ပစ္စည်းရောက်မှ ငွေချေ",
};

export const formatMoney = (amount: number) =>
  `${Math.round(amount || 0).toLocaleString()} Ks`;

export const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

// ရက်အလိုက် အုပ်စု — ယနေ့ / မနေ့က / ယခင်
export const getDayGroup = (dateStr: string): "today" | "yesterday" | "earlier" => {
  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(new Date(dateStr))) / 86_400_000
  );
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  return "earlier";
};

// Relative time — ယခုလေးတင် / N မိနစ်က / N နာရီက / မနေ့က / ရက်စွဲ
export const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (diffMin < 1) return "ယခုလေးတင်";
  if (diffMin < 60) return `${diffMin} မိနစ်က`;
  const group = getDayGroup(dateStr);
  if (group === "today") return `${Math.floor(diffMin / 60)} နာရီက`;
  if (group === "yesterday") return "မနေ့က";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
