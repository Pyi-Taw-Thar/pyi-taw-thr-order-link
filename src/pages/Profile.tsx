import { ArrowLeft, MapPin, Package, ChevronRight, AlertTriangle, LogOut, Wallet } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import api from "../services/axios";
import authService from "../services/auth.service";
import { useMyCredit } from "../services/customerQueries";
import LogoutModal from "../components/LogoutModal";
import OrderDetailSheet, { OrderData } from "../components/OrderDetailSheet";
import {
  ACTIVE_STATUSES,
  formatDateTime,
  formatMoney,
  getStatusColor,
  getStatusLabel,
} from "../utils/orderStatus";

interface Address {
  label: string;
  addressLine: string;
  city: string;
  isDefault: boolean;
}

interface ProfileData {
  _id: string;
  name: string;
  phone: string;
  isActive: boolean;
  address?: string;
  township?: string;
  tier?: string;
  addresses?: Address[];
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

type OrderFilter = "all" | "active" | "done";

const FILTERS: { key: OrderFilter; label: string }[] = [
  { key: "all", label: "အားလုံး" },
  { key: "active", label: "လုပ်ဆောင်ဆဲ" },
  { key: "done", label: "ပြီးဆုံး" },
];

const PAGE_SIZE = 10;

// Card ခေါင်းစဉ် — ပထမ ပစ္စည်း + ကျန်အရေအတွက်
const orderTitle = (order: OrderData) => {
  const [first, ...rest] = order.products || [];
  if (!first) return "ပစ္စည်း မရှိ";
  return rest.length > 0
    ? `${first.productName} နှင့် အခြား ${rest.length} မျိုး`
    : first.productName;
};

function OrderCard({ order, onOpen }: { order: OrderData; onOpen: () => void }) {
  const color = getStatusColor(order.status);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative w-full text-left bg-white rounded-2xl border border-gray-100 pl-5 pr-3 py-3.5 overflow-hidden active:bg-gray-50 hover:border-gray-200 focus-visible:ring-2 focus-visible:ring-[#007FFF] outline-none transition-colors"
    >
      {/* ဘယ်ဘက် အရောင်ဘား = status */}
      <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${color.bar}`} aria-hidden="true" />
      <div className="flex items-start gap-3">
        <p className="flex-1 min-w-0 text-[15px] font-bold text-[#1A1A1A] leading-snug break-words line-clamp-2">
          {orderTitle(order)}
        </p>
        <span className={`shrink-0 inline-flex items-center gap-1.5 text-[12px] font-bold ${color.text} mt-0.5`}>
          <span className={`w-2 h-2 rounded-full ${color.dot}`} />
          {getStatusLabel(order.status)}
        </span>
      </div>
      <p className="text-[12px] text-gray-500 mt-1">{formatDateTime(order.createdAt)}</p>
      <div className="flex items-center justify-between gap-3 mt-2.5">
        {order.isEdited ? (
          <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#B45309]">
            <AlertTriangle className="w-3.5 h-3.5" />
            ပြင်ဆင်ထားသည်
          </span>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 text-[#014E9C]">
          <span className="text-[20px] font-bold leading-none">{formatMoney(order.totalAmount)}</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </span>
      </div>
    </button>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [fetchedOrder, setFetchedOrder] = useState<OrderData | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const { data: creditInfo, isLoading: creditLoading } = useMyCredit();

  const selectedOrderId = searchParams.get("order");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/customer/me");
        setProfile(response.data.data);
      } catch (err) {
        const msg =
          (axios.isAxiosError(err) && err.response?.data?.message) ||
          "ပရိုဖိုင်အချက်အလက်များ ရယူရန် ပြဿနာရှိနေပါသည်။";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Load more — page အသစ်ကို ရှိပြီးသား list နောက်တွင် ဆက်ထည့်
  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const response = await api.get("/ecommerce/orders", {
          params: { page, limit: PAGE_SIZE },
        });
        const incoming: OrderData[] = response.data.data || [];
        setOrders((prev) => {
          if (page === 1) return incoming;
          const seen = new Set(prev.map((o) => o._id));
          return [...prev, ...incoming.filter((o) => !seen.has(o._id))];
        });
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  const listedOrder = useMemo(
    () => orders.find((o) => o._id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  // ?order=<id> (notification မှ ဝင်လာခြင်း) — list ထဲမရှိလျှင် API မှ တိုက်ရိုက်ယူ
  useEffect(() => {
    if (!selectedOrderId || listedOrder || ordersLoading) return;
    if (fetchedOrder?._id === selectedOrderId) return;
    let cancelled = false;
    setOrderLoading(true);
    api
      .get(`/ecommerce/orders/${selectedOrderId}`)
      .then((res) => {
        if (!cancelled) setFetchedOrder(res.data.data);
      })
      .catch(() => {
        // မတွေ့လျှင် sheet ကို ပိတ်
        if (!cancelled) setSearchParams({}, { replace: true });
      })
      .finally(() => {
        if (!cancelled) setOrderLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedOrderId, listedOrder, ordersLoading, fetchedOrder, setSearchParams]);

  const selectedOrder =
    listedOrder || (fetchedOrder?._id === selectedOrderId ? fetchedOrder : null);

  const openOrder = (id: string) => setSearchParams({ order: id });
  const closeOrder = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams]);

  const visibleOrders = useMemo(() => {
    if (filter === "active") return orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
    if (filter === "done") return orders.filter((o) => !ACTIVE_STATUSES.includes(o.status));
    return orders;
  }, [orders, filter]);

  const hasMore = pagination ? pagination.currentPage < pagination.totalPages : false;

  if (loading) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center">
        <div className="text-primary font-bold animate-pulse">
          ပရိုဖိုင်အချက်အလက်များ ရှာဖွေနေပါသည်...
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex flex-col items-center justify-center space-y-4 px-4">
        <p className="text-gray-500 text-sm text-center">
          {error || "ပရိုဖိုင် ရှာမတွေ့ပါ။"}
        </p>
        <button onClick={() => navigate(-1)} className="text-primary font-bold">
          နောက်သို့ပြန်သွားရန်
        </button>
      </div>
    );
  }

  const defaultAddress =
    profile.addresses?.find((a) => a.isDefault) || profile.addresses?.[0];
  const addressText = defaultAddress
    ? [defaultAddress.addressLine, defaultAddress.city].filter(Boolean).join(", ")
    : [profile.address, profile.township].filter(Boolean).join(", ");
  const initial = (profile.name || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20 font-ChivoMono">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-2 py-2 flex items-center gap-1 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          aria-label="နောက်သို့"
          className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <h1 className="text-[15px] font-bold text-[#1A1A1A]">ကိုယ်ရေးအချက်အလက်</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-6">
        {/* Profile — avatar + အမည် + ဖုန်း + လိပ်စာ */}
        <section className="flex items-start gap-3.5 bg-white rounded-2xl border border-gray-100 p-4">
          <div className="w-12 h-12 rounded-full bg-[#007FFF] text-white flex items-center justify-center text-[20px] font-bold shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-bold text-[#1A1A1A] break-words">{profile.name}</h2>
            <p className="text-[13px] text-gray-500">{profile.phone}</p>
            {addressText && (
              <p className="mt-1 flex items-start gap-1 text-[12px] text-gray-500 break-words">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" />
                <span className="min-w-0">{addressText}</span>
              </p>
            )}
          </div>
        </section>

        {/* ပေးရန်ကျန်ငွေ Card */}
        <section
          className={`rounded-2xl border p-4 flex items-center justify-between gap-3 ${
            (creditInfo?.creditRemaining ?? 0) > 0
              ? "bg-amber-50/80 border-amber-200"
              : "bg-emerald-50/70 border-emerald-200"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                (creditInfo?.creditRemaining ?? 0) > 0
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              <Wallet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              {creditLoading ? (
                <p className="text-[13px] font-bold text-gray-500">စစ်ဆေးနေပါသည်...</p>
              ) : (creditInfo?.creditRemaining ?? 0) > 0 ? (
                <p className="text-[15px] font-bold text-[#B45309] break-words">
                  ပေးရန်ကျန်ငွေ {(creditInfo?.creditRemaining ?? 0).toLocaleString()} MMK
                </p>
              ) : (
                <p className="text-[14px] font-bold text-[#15803D]">
                  ပေးရန် ကျန်ငွေ မရှိပါ
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Order history */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-[15px] font-bold text-[#1A1A1A]">မှာယူမှုမှတ်တမ်း</h3>
            {pagination && (
              <span className="text-[12px] text-gray-500">{pagination.totalItems} ခု</span>
            )}
          </div>

          {orders.length > 0 && (
            <div role="tablist" className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-xl">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={filter === f.key}
                  onClick={() => setFilter(f.key)}
                  className={`min-h-[40px] rounded-lg text-[13px] font-bold transition-colors ${
                    filter === f.key
                      ? "bg-white text-[#007FFF] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {ordersLoading && orders.length === 0 ? (
            <div className="space-y-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[104px] bg-white rounded-2xl border border-gray-100 animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="py-10 text-center space-y-3 bg-white rounded-2xl border border-gray-100">
              <Package className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-[13px] text-gray-500">မှာယူမှုမှတ်တမ်း မရှိသေးပါ</p>
              <Link
                to="/products"
                className="inline-flex items-center min-h-[44px] bg-[#007FFF] text-white px-5 rounded-xl font-bold text-[13px]"
              >
                ဆေးဝါးများကြည့်မယ်
              </Link>
            </div>
          ) : (
            <>
              {visibleOrders.length === 0 ? (
                <p className="py-8 text-center text-[13px] text-gray-500">
                  {filter === "active"
                    ? "လုပ်ဆောင်ဆဲ အော်ဒါ မရှိပါ"
                    : "ပြီးဆုံးသော အော်ဒါ မရှိသေးပါ"}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {visibleOrders.map((order) => (
                    <OrderCard key={order._id} order={order} onOpen={() => openOrder(order._id)} />
                  ))}
                </div>
              )}

              {hasMore && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={ordersLoading}
                  className="w-full min-h-[44px] rounded-xl border border-gray-200 bg-white text-[13px] font-bold text-[#007FFF] hover:bg-blue-50 disabled:opacity-50 transition-colors"
                >
                  {ordersLoading ? "ရယူနေပါသည်..." : "နောက်ထပ် ကြည့်မယ်"}
                </button>
              )}
            </>
          )}
        </section>

        {/* Logout — navbar တွင် မှားနှိပ်မိလွယ်၍ ဤနေရာသို့ ရွှေ့ထား */}
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-2xl font-bold text-[13px] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          ထွက်မယ် (Logout)
        </button>
      </div>

      <OrderDetailSheet
        order={selectedOrderId ? selectedOrder : null}
        loading={Boolean(selectedOrderId) && !selectedOrder && (orderLoading || ordersLoading)}
        onClose={closeOrder}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          authService.logout();
          window.location.replace("/");
        }}
      />
    </div>
  );
}
