# Product List A → Z Sorting ထည့်ရန် Plan

- **ရက်စွဲ:** 2026-10-27
- **အခြေအနေ:** ✅ ပြီး (2026-10-27) — typecheck / lint / build pass; demo product ၈ ခုဖြင့် 320px + 1280px browser စစ်ပြီး (A→Z ⇄ Z→A, အကြီးအသေး မခွဲ, B2 < B12, cart ထည့် အလုပ်လုပ်, horizontal scroll မရှိ); test DB ဖျက်ပြီး

## ၁. ရည်ရွယ်ချက်
Brand → Product list (`/products?brand=...`) တွင် ဆေးနာမည်ကို **A → Z** အစဉ်ဖြင့် ပြရန် — ရှာရလွယ်စေ

## ၂. လက်ရှိအခြေအနေ
- `pages/Products.tsx` က `GET /ecommerce/products` ကို `page` မပါဘဲ ခေါ်၍ brand ၏ product **အားလုံး** တစ်ကြိမ်တည်း ရ
- Backend aggregate (`ecommerce.controller.js` `getProducts`) တွင် `$sort` မရှိ → DB ထဲ ထည့်ခဲ့သည့် အစဉ်အတိုင်း (ကျပန်းနီးပါး) ပြ
- `pages/products/ProductList.tsx` က ရလာသည့် အစဉ်အတိုင်း render

## ၃. ချဉ်းကပ်ပုံ
Product အားလုံး client တွင် ရှိပြီးသား ဖြစ်၍ **frontend တွင်သာ sort** (backend မပြောင်း)

### UI
```
┌─────────────────────────────────┐
│ ← Brand (subCategory)           │
│   ဆေးဝါး 24 မျိုး     [ A → Z ⇅ ] │  ← count ဘေး ညာဘက်တွင် sort ခလုတ်
├─────────────────────────────────┤
│ Appeton Lysine                  │
│ Biogesic                        │
│ ...                             │
└─────────────────────────────────┘
```
- **Default = A → Z** (page ဖွင့်တာနဲ့ A-Z စီပြီးသား)
- ခလုတ်နှိပ်လျှင် **A → Z ⇄ Z → A** ပြောင်း (tap target ≥ 44px မြင့်, `aria-label` ပါ)

### Sort စည်းမျဉ်း
- `name.localeCompare(other, "en", { sensitivity: "base", numeric: true })`
  - အကြီး/အသေး မခွဲ (`biogesic` = `Biogesic`)
  - ဂဏန်းကို တန်ဖိုးအတိုင်း (`Vitamin B2` < `Vitamin B12`)
- ပစ္စည်းပြတ် product များလည်း A-Z အစဉ်ထဲတွင် ပါ (နေရာမရွှေ့)
- `useMemo` ဖြင့် sort (products / direction ပြောင်းမှသာ ပြန်စီ); မူလ `products` array ကို မပြင် (copy ပြီးမှ sort)

## ၄. ပြင်ဆင်မည့်ဖိုင်
| ဖိုင် | ပြောင်းလဲမှု |
|---|---|
| `src/pages/products/ProductList.tsx` | `sortDir` state (`"asc"` default), `sortedProducts` useMemo, count ဘေးတွင် sort ခလုတ်, `products.map` → `sortedProducts.map` |

> Backend / Search / Limited products **မပြောင်းပါ** (လိုအပ်လျှင် နောက်မှ ထပ်ထည့်နိုင်)

## ၅. စစ်ဆေးမည့်နည်း
1. `npm run typecheck` / lint (ProductList) / `build`
2. Demo data (အကြီး/အသေး ရော, ဂဏန်းပါ နာမည်, ပစ္စည်းပြတ် product) ဖြင့် browser —
   - ဖွင့်တာနဲ့ A → Z; ခလုတ်နှိပ် → Z → A → ပြန် A → Z
   - Expand / qty / cart ထည့် ယခုအတိုင်း အလုပ်လုပ်
   - 320px / 390px / desktop တွင် ခလုတ် မကျုံ့, horizontal scroll မရှိ
3. စစ်ပြီး test DB ဖျက်
