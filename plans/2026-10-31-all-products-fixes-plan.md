# ပစ္စည်းအားလုံး Page — Verification FAIL များ ပြင်ရန် Plan

- **ရက်စွဲ:** 2026-10-31
- **အခြေအနေ:** ⏳ User အတည်ပြုချက် / Antigravity စောင့်ဆဲ
- **App:** ecommerce သာ
- **အခြေခံ:** `ecommerce/plans/All_Products_Verification_Report.md` (V-1 ~ V-15)

## ၁. Report ကို Claude ပြန်စစ်ချက်

| V | Report | Claude ၏ သုံးသပ်ချက် | လုပ်မည် |
|---|---|---|---|
| V-1 | FAIL — `scrollMargin` 0 | **မှန်** — code အရ ပထမဝင်ချိန် list `div` မရှိသေး၍ ref null။ (သို့သော် report ၏ `translateY(0px)` သည် margin မှန်လည်း 0 ဖြစ်မည်ဖြစ်၍ အထောက်အထား မဟုတ်; code ကြောင့် အတည်ပြု) | F-1 |
| V-2 | FAIL — page 4~26 ၂ ကြိမ်စီ | **မှန်** — အကြောင်းရင်း: TanStack Query v5 ၏ `fetchNextPage()` default `cancelRefetch: true` ကြောင့် ဆွဲနေဆဲ ထပ်ခေါ်လျှင် ယခင် request ကို cancel ပြီး အသစ်ထပ်ပို့ → network တွင် ၂ ကြိမ် | F-2 |
| V-6 | FAIL — back ပြီး scrollY 0 | **မအတည်ပြုနိုင်** — (က) report က "ScrollToTop သည် POP တွင်လည်း `scrollTo(0,0)`" ဟုဆိုသော်လည်း `ScrollToTop.tsx` သည် POP တွင် သိမ်းထားသော နေရာသို့ **ပြန်ထား** (`scrollTo(0,0)` သည် pathname ပြောင်း၍ PUSH ဖြစ်မှသာ); (ခ) `V-6_after_back.png` သည် test မစမီ 01:02 တွင် ရိုက်ထားသော `test_live.png` နှင့် **file အတူတူ (md5 တူ)** | F-3 (ပြန်စစ် → လိုမှ ပြင်) |
| V-7 | FAIL — `about:blank` သို့ ထွက် | **မှန်** | F-4 |
| V-8 | FAIL — "Network Error" | **မှန်** | F-5 |
| V-10 | FAIL — ခလုတ်က page 3 ခေါ် | **Bug မဟုတ်** — ပထမ 20 ခုတွင် row 18 ခု (မြင်ရ + overscan) render ဖြစ်၍ "၅ ခုကျန်" ကြိုဆွဲ စည်းကမ်းအတိုင်း page 2 ကို အလိုအလျောက် ဆွဲပြီးဖြစ်သည်; ခလုတ်က "နောက် page" (3) ကို ခေါ်ခြင်း မှန်သည်။ Test ၏ မျှော်မှန်းချက် မှားသည် | မပြင် |
| V-11 | PASS | `V-11_cart_badge.png` နှင့် `V-14_mobile_375.png` file **အတူတူ** (md5 တူ) — badge "1" မြင်ရ၍ လက်ခံ; ပြန်ရိုက်ရန် | F-7 |
| R-9 | (report တွင် မပါ) | `ecommerce/CLAUDE.md` Routing table တွင် `/all-products` မပါသေး | F-6 |
| R-5 | V-5 PASS | `getItemKey` မပါသော်လည်း ResizeObserver က ပြန်တိုင်း၍ ပြဿနာ မတွေ့ — **မပြင်** | — |

## ၂. ပြင်ပုံ (`ecommerce/src/pages/AllProducts.tsx` + `ecommerce/CLAUDE.md` သာ)

### F-1 scrollMargin (V-1)
- `useLayoutEffect(..., [])` ကို `[hasList]` (`const hasList = allProducts.length > 0`) dependency ဖြင့် ပြောင်း — list စ render ဖြစ်သည့် commit တွင် `listRef.current.offsetTop` ကို တိုင်း
- `window` `resize` တွင်လည်း ပြန်တိုင်း (header အမြင့် breakpoint အလိုက် ပြောင်း၍) — cleanup ဖြင့် listener ဖယ်
- တန်ဖိုး မပြောင်းလျှင် `setScrollMargin` မခေါ် (re-render မဖြစ်စေရန်)

### F-2 Duplicate fetch (V-2)
- Auto trigger နှင့် fallback ခလုတ် နှစ်ခုလုံးတွင် `fetchNextPage({ cancelRefetch: false })` — ဆွဲနေဆဲ ထပ်ခေါ်လျှင် လက်ရှိ request ကိုသာ ပြန်သုံး (ထပ်မပို့)
- Effect dependency ကို `virtualItems` array အစား `lastIndex` (number) သို့ ပြောင်း — scroll frame တိုင်း effect မ run စေရန်
  - `const lastIndex = virtualItems.length ? virtualItems[virtualItems.length - 1].index : -1`
- "ပြန်ကြိုးစားမယ်" ခလုတ်သည် `fetchNextPage()` (ယခုအတိုင်း) — error ပြီးမှ နှိပ်၍ cancel ပြဿနာ မရှိ

