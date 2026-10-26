# မသုံးတော့သော Code / Package ရှင်းလင်းရန် Plan

- **ရက်စွဲ:** 2026-10-26
- **အခြေအနေ:** ✅ ပြီး (2026-10-26) — typecheck error 0, build အောင်မြင်

## ၁. ရည်ရွယ်ချက်
`npm run typecheck` error ၂ ခုကို ဖယ်ရှားပြီး မသုံးတော့သော ဖိုင်/package များကို ရှင်းရန်။

## ၂. စစ်ဆေးတွေ့ရှိချက် (`grep` ဖြင့် အတည်ပြုပြီး)

| အရာ | တွေ့ရှိချက် |
|---|---|
| `components/BrandSection.tsx:13` | `loading` state ကို set သာလုပ်ပြီး ဘယ်နေရာမှ မဖတ် (TS6133) |
| `components/Navbar.tsx:1` | `Menu` icon ကို import လုပ်ထားပြီး မသုံး (TS6133) |
| `pages/products/CategoryGrid.tsx` | ဘယ်ဖိုင်ကမှ import မလုပ် |
| `public/medicines.json` | `src/`, `index.html` တွင် reference လုံးဝမရှိ (static fallback data အဟောင်း) |
| `@supabase/supabase-js` | `import` လုံးဝမရှိ — `Navbar.tsx` ၏ comment ပိတ်ထားသော `<img>` URL တစ်ခုတွင်သာ "supabase" စာလုံးပါ |

> **မှတ်ချက်:** `BrandSection.tsx` component တစ်ခုလုံးကိုလည်း ဘယ်နေရာမှ import မလုပ်ပါ (Home က `SubCategorySection` ကို သုံးနေ)။ သို့သော် ဤဖိုင်တွင် commit မလုပ်ရသေးသော ပြင်ဆင်မှုများ ရှိနေ၍ နောက်ပိုင်း ပြန်သုံးရန် ရည်ရွယ်ထားနိုင်သဖြင့် **ဤ plan တွင် မဖျက်ပါ** — error ကိုသာ ပြင်မည်။

## ၃. ပြင်ဆင်မည့်အရာများ

| # | ဖိုင် | ပြောင်းလဲမှု |
|---|---|---|
| 1 | `src/components/BrandSection.tsx` | `loading` / `setLoading` state ဖယ် (UI တွင် မသုံး၍ behavior မပြောင်း) |
| 2 | `src/components/Navbar.tsx` | import ထဲမှ `Menu` ဖယ်; comment ပိတ်ထားသော Supabase logo `<img>` block ဖယ် |
| 3 | `src/pages/products/CategoryGrid.tsx` | ဖိုင်ဖျက် |
| 4 | `public/medicines.json` | ဖိုင်ဖျက် (git တွင် ရှိ၍ လိုအပ်လျှင် ပြန်ယူနိုင်) |
| 5 | `package.json`, `package-lock.json` | `npm uninstall @supabase/supabase-js` |
| 6 | `ecommerce/CLAUDE.md` | `medicines.json`, `CategoryGrid.tsx` ဖော်ပြချက်များ ဖယ် |

## ၄. စစ်ဆေးမည့်နည်း
1. `npm run typecheck` → **error 0**
2. `npm run build` → အောင်မြင်; `dist/` ထဲတွင် `medicines.json` မပါ
3. `grep -r supabase src package.json` → ရလဒ်မရှိ
4. Dev server ဖွင့်ပြီး Login screen နှင့် Navbar ပုံမှန်ပြ
