# Ecommerce UI ပြင်ဆင်ရန် Plan (UI review တွေ့ရှိချက် ၁၀ ခု)

- **ရက်စွဲ:** 2026-10-27
- **အခြေအနေ:** ✅ ပြီး (2026-10-27) — typecheck / build pass; demo data ဖြင့် mobile + desktop browser စစ်ပြီး (test DB ဖျက်ပြီး)
- **#4 About:** `GET /shop-settings` (public) မှ ဆိုင်အမည် / ဖုန်း / လိပ်စာ / email / Facebook / ဖွင့်ချိန် ယူ — မသတ်မှတ်ရသေးသော အချက်များကို မပြ
- **စစ်ဆေးရာတွင် တွေ့ရှိချက်:** `vite.config.ts` ၏ `optimizeDeps.exclude: ['lucide-react']` ကြောင့် dev mode တွင် icon module ၁,၅၀၀ ကျော် သီးခြား load ဖြစ်၍ browser `ERR_INSUFFICIENT_RESOURCES` ဖြစ် (production build တွင် မဖြစ်) — ဤ plan တွင် မပြင်
- **နောက်ခံ:** Demo data ဖြင့် mobile (390px) + desktop တွင် page အားလုံး စစ်ဆေးချက် (2026-10-27)

---

## 🔴 အရေးကြီး

### 1. ပုံမရှိသော product တိုင်းတွင် Paracetamol ပုံ ပြနေခြင်း
- **နေရာ:** `pages/ProductDetail.tsx:17, 167` — `src={product.images?.[0]?.url || paracetamolImg}`
- **ပြဿနာ:** Appeton Lysine ကဲ့သို့ ဆေးတိုင်းတွင် "PARACETAMOL 650mg" ဘူးပုံ ပေါ် — customer ကို မှားစေနိုင်
- **ပြင်ပုံ:** ပုံမရှိလျှင် ယေဘုယျ placeholder (`lucide-react` ၏ `Pill` icon + "ပုံ မရှိသေးပါ" စာ, `bg-gray-50`) ပြ; `paracetamol.png` import ဖယ် (ဖိုင်ကို `assets/` မှ ဖျက်)

### 2. Limited products တွင် စျေးနှုန်းနှင့် unit မတွဲပြ / ဝယ်ယူခွင့် အရေအတွက် မပြ
- **နေရာ:** `components/ProductCard.tsx`, `pages/LimitedProducts.tsx`, `components/LimitedSaleSection.tsx`, `utils/mapProduct.ts`, `pages/products/types.ts`
- **ပြဿနာ:**
  - `LimitedProducts` — "45,500 MMK" (ပုံးစျေး) ဟု unit မပါ
  - Home `LimitedSaleSection` — `showPrice` မပေး၍ စျေးလုံးဝ မပြ
  - တစ်ယောက်လျှင် ဝယ်ခွင့် (`ecommerceMaxPerUser`) — API က ပြန်ပေးသော်လည်း mapping မလုပ်၍ ဘယ်နေရာမှ မပြ
- **ပြင်ပုံ:**
  - `ProductCard` တွင် `unit` prop ထည့် → "45,500 MMK / ပုံး"
  - `LimitedSaleSection` တွင် `showPrice` ထည့်
  - `mapApiProduct` တွင် `maxPerUser` (`ecommerceMaxPerUser`, base unit) နှင့် `baseUnit` ထည့်
  - Badge "အကန့်သတ်ဖြင့်သာ" ဘေး / ProductDetail တွင် — "တစ်ယောက်လျှင် အများဆုံး **N ဘူး**" (base unit ဖြင့်; customer tier multiplier မပါ — အခြေခံ ကန့်သတ်ချက်သာ)

### 3. Logout ခလုတ် navbar တွင် bell ဘေး၌ ပထမဆုံး
- **နေရာ:** `components/Navbar.tsx:57-62` (+ mobile menu `:134`), `pages/Profile.tsx`
- **ပြဿနာ:** Mobile တွင် notification နှိပ်ရင်း logout မှား နှိပ်လွယ် (review အတွင်း တကယ် မှားနှိပ်မိ)
- **ပြင်ပုံ:**
  - Navbar မှ logout ခလုတ် ဖယ် (icon ၃ ခုသာ — bell / profile / cart)
  - `Profile` page အောက်ဆုံးတွင် "ထွက်မယ် (Logout)" ခလုတ် (အနီ outline, `LogoutModal` ပြန်သုံး)
  - Navbar ၏ အသုံးမပြု mobile menu (`isMenuOpen` ဖွင့်မည့် ခလုတ်မရှိ) ကိုပါ ဖယ်

### 4. About page placeholder
- **နေရာ:** `pages/About.tsx`
- **ပြဿနာ:** "About Us / Information about the pharmacy" — English placeholder သာ
- **ပြင်ပုံ:** မြန်မာဖြင့် ဆိုင်အကြောင်း page — logo, ဆိုင်အမည် (ပြည်တော်သာ), ဝန်ဆောင်မှု ၃ ချက် (ဆေးဝါး မှန်ကန်မှု / အမြန်ပို့ဆောင် / တိုက်ရိုက်ဆက်သွယ်), ဆက်သွယ်ရန် section
  - ⚠️ **ဖုန်း/လိပ်စာ/ဖွင့်ချိန် ကို ကျွန်တော် မသိ၍** — backend `GET /shop-settings` (dashboard Settings တွင် သတ်မှတ်ထားသော shop info) ကို public ခေါ်၍ရလျှင် ထိုမှ ယူမည်; မရလျှင် placeholder စာသား ထားပြီး user ထံ မေးမည်

