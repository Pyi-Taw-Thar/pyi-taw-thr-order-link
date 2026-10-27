import { Check, XCircle } from "lucide-react";

const STEPS = [
  { key: "pending", label: "မှာပြီး" },
  { key: "confirmed", label: "ဂိုဒေါင်" },
  { key: "shipped", label: "ပို့ဆောင်" },
  { key: "delivered", label: "ရောက်ရှိ" },
];

const HINTS: Record<string, string> = {
  pending: "ဆိုင်မှ အော်ဒါကို စစ်ဆေးနေပါသည်",
  confirmed: "ဂိုဒေါင်တွင် ပစ္စည်း ထုပ်ပိုးနေပါသည်",
  shipped: "ပစ္စည်း ပို့ဆောင်နေပါပြီ",
  delivered: "ပစ္စည်း ရောက်ရှိပြီးပါပြီ",
};

// Order ၏ အဆင့် ၄ ဆင့် (မှာပြီး → ဂိုဒေါင် → ပို့ဆောင် → ရောက်ရှိ); cancelled ဆိုလျှင် အနီ banner
export default function OrderStatusTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-100 p-3.5">
        <XCircle className="w-5 h-5 text-[#B91C1C] shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-bold text-[#B91C1C]">ပယ်ဖျက်ပြီး</p>
          <p className="text-[12px] text-red-700/80 mt-0.5">
            ဤအော်ဒါကို ပယ်ဖျက်ထားပါသည်
          </p>
        </div>
      </div>
    );
  }

  const current = Math.max(0, STEPS.findIndex((s) => s.key === status));
  const isFinished = status === "delivered";

  return (
    <div>
      <ol className="grid grid-cols-4" aria-label="အော်ဒါ အဆင့်">
        {STEPS.map((step, idx) => {
          const done = idx < current || (isFinished && idx === current);
          const active = idx === current && !isFinished;
          return (
            <li
              key={step.key}
              className="relative flex flex-col items-center"
              aria-current={active ? "step" : undefined}
            >
              {/* ဘယ်ဘက် step သို့ ဆက်သော line */}
              {idx > 0 && (
                <span
                  className={`absolute top-[13px] right-1/2 w-full h-[3px] -z-0 ${
                    idx <= current ? "bg-[#007FFF]" : "bg-gray-200"
                  }`}
                />
              )}
              <span
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-[3px] ${
                  done
                    ? "bg-[#007FFF] border-[#007FFF] text-white"
                    : active
                    ? "bg-white border-[#007FFF]"
                    : "bg-white border-gray-200"
                }`}
              >
                {done ? (
                  <Check className="w-3.5 h-3.5 stroke-[3.5px]" />
                ) : active ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#007FFF] motion-safe:animate-pulse" />
                ) : null}
              </span>
              <span
                className={`mt-1.5 text-[12px] text-center leading-tight ${
                  done || active ? "text-[#1A1A1A] font-bold" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
      {HINTS[status] && (
        <p className="mt-3 text-center text-[12px] text-gray-500">{HINTS[status]}</p>
      )}
    </div>
  );
}
