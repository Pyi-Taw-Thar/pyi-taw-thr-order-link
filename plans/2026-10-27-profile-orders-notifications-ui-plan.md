# Profile / Order History / Notification UI ပြန်ဒီဇိုင်းရန် Plan (Mobile-first)

- **ရက်စွဲ:** 2026-10-27
- **အခြေအနေ:** ✅ ပြီး (2026-10-27) — typecheck / lint (ပြင်သောဖိုင်) / build pass; demo data ဖြင့် 320 / 360 / 375px + 1280px desktop browser စစ်ပြီး (horizontal scroll မရှိ; filter, load more, deep link, Esc/✕/overlay ပိတ် အလုပ်လုပ်); test DB ဖျက်ပြီး
- **အကောင်အထည်ဖော်စဉ် ညှိချက်:** `confirmed` label ကို "ထုပ်ပိုးဆဲ" ဟု တိုစေ (card တွင် နေရာမလုံ၍); project တွင် `tailwindcss-animate` မရှိ၍ sheet animation keyframe ကို `tailwind.config.js` တွင် ထည့်; note ရှေ့ ⚠️ ကို detail တွင် ဖယ် (icon ထပ်၍)
- **အသုံးပြုသူ:** ဖုန်းဖြင့် ဆေးမှာသော customer — အဓိက မေးခွန်း ၂ ခု: "**ငါ့ order ဘယ်ရောက်နေပြီလဲ**" / "**ဘာပြောင်းသွားလဲ**"

---

## ၁. လက်ရှိ ပြဿနာ (`pages/Profile.tsx`, `components/NotificationModal.tsx`)

| နေရာ | ပြဿနာ |
|---|---|
| Order card | ပစ္စည်း ၃ မျိုး + note အပြည့် + status ၃ မျိုး (edited/status/payment) ကို card ထဲတွင် အကုန်ပြ → card ရှည်၊ ဖတ်ရခက် |
| Order အသေးစိတ် | ကြည့်စရာ နေရာ မရှိ — ပစ္စည်း ၃ ခုကျော်လျှင် "+ နောက်ထပ် N မျိုး" သာ |
| Pagination | "ရှေ့ / နောက်" ခလုတ် — ဖုန်းတွင် အဆင်မပြေ |
| Status | Order ဘယ်အဆင့်ရောက်နေလဲ (စောင့်ဆိုင်း → ဂိုဒေါင် → ပို့ဆောင် → ရောက်ရှိ) မြင်ရ မလွယ် |
| Notification | Desktop-style center modal; အချိန် "Oct 27, 11:44" ပုံစံ; type အလိုက် ခွဲခြားမှု နည်း; နှိပ်လျှင် profile သို့သာ ရောက်၍ ထို order ကို ကိုယ်တိုင် ပြန်ရှာရ |
| Profile header | အချက်အလက် နည်းပြီး နေရာ အများကြီးယူ |

---

## ၂. Design Plan

App ၏ ရှိပြီးသား brand (ဆေးဆိုင်အပြာ, ChivoMono font) ကို **ဆက်ထား** — page ၃ ခုသာ ပြင်၍ brand အသစ် မထွင်ပါ။

### Color (ရှိပြီးသား token များမှ)
| Name | Hex | သုံးမည့်နေရာ |
|---|---|---|
| Primary | `#007FFF` | ခလုတ်, active step |
| Primary dark | `#014E9C` | စုစုပေါင်းငွေ, heading |
| Surface | `#F8F9FA` | page background |
| Ink | `#1A1A1A` | ဆေးနာမည် / စာ |
| Status: pending amber `#B45309` / shipped indigo `#4338CA` / delivered green `#15803D` / cancelled red `#B91C1C` | | status ကိုသာ အရောင်ဖြင့် ခွဲ |

### Type
ChivoMono (ရှိပြီးသား) တစ်မျိုးတည်း — scale **12 / 13 / 15 / 20**; ငွေ ပမာဏ 20 bold (card ၏ အဓိက အချက်)

