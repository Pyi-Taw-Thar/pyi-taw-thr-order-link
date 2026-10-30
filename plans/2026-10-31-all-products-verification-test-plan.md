# ပစ္စည်းအားလုံး Page — ပြန်လည်စစ်ဆေးရန် Test Plan (Verification only)

- **ရက်စွဲ:** 2026-10-31
- **အခြေအနေ:** ⏳ Antigravity စစ်ရန် စောင့်ဆဲ
- **မူလ plan:** `plans/2026-10-31-all-products-infinite-scroll-plan.md`
- **မူလ report:** `ecommerce/plans/All_Products_Infinite_Virtual_Report.md`
- **ရည်ရွယ်ချက်:** Report တွင် PASS ဟုရေးထားသော်လည်း အထောက်အထား မပါ / ကိုက်ညီမှု မရှိသော စစ်ချက်များကို **code မပြင်ဘဲ** ပြန်စစ်ရန်

## ၁. Report ကို code နှင့် တိုက်စစ်ချက် (Claude review)

| # | တွေ့ရှိချက် | အမျိုးအစား |
|---|---|---|
| R-1 | T-6 "505 ခုလုံး ဆွဲပြီးနောက်" ဟုဆိုသော်လည်း "bottom" ၏ `scrollY: 4382` ဖြစ်သည်။ Row ~88px × 505 ≈ 44,000px ဖြစ်၍ 4382 သည် row ~50 ခန့်တွင်သာ ရှိသည် → **အောက်ဆုံးကို မတိုင်းခဲ့** | အထောက်အထား မကိုက် |
| R-2 | Screenshot ၄ ပုံ (`screenshots/T-4_home.png` …) ကို repo ထဲတွင် **မတွေ့** (temp folder ဖျက်စဉ် ပါသွားနိုင်) | အထောက်အထား ပျောက် |
| R-3 | T-5, T-8 ~ T-16 — PASS ဟုသာ ရေး၍ output / screenshot / network log မပါ | အထောက်အထား မပါ |
| R-4 | `AllProducts.tsx` — `scrollMargin` ကို `useLayoutEffect(..., [])` ဖြင့် mount တွင် တစ်ကြိမ်သာ တိုင်းသည်။ ပထမအကြိမ် ဝင်လျှင် (cache မရှိ) `isLoading` ကြောင့် list `<div ref={listRef}>` **render မဖြစ်သေး** → `listRef.current = null` → **`scrollMargin` သည် 0 အမြဲ ဖြစ်နေနိုင်** | Bug ဖြစ်နိုင် (§2 V-1 ဖြင့် အတည်ပြုရန်) |
| R-5 | `useWindowVirtualizer` တွင် `getItemKey` မပါ → measurement cache ကို index ဖြင့် မှတ်သည်။ Sort ပြောင်းလျှင် ယခင် အစဉ်၏ row အမြင့်များ index အလိုက် ကျန်နိုင် | Bug ဖြစ်နိုင် (V-5) |
| R-6 | `handleBack` — `window.history.length > 1` သည် အခြား site မှ link ဖြင့် ဝင်လာလျှင်လည်း true ဖြစ်၍ `navigate(-1)` က site အပြင်သို့ ထွက်သွားနိုင် | Bug ဖြစ်နိုင် (V-7) |
| R-7 | ပထမ load error တွင် `error.message` (axios ၏ English "Network Error" စသည်) ကို customer ထံ တိုက်ရိုက်ပြ | UX (V-8) |
| R-9 | Report တွင် "`ecommerce/CLAUDE.md` Routing table တွင် `/all-products` ထည့်ပြီး" ဟုဆိုသော်လည်း Routing table တွင် **မပါ** (Architecture tree နှင့် Tech Stack တွင်သာ ပါ) | Report မမှန် (fix plan တွင် ထည့်မည်) |
| R-8 | `git status` တွင် ယခင် error-message plan ၏ ပြင်ဆင်မှုများ (`Cart.tsx`, `customError.js`, `error.controller.js`, `ecommerce.validation.js`) လည်း uncommitted ကျန်နေ | သတိပြုရန် (စစ်ရန် မလို) |

