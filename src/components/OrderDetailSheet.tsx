import { AlertTriangle, Pill } from "lucide-react";
import BottomSheet from "./BottomSheet";
import OrderStatusTimeline from "./OrderStatusTimeline";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  formatDateTime,
  formatMoney,
} from "../utils/orderStatus";

export interface OrderProduct {
  _id: string;
  inventoryId?: { _id: string; images?: { url: string }[] } | string | null;
  productName: string;
  productCode: string;
  unit: string;
  quantity: number;
  originalQuantity?: number | null;
  // Fulfillment တွင် unit ပြောင်းသွားလျှင် customer မှာခဲ့သော မူလ unit
  originalUnit?: string | null;
  unitPrice: number;
  subtotal: number;
  // ဆိုင်က ဈေးပြင်ထားသော line ဖြစ်ကြောင်းနှင့် မူလဈေးနှုန်း
  priceOverridden?: boolean;
  originalUnitPrice?: number | null;
}

export interface OrderData {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  note: string | null;
  isEdited?: boolean;
  editedReason?: string | null;
  editedAt?: string | null;
  shippingAddress?: { label?: string; addressLine?: string; city?: string } | null;
  products: OrderProduct[];
  createdAt: string;
}

interface OrderDetailSheetProps {
  order: OrderData | null;
  loading?: boolean;
  onClose: () => void;
}

const getImageUrl = (p: OrderProduct) =>
  typeof p.inventoryId === "object" && p.inventoryId
    ? p.inventoryId.images?.[0]?.url
    : undefined;

export default function OrderDetailSheet({ order, loading, onClose }: OrderDetailSheetProps) {
  const isOpen = Boolean(order) || Boolean(loading);
  const address = order?.shippingAddress
    ? [order.shippingAddress.addressLine, order.shippingAddress.city]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="order-detail-title"
      title={order ? order.orderNumber : "အော်ဒါ"}
      subtitle={order ? formatDateTime(order.createdAt) : undefined}
      footer={
        order && (
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-gray-500">စုစုပေါင်း</span>
            <span className="text-[20px] font-bold text-[#014E9C]">
              {formatMoney(order.totalAmount)}
            </span>
          </div>
        )
      }
    >
      {!order ? (
        <div className="py-16 text-center text-[13px] text-gray-400 motion-safe:animate-pulse">
          အော်ဒါ အချက်အလက် ရယူနေပါသည်...
        </div>
      ) : (
        <div className="px-5 py-4 space-y-5">
          <OrderStatusTimeline status={order.status} />

          {(order.note || order.isEdited) && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5">
              <p className="flex items-center gap-1.5 text-[13px] font-bold text-[#B45309]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {order.isEdited ? "ဆိုင်မှ ပြင်ဆင်ထားသည်" : "မှတ်ချက်"}
              </p>
              {(order.note || order.editedReason) && (
                <p className="mt-1.5 text-[12px] text-amber-900 leading-relaxed whitespace-pre-line break-words">
                  {/* ခေါင်းစဉ်တွင် icon ရှိပြီးဖြစ်၍ note ရှေ့ ⚠️ ကို ဖယ် */}
                  {(order.note || order.editedReason || "").replace(/^⚠️\s*/u, "")}
                </p>
              )}
            </div>
          )}

          <section>
            <h3 className="text-[13px] font-bold text-gray-500 mb-2">
              ပစ္စည်း ({order.products.length})
            </h3>
            <ul className="divide-y divide-gray-100">
              {order.products.map((p) => {
                const img = getImageUrl(p);
                const originalUnit = p.originalUnit || p.unit;
                // quantity သို့မဟုတ် unit တစ်ခုခု ပြောင်းသွားလျှင် မူလ မှာယူမှုကို ပြ
                const reduced =
                  p.originalQuantity != null &&
                  (p.originalQuantity !== p.quantity || originalUnit !== p.unit);
                return (
                  <li key={p._id} className="flex items-start gap-3 py-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      {img ? (
                        <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <Pill className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#1A1A1A] leading-snug break-words">
                        {p.productName}
                      </p>
                      <p className="text-[12px] text-gray-500 mt-0.5">
                        {p.quantity} {p.unit} × {p.unitPrice.toLocaleString()}
                      </p>
                      {/* ဆိုင်က ဈေးနှုန်းပြင်ဆင်ထားပါက မူလဈေးနှုန်းကို မျဉ်းဖြတ်၍ ပြသခြင်း */}
                      {p.priceOverridden &&
                        p.originalUnitPrice != null &&
                        p.originalUnitPrice !== p.unitPrice && (
                          <p className="text-[12px] text-gray-400 line-through mt-0.5">
                            မူလဈေး {p.originalUnitPrice.toLocaleString()}
                          </p>
                        )}
                      {reduced && (
                        <p className="text-[12px] text-[#B45309] mt-0.5">
                          မူလ {p.originalQuantity} {originalUnit}
                        </p>
                      )}
                    </div>
                    <span className="text-[13px] font-bold text-[#1A1A1A] shrink-0">
                      {p.subtotal.toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <dl className="rounded-2xl bg-[#F8F9FA] p-3.5 space-y-2.5 text-[13px]">
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 shrink-0">ငွေချေမှု</dt>
              <dd className="text-right font-bold text-[#1A1A1A]">
                {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
                <span className="block text-[12px] font-normal text-gray-500">
                  {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
                </span>
              </dd>
            </div>
            {address && (
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500 shrink-0">ပို့ရမည့်လိပ်စာ</dt>
                <dd className="text-right text-[#1A1A1A] break-words min-w-0">{address}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </BottomSheet>
  );
}
