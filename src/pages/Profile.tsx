import {
  ArrowLeft,
  User,
  MapPin,
  Package,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/axios";

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
  addresses: Address[];
  createdAt: string;
}

interface OrderProduct {
  _id: string;
  productName: string;
  productCode: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  note: string | null;
  products: OrderProduct[];
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  delivered: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentStatusStyles: Record<string, string> = {
  unpaid: "bg-yellow-50 text-yellow-600",
  paid: "bg-green-50 text-green-600",
};

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/customer/me");
        setProfile(response.data.data);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          "ပရိုဖိုင်အချက်အလက်များ ရယူရန် ပြဿနာရှိနေပါသည်။";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const response = await api.get("/ecommerce/orders", {
          params: { page, limit: 10 },
        });
        setOrders(response.data.data);
        setPagination(response.data.pagination);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 font-ChivoMono">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-sm font-bold text-gray-800">Profile</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <User className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {profile.name}
              </h2>
              <p className="text-gray-500 text-sm">{profile.phone}</p>
              <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                <Clock className="w-3 h-3" />
                <span>Member since {formatDate(profile.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses */}
        {profile.addresses.length > 0 && (
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              လိပ်စာများ
            </h3>
            <div className="space-y-3">
              {profile.addresses.map((addr, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800 text-sm">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="bg-primary/10 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-[13px]">
                    {addr.addressLine}, {addr.city}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order History */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 space-y-4">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            မှာယူမှုမှတ်တမ်း
          </h3>

          {ordersLoading && orders.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <div className="text-primary font-bold animate-pulse text-sm">
                မှာယူမှုများ ရှာဖွေနေပါသည်...
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Package className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">
                မှာယူမှုမှတ်တမ်း မရှိသေးပါ
              </p>
              <Link
                to="/products"
                className="inline-block bg-primary text-white px-5 py-2 rounded-xl font-bold text-xs"
              >
                ဆေးဝါးများကြည့်မယ်
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-800 text-[12px]">
                          {order.orderNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${paymentStatusStyles[order.paymentStatus] || "bg-gray-50 text-gray-500"}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-400">
                      {formatDateTime(order.createdAt)}
                    </div>

                    <div className="space-y-1.5">
                      {order.products.slice(0, 3).map((p) => (
                        <div
                          key={p._id}
                          className="flex items-center justify-between text-[12px]"
                        >
                          <span className="text-gray-700 truncate max-w-[180px] md:max-w-[300px]">
                            {p.productName}
                            <span className="text-gray-400">
                              {" "}
                              × {p.quantity} {p.unit}
                            </span>
                          </span>
                          <span className="font-bold text-gray-800 font-mono">
                            {p.subtotal.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {order.products.length > 3 && (
                        <p className="text-[10px] text-gray-400">
                          + {order.products.length - 3} items more
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                      <span className="text-[12px] text-gray-500 font-bold">
                        စုစုပေါင်း
                      </span>
                      <span className="text-primary font-bold text-[14px] font-mono">
                        {order.totalAmount.toLocaleString()} MMK
                      </span>
                    </div>

                    {order.note && (
                      <div className="bg-yellow-50 rounded-xl p-2.5 text-[11px] text-yellow-700">
                        <span className="font-bold">Note:</span> {order.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || ordersLoading}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <span className="text-[12px] text-gray-500 font-bold">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    disabled={page === pagination.totalPages || ordersLoading}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