### F-3 Back scroll restore (V-6) — **ပြန်စစ်ပြီးမှ ဆုံးဖြတ်**
1. အရင် ပြန်စစ် (code မပြင်မီ):
   - Row ~190 အထိ **wheel / `window.scrollTo`** ဖြင့် ဆင်း → ပစ္စည်းနာမည်ကို **တကယ် click** (`Page.navigate` / URL ရိုက်ဝင်ခြင်း **မလုပ်ရ** — full reload ဖြစ်၍ cache ပျောက်) → `history.back()` (သို့) browser back
   - Back ပြီး 1.5 စက္ကန့် စောင့်ပြီး `{ scrollY, firstVisibleIndex, sessionStorage["scroll_positions_v1"] }` ထုတ်
   - Network log — back ပြီး `/ecommerce/products?page=` request ရှိ/မရှိ
2. ရလဒ်:
   - firstVisibleIndex ကွာ ≤ 1 → **PASS, code မပြင်**
   - FAIL → **code မပြင်ဘဲ ရပ်**; အထက်ပါ output + DevTools Performance မှ ဘယ်သူက `scrollTo` ခေါ်သလဲ (`window.scrollTo` ကို ယာယီ wrap လုပ်၍ stack trace ထုတ် — test script ထဲတွင်သာ, source code မထိ) ကို report တွင် ထည့်; Claude က သီးသန့် ဆုံးဖြတ်မည်
- `ScrollToTop.tsx` **မပြင်ရ**

### F-4 Back ခလုတ် (V-7)
- `useLocation()` ၏ `location.key === "default"` (app ထဲ ပထမ entry — အပြင်မှ တိုက်ရိုက်ဝင်) → `navigate("/")`; မဟုတ်လျှင် `navigate(-1)`
- `window.history.length` မသုံးရ

### F-5 ပထမ load error စာ (V-8)
- `error.message` ကို **မပြ** — အမြဲ `ပစ္စည်းများ ရယူ၍ မရပါ။ အင်တာနက် ချိတ်ဆက်မှုကို စစ်ပြီး ပြန်ကြိုးစားပါ။`
- `error` variable မသုံးတော့လျှင် destructure မှ ဖယ် (lint/typecheck)

### F-6 CLAUDE.md (R-9)
- Routing table တွင် `| /all-products | AllProducts | ပစ္စည်းအားလုံး — infinite scroll + virtualization |` ကို `/products` အောက်တွင် ထည့်
- Navigation Flow တွင် `Home → HeroBanner "အော်ဒါတင်မယ်" → /all-products` ထည့်

### F-7 Evidence သန့်ရှင်းရေး
- `ecommerce/plans/screenshots/all-products/` ထဲမှ scratch ဖိုင် `test.png`, `cdp_test.png`, `test_live.png` ကို ဖျက် (Antigravity ကိုယ်တိုင် ဖန်တီးထားသော ဖိုင်များ)
- စစ်ချက်တစ်ခုချင်း screenshot ကို **ထိုအချိန် အသစ်ရိုက်** — ဖိုင်ကူး / အခြား test ၏ ပုံ ပြန်သုံး မလုပ်ရ

> `ProductRow.tsx`, `ScrollToTop.tsx`, `productQueries.ts`, backend — **မပြင်ရ**; dependency အသစ် မထည့်

## ၃. စစ်ဆေးမည့်နည်း (ယခင် ပတ်ဝန်းကျင်: local MongoDB 27018 `infinitetest`, 505 ခု, backend 5055, `vite preview`)

| # | စစ်ချက် | PASS လျှင် | အထောက်အထား |
|---|---|---|---|
| X-1 | Cold load (cache + sessionStorage ရှင်း) `/all-products` → React state မှ မဟုတ်ဘဲ: scroll 3000px ဆင်း၍ `[data-index]` ၏ min/max index နှင့် viewport အတွင်း ပထမ/နောက်ဆုံး မြင်ရ row index | rendered range သည် မြင်ရ range ကို အပေါ်/အောက် overscan အညီအမျှ (±1) ဖုံး; F-1 မတိုင်မီ/ပြီး နှိုင်းယှဉ် | JSON ၂ ခု |
| X-2 | 505 ခုလုံး အောက်ဆုံးအထိ scroll | `page=1..26` တစ်ခုစီ **1 ကြိမ်** (စုစုပေါင်း 26) | page အလိုက် count JSON |
| X-3 | ဆွဲနေစဉ် fallback ခလုတ်ကို အမြန် ၃ ကြိမ် နှိပ် | page တစ်ခုသာ ထပ်တိုး | network log |
| X-4 | F-3 ပြန်စစ် (§2 F-3 အတိုင်း) | ကွာ ≤ 1 (FAIL လျှင် ရပ်ပြီး report) | JSON + screenshot ၂ ပုံ (အသစ်) |
| X-5 | `about:blank` → `/all-products` တိုက်ရိုက် → ← | `/` | URL |
| X-6 | Home → banner → `/all-products` → ← | `/` (history back) | URL |
| X-7 | Backend ရပ် + cold load | မြန်မာစာ (F-5) | screenshot |
| X-8 | V-3, V-4, V-5, V-9, V-11, V-12 ပြန် run (regression) | ယခင်အတိုင်း PASS | JSON / screenshot အသစ် |
| X-9 | `npm run typecheck`, `npm run build` | pass | output ကူး |
| X-10 | Screenshot md5 | ဖိုင်တိုင်း md5 မတူ | `md5sum` output |