> Backend sort / collation နှင့် `productQueries.ts` (key သီးသန့်, `Array.isArray` guard) သည် plan အတိုင်း ဖြစ်သည် — code ဖြင့် အတည်ပြုပြီး

## ၂. ပြန်စစ်ရမည့် စစ်ချက်များ

**စည်းကမ်း**
- **Code မပြင်ရ** — FAIL တွေ့လျှင် မှတ်တမ်းသာ တင်
- ကိုယ်တိုင် run ထားသော output / screenshot သာ ထည့်
- မစစ်ရလျှင် "မစစ်ရသေး" ဟု ရေး

**ပတ်ဝန်းကျင်**
- Local MongoDB (port 27018, DB `infinitetest`) + demo ပစ္စည်း 505 ခု
- Temp backend (port 5055) + `npm run build` → `vite preview`
- Browser — Chrome DevTools / CDP (viewport 375×812 နှင့် 1280×800)
- Screenshot များကို `ecommerce/plans/screenshots/all-products/` တွင် သိမ်း (**မဖျက်ရ**)

| # | စစ်ချက် | လုပ်ပုံ | အထောက်အထား (မဖြစ်မနေ) | PASS လျှင် |
|---|---|---|---|---|
| V-1 | **scrollMargin (R-4)** | Cache ရှင်းပြီး (sessionStorage + reload) `/all-products` သို့ တိုက်ရိုက်ဝင်; ပထမ 20 ပေါ်ပြီး console တွင် `document.querySelector('[role="list"]').offsetTop` နှင့် ပထမ row ၏ `getBoundingClientRect().top + scrollY` ကို ထုတ်; virtualizer ၏ `scrollMargin` ကို React DevTools (သို့) ယာယီ `console.log` မသုံးဘဲ စစ်ရမည်ဖြစ်၍ — scroll 3000px ဆင်းပြီး viewport ထိပ်/အောက်တွင် **row မရှိသော ကွက်လပ်** ရှိ/မရှိ ကြည့်; ထို့နောက် detail ဝင်ပြီး back ပြန်လာ (cache ရှိ) တွင် တူ/မတူ နှိုင်းယှဉ် | offsetTop တန်ဖိုး + screenshot ၂ ပုံ (ပထမဝင် / back ပြီး) | ကွက်လပ်မရှိ၊ နှစ်ကြိမ်လုံး render ဖြစ်သော row အစ/အဆုံး index တူ |
| V-2 | **အောက်ဆုံးအထိ (R-1)** | အောက်သို့ ဆက်တိုက် scroll ဆွဲ၍ 505 ခုလုံး ဆွဲ | network log — `page=1` မှ `page=26` တစ်ခုစီ **တစ်ကြိမ်သာ** (request list ကူး); "ပစ္စည်းအားလုံး ပြပြီးပါပြီ" screenshot | page ၂၆ ခု၊ ထပ်ခေါ်မှု မရှိ |
| V-3 | **DOM row (R-1)** | V-2 ပြီးနောက် scrollY = 0 / ~22000 / အောက်ဆုံး (`document.documentElement.scrollHeight - innerHeight`) ၃ နေရာ | နေရာတိုင်း `{scrollY, domRowCount, firstIndex, lastIndex}` JSON (`[data-index]` မှ) | domRowCount ≤ 30; အောက်ဆုံးတွင် lastIndex = 504 |
| V-4 | Expand / collapse (T-7) | Row index ~3 နှင့် ~300 ကို expand → collapse | အောက် row ၏ `getBoundingClientRect().top` ကို မတိုင်မီ / expand / collapse ၃ ကြိမ် ထုတ်; screenshot | Expand row ၏ အောက်ခြေ = နောက် row ထိပ် − 12px (mobile pb-3); ထပ်/ကွက်လပ် မရှိ |
| V-5 | **Sort ပြောင်းပြီး အမြင့် (R-5)** | Row 5 ကို expand ထား → A→Z ကို Z→A ပြောင်း | Z→A ၏ index 0-10 row များ၏ `offsetHeight` နှင့် wrapper အကွာ; screenshot | ထပ်/ကွက်လပ် မရှိ; Z→A အစဉ် မှန် (ပထမ ၃ ခု နာမည်) |
| V-6 | Back scroll restore (T-11) | Row ~200 အထိ scroll → row တစ်ခု detail ဝင် → browser back | ဝင်မီ / back ပြီး `{scrollY, firstVisibleIndex}`; network log တွင် back ပြီး `/ecommerce/products?page=` request မရှိ; screenshot ၂ ပုံ | firstVisibleIndex ကွာ ≤ 1 |
| V-7 | **Back ခလုတ် (R-6)** | Tab အသစ်တွင် `about:blank` → `/all-products` URL ကို တိုက်ရိုက်ရိုက်ဝင် → page ၏ ← ခလုတ် နှိပ် | နောက်ဆုံး URL | Storefront `/` သို့ ရောက်ရမည် (`about:blank` သို့ မထွက်ရ) |
| V-8 | **ပထမ load error (R-7)** | Backend ရပ်ပြီး cache ရှင်း၍ `/all-products` ဝင် | Screenshot + ပြသော စာ အတိအကျ | မြန်မာစာ ဖြစ်ရမည် (English "Network Error" မဖြစ်ရ) |
| V-9 | နောက် page error (T-10) | Page 2 ရောက်ပြီး backend ရပ် → scroll ဆွဲ | network log (request အရေအတွက် — 30 စက္ကန့်စောင့်ပြီး); screenshot; backend ပြန်ဖွင့် → "ပြန်ကြိုးစားမယ်" | Request loop မဖြစ် (retry 1 ကြိမ်အထိသာ); page 1 row ကျန်; retry ပြီး ဆက်ဆွဲ |
| V-10 | Fallback ခလုတ် (T-9) | IntersectionObserver မဟုတ်၍ — scroll မဆွဲဘဲ "နောက်ထပ် ကြည့်မယ်" နှိပ် | network log | နောက် page တစ်ခုသာ |
| V-11 | Cart (T-13) | Row ~100 မှ ၂ ပုံး ထည့် → scroll ဖြင့် ကျော် → ပြန်လာ; Cart page ဖွင့် | badge screenshot (ပြန်လာပြီး); cart line (နာမည်/unit/qty/ဈေး) | badge မပျောက်; cart မှန် |
| V-12 | Brand list (T-14) | `/products?brand=…` — expand, A→Z/Z→A, cart ထည့် | screenshot | ယခင်အတိုင်း |
| V-13 | Banner (T-4) | Home → "အော်ဒါတင်မယ်" | URL + network | `/all-products`, page=1 တစ်ကြိမ် |
| V-14 | Responsive (T-15) | 375×812 နှင့် 1280×800 | screenshot ၂ ပုံ + `document.documentElement.scrollWidth <= innerWidth` | horizontal scroll မရှိ |
| V-15 | Console (T-16) | V-1 ~ V-14 တစ်လျှောက် | console log အပြည့် (warning ပါ) ကူး | error မရှိ; warning ရှိလျှင် အတိအကျ ကူး |

## ၃. Report

- ဖိုင်: `ecommerce/plans/All_Products_Verification_Report.md`
- ဇယား: V-1 ~ V-15 — `PASS` / `FAIL` / `မစစ်ရသေး` + အထောက်အထား link / output
- FAIL တစ်ခုချင်းအတွက် — ဖြစ်ပုံ (reproduce အဆင့်), မျှော်မှန်းချက် နှင့် ရလဒ် ကွာခြားချက်, သံသယရှိသော code line
- **Fix မလုပ်ရ** — Claude က FAIL များကို ကြည့်ပြီး fix plan သီးသန့် ရေးမည်