---

## 🟡 သေး သော်လည်း ပြင်သင့်

### 5. Cart စုစုပေါင်းရှေ့ dash / line subtotal မပါ
- **နေရာ:** `pages/Cart.tsx:139` (`<span>-</span>`), item card
- **ပြင်ပုံ:** dash ဖယ်; item တစ်ခုချင်းတွင် "2 × 31,500 = **63,000 MMK**" subtotal ထည့်; unit စျေးဘေးတွင် "/ ပုံး" ပြ

### 6. Product list ဖြန့်လျှင် qty default 0
- **နေရာ:** `pages/products/ProductList.tsx:33, 54, 73, 135`
- **ပြင်ပုံ:** ဖြန့်ချိန် qty default **1** (cart ထဲ ရှိပြီးသားဆိုလျှင် cart qty); `Math.max(0, …)` → `Math.max(1, …)` — ProductDetail နှင့် တူညီ

### 7. Card များ screen အစွန်းထိ ကပ်
- **နေရာ:** `pages/products/ProductList.tsx:94-97`, `pages/LimitedProducts.tsx:62, 130`
- **ပြင်ပုံ:** list wrapper တွင် `px-4` ထည့် (Brand grid / Cart page အတိုင်း)

### 8. English စာသား ရော
- **နေရာ:** `pages/Profile.tsx:177, 194, 296, 301`; `pages/ProductDetail.tsx:203, 214, 226` (uppercase Brand / Category / Chemical names)
- **ပြင်ပုံ:**
  | English | မြန်မာ |
  |---|---|
  | Profile | ကိုယ်ရေးအချက်အလက် |
  | Member since … | … မှ စတင် အသုံးပြုသူ |
  | pending / confirmed / shipped / delivered / cancelled | စောင့်ဆိုင်းဆဲ / အတည်ပြုပြီး / ပို့ဆောင်ဆဲ / ရောက်ရှိပြီး / ပယ်ဖျက်ပြီး |
  | paid / unpaid | ငွေချေပြီး / ငွေမချေရသေး |
  | BRAND / CATEGORY | အမှတ်တံဆိပ် / အမျိုးအစား |
  - "Out of Stock" (ProductDetail:193) → "ပစ္စည်းပြတ်" တစ်ခုတည်း (မြန်မာ စာသား ဘေးတွင် ရှိပြီးသား ဖြစ်၍ English ကို ဖယ်)

### 9. Home တွင် search bar မပါ
- **နေရာ:** `pages/Home.tsx`, `components/SearchHeader.tsx` (ရှိပြီးသား; `/search` သို့ ပို့)
- **ပြင်ပုံ:** HeroBanner အပေါ်တွင် `<SearchHeader />` ထည့်

### 10. Desktop တွင် product list screen အပြည့် ဆန့်
- **နေရာ:** `pages/products/ProductList.tsx:94`, `pages/Search.tsx`
- **ပြင်ပုံ:** list ကို `max-w-3xl mx-auto` ဖြင့် ကန့် (Cart `max-w-2xl`, ProductDetail `max-w-2xl` နှင့် ကိုက်)

---

## ၃. ပြင်ဆင်မည့်ဖိုင်များ (စုစုပေါင်း)
| ဖိုင် | အချက် |
|---|---|
| `pages/ProductDetail.tsx` | 1, 2, 8 |
| `components/ProductCard.tsx` | 2 |
| `components/LimitedSaleSection.tsx` | 2 |
| `pages/LimitedProducts.tsx` | 2, 7 |
| `utils/mapProduct.ts`, `pages/products/types.ts` | 2 |
| `components/Navbar.tsx` | 3 |
| `pages/Profile.tsx` | 3, 8 |
| `pages/About.tsx` | 4 |
| `pages/Cart.tsx` | 5 |
| `pages/products/ProductList.tsx` | 6, 7, 10 |
| `pages/Search.tsx` | 10 |
| `pages/Home.tsx` | 9 |
| `assets/images/products/paracetamol.png` | 1 (ဖျက်) |

> Backend မပြောင်းပါ (#4 ၏ shop info သည် ရှိပြီးသား API ကို သုံးနိုင်မှသာ)

## ၄. စစ်ဆေးမည့်နည်း
1. `npm run typecheck`, `npm run lint` (ပြင်သောဖိုင်), `npm run build`
2. ယခင် UI review အတိုင်း — သီးခြား `uomtest` DB + demo data ဖြင့် mobile (390px) + desktop screenshot ပြန်ရိုက်ပြီး အချက် ၁၀ ခု တစ်ခုချင်း before/after စစ်
3. Order တင်ခြင်း flow (cart → order → profile) ယခင်အတိုင်း အလုပ်လုပ်ကြောင်း
4. စစ်ပြီး test DB ဖျက်