### တစ်နေရာတည်းမှာ ထင်ရှားအောင် (memorable element)
**Order detail ၏ status timeline** — တကယ့် အဆင့်လိုက် လုပ်ငန်းစဉ် ဖြစ်၍ step ၄ ဆင့် (အမှတ်/အစက်) သုံးခြင်း သင့်တော်; ကျန်အပိုင်းများ တိတ်ဆိတ်ရှင်းလင်း

### Mobile pattern
- Modal အားလုံး — ဖုန်းတွင် **bottom sheet** (အောက်မှ ပေါ်, အပေါ်ထိပ် drag handle, အမြင့် 90vh, အတွင်း scroll), desktop တွင် center modal
- လက်ချောင်းဖြင့် နှိပ်ရ လွယ်ရန် — tap target ≥ 44px
- Animation — sheet ဖွင့်/ပိတ် တစ်ခုသာ (`prefers-reduced-motion` တွင် ဖယ်)

---

## ၃. Wireframes

### 3.1 Profile page
```
┌─────────────────────────────┐
│ ←  ကိုယ်ရေးအချက်အလက်          │
├─────────────────────────────┤
│ (TC)  test customer          │  ← အမည်၏ ပထမစာလုံး avatar
│       09222222222            │
│       📍 လိပ်စာ (ရှိလျှင်)      │
├─────────────────────────────┤
│ မှာယူမှုမှတ်တမ်း        (5)    │
│ [ အားလုံး | လုပ်ဆောင်ဆဲ | ပြီးဆုံး ] │  ← status filter tab (client-side)
│ ┌ order card ┐               │
│ ┌ order card ┐               │
│ [ နောက်ထပ် ကြည့်မယ် ]           │  ← load more (pagination အစား)
├─────────────────────────────┤
│ [ ထွက်မယ် (Logout) ]           │
└─────────────────────────────┘
```

### 3.2 Order card (ရှင်းလင်း — အသေးစိတ်မပါ)
```
┌─────────────────────────────┐
│▌ Oramin-G နှင့် အခြား ၂ မျိုး  ● ပို့ဆောင်ဆဲ │  ← ပထမ ပစ္စည်း + အရေအတွက် (card ၏ ခေါင်းစဉ်)
│▌ 27 Oct 2026, 11:44 AM       │  ← ဘယ်ဘက် အရောင်ဘား = status
│▌ ⚠ ပြင်ဆင်ထားသည်     63,000 Ks ›│  ← edited ဆိုမှသာ; ငွေ အကြီး
└─────────────────────────────┘
```
- **Order number ကို card မှ ဖယ်** (user တောင်းဆိုချက်) — order detail sheet ၏ header တွင်သာ ပြ
- Card တစ်ခုလုံး နှိပ်လို့ရ → **Order detail sheet**
- ငွေချေမှု status (paid/unpaid) ကို card မှ ဖယ်ပြီး detail တွင်သာ

### 3.3 Order detail sheet (အသစ် — `components/OrderDetailSheet.tsx`)
```
┌─────────────────────────────┐
│           ───               │  ← drag handle
│ ECO-2026-10-27-000012    ✕   │
│ 27 Oct 2026, 11:44 AM        │
├─────────────────────────────┤
│ ●━━━●━━━◉━━━○                │  ← status timeline
│ မှာပြီး ဂိုဒေါင် ပို့ဆောင် ရောက်ရှိ  │
│ (cancelled ဆိုလျှင် အနီ banner "ပယ်ဖျက်ပြီး") │
├─────────────────────────────┤
│ ⚠ ပြင်ဆင်ချက် / မှတ်ချက်          │  ← note ရှိမှ (amber box)
├─────────────────────────────┤
│ ပစ္စည်း (3)                     │
│ [💊] Oramin-G                 │
│      2 ပုံး × 31,500  63,000  │
│      (မူလ 3 ပုံး)  ← ပြင်ထားလျှင် │
│ [💊] …                        │
├─────────────────────────────┤
│ ငွေချေမှု      ငွေမချေရသေး      │
│ ပို့ရမည့်လိပ်စာ   …               │
│ ─────────────────────────── │
│ စုစုပေါင်း          94,500 Ks   │
└─────────────────────────────┘
```
- ပစ္စည်းပုံ ရှိလျှင် thumbnail, မရှိလျှင် Pill icon (ProductDetail အတိုင်း)
- Data — list response ထဲရှိပြီးသား (`products`, `note`, `shippingAddress`, `paymentStatus`); notification မှ ဝင်လာလျှင် `GET /ecommerce/orders/:id` (ရှိပြီးသား API) ဖြင့် ယူ

