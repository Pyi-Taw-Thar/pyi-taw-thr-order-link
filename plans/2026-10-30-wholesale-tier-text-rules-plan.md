# Wholesale Tier Text စာသားစည်းမျဉ်းများ ပြင်ဆင်ခြင်း Implementation Plan

- **ရက်စွဲ**: 2026-10-30
- **Scope**: `ecommerce/src/pages/products/ProductRow.tsx`

---

## ၁။ ရည်ရွယ်ချက် (Objective)

Product List မျက်နှာပြင်တွင် Option 2 အတိုင်း unit တစ်ခုစီအတွက် wholesale tier စာသားများကို သတ်မှတ်ထားသော စာသားအတိအကျ (exact wording)၊ စာကြောင်းခွဲပုံစံနှင့် အရောင်များ (amber-700, green-700) ဖြင့် ပြသရန်။

---

## ၂။ သတ်မှတ်ထားသော စာသားစည်းမျဉ်းများ (Wording Rules)

- `q` = (ခြင်းထဲရှိ အရေအတွက်) + (stepper တွင် ရွေးထားသော အရေအတွက်)
- `current` = `minQty <= q` ဖြစ်သော အမြင့်ဆုံး tier
- `next` = `minQty > q` ဖြစ်သော အနိမ့်ဆုံး tier

### အခြေအနေများအလိုက် ပြသမည့် စာကြောင်းများ:
1. **Tier တစ်ခုမှ မရောက်သေးပါက (`current === null && next !== null`)**:
   - `amber-700`: `"{next.minQty} {unit}နဲ့အထက် {next.price}"`
   - `amber-700`: `"နောက် {next.minQty - q} {unit} ထပ်ယူရင် လက်ကားဈေး ရမယ်"`
2. **Tier တစ်ခု ရောက်ရှိပြီး နောက်ထပ် tier ကျန်ရှိသေးပါက (`current !== null && next !== null`)**:
   - `green-700`: `"✓ လက်ကားဈေး ရပြီ"`
   - `amber-700`: `"{next.minQty} {unit}နဲ့အထက် {next.price}"`
   - `amber-700`: `"နောက် {next.minQty - q} {unit} ထပ်ယူရင် {next.price} ဈေး ရမယ်"`
3. **နောက်ဆုံး tier သို့ ရောက်ရှိပြီးဖြစ်ပါက (`current !== null && next === null`)**:
   - `green-700`: `"✓ အကောင်းဆုံး လက်ကားဈေး ရပြီ"`
4. **Unit တွင် wholesale tier မရှိပါက**:
   - Tier စာသား လုံးဝ မပြပါ။
5. **ခြင်းထဲတွင် အဆိုပါ unit ရှိပြီးသားဖြစ်ပါက**:
   - `text-gray-500 text-xs`: `"(ခြင်းထဲ {n} {unit} ပါပြီး တွက်ထားသည်)"`

---

## ၃။ ပြင်ဆင်မည့် ဖိုင် (File to Modify)

- `ecommerce/src/pages/products/ProductRow.tsx` (③ Wholesale Tier စာသားအပိုင်း)

---

## ၄။ စစ်ဆေးအတည်ပြုမည့် နည်းလမ်းများ (Verification Steps)

1. `cd ecommerce && npm run build` ဖြင့် TypeScript build အောင်မြင်မှု ရှိမရှိ စစ်ဆေးခြင်း။
2. စမ်းသပ်ဒေတာ `{ဘူး, 5, 1400}`, `{ဘူး, 20, 1300}` ဖြင့် စာသားထွက်ပေါ်မှုကို စစ်ဆေးခြင်း:
   - `q = 2` → `"5 ဘူးနဲ့အထက် 1,400"` / `"နောက် 3 ဘူး ထပ်ယူရင် လက်ကားဈေး ရမယ်"`
   - `q = 5` → `"✓ လက်ကားဈေး ရပြီ"` / `"20 ဘူးနဲ့အထက် 1,300"` / `"နောက် 15 ဘူး ထပ်ယူရင် 1,300 ဈေး ရမယ်"`
   - `q = 20` → `"✓ အကောင်းဆုံး လက်ကားဈေး ရပြီ"`