### 3.4 Notification sheet (`components/NotificationModal.tsx` ပြန်ရေး)
```
┌─────────────────────────────┐
│           ───               │
│ အသိပေးချက်များ   [အားလုံးဖတ်ပြီး] ✕│
├─────────────────────────────┤
│ ယနေ့                          │  ← ရက်အလိုက် အုပ်စု (ယနေ့ / မနေ့က / ယခင်)
│ ● [✎] အော်ဒါ #…012 ကို ပြင်ဆင်… │  ← unread = အစက် + အနည်းငယ် မှောင်သော bg
│       ပစ္စည်းအချို့ … 2 စာကြောင်း  │
│       ၅ မိနစ်က        အော်ဒါကြည့်မယ်│
│   [✕] အော်ဒါ #…009 ပယ်ဖျက်…     │  ← type icon: order_edited ✎ amber,
│ မနေ့က                          │     order_status (cancel) ✕ red / (other) 🚚 blue
└─────────────────────────────┘
```
- အချိန် — relative ("ယခုလေးတင်", "၅ မိနစ်က", "၂ နာရီက", "မနေ့က", ထို့ထက်ကြာလျှင် ရက်စွဲ)
- Notification နှိပ် → ဖတ်ပြီးမှတ် → `/profile?order=<orderId>` သို့ သွားပြီး **ထို order ၏ detail sheet ကို တန်းဖွင့်**
- Empty state — "အသိပေးချက် မရှိသေးပါ — အော်ဒါ အခြေအနေ ပြောင်းလျှင် ဤနေရာတွင် ပြပါမည်"

---

## ၄. ပြင်ဆင်မည့်ဖိုင်များ

| ဖိုင် | ပြောင်းလဲမှု |
|---|---|
| `src/components/BottomSheet.tsx` *(အသစ်)* | ဖုန်း = bottom sheet / desktop = center modal; overlay နှိပ်/Esc ပိတ်; body scroll lock; `role="dialog"` + focus |
| `src/components/OrderDetailSheet.tsx` *(အသစ်)* | §3.3 |
| `src/components/OrderStatusTimeline.tsx` *(အသစ်)* | status ၄ ဆင့် + cancelled |
| `src/utils/orderStatus.ts` *(အသစ်)* | status/payment label, အရောင်, relative time helper (Profile + Notification မျှသုံး) |
| `src/pages/Profile.tsx` | §3.1, §3.2 — card ရှင်း, filter tab, load more, `?order=` query ဖြင့် sheet ဖွင့် |
| `src/components/NotificationModal.tsx` | §3.4 — BottomSheet သုံး, ရက်အုပ်စု, relative time, deep link |

> Backend **မပြောင်းပါ** — `GET /ecommerce/orders`, `GET /ecommerce/orders/:id`, notification API ရှိပြီးသား

## ၅. စစ်ဆေးမည့်နည်း
1. `npm run typecheck` / `lint` (ပြင်သောဖိုင်) / `build`
2. Demo data (status ၅ မျိုးလုံး, ပြင်ဆင်ထားသော order, ပစ္စည်း ၅ မျိုးပါ order, notification ၃ မျိုး) ဖြင့် **320 / 360 / 390px** + desktop
   - Card တွင် အသေးစိတ် မပါ, နှိပ်လျှင် sheet ပွင့်, timeline မှန်
   - Notification နှိပ် → profile သို့ ရောက်ပြီး ထို order sheet ပွင့်
   - Load more, filter tab
   - Sheet — overlay/✕/Esc ဖြင့် ပိတ်, အတွင်း scroll, horizontal scroll မရှိ
3. စစ်ပြီး test DB ဖျက်
