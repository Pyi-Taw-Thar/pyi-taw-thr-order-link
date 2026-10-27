# Product Row Layout ရှင်းလင်းရန် Plan

- **ရက်စွဲ:** 2026-10-27
- **အခြေအနေ:** ✅ ပြီး (2026-10-27) — 320 / 360 / 390px + desktop browser စစ်ပြီး; horizontal scroll မရှိ
- **ထပ်ပြင်:** 320px တွင် expand လုပ်ထားသော qty row ၏ "ဆေးယူမယ်" ခလုတ် ၃ ကြောင်းခွဲ → qty input သာ ကျုံ့၍ ခလုတ် `shrink-0 whitespace-nowrap`; `SearchHeader` placeholder ၂ ကြောင်းခွဲ → `truncate`; row ခလုတ်/pill `min-w` ကို 120px (md 156px) သို့ ညှိ (toggle လုပ်လည်း အရွယ်မပြောင်း)
- **နောက်ခံ:** User ၏ ဖုန်း screenshot (pyitawthar.com — Products / English)

## ၁. ပြဿနာ ၃ ခု

### 1. "ပစ္စည်းပြတ်" စာသား ၂ ခု ထပ်နေ
`pages/products/ProductRow.tsx` —
- ဆေးနာမည်ဘေး badge: **"ပစ္စည်းပြတ်နေပါသည်"** (line 58-62)
- ညာဘက် pill: **"ပစ္စည်းပြတ်နေသည်"** (line 77-80)
→ row တစ်ခုတည်းတွင် တူညီသော အချက် ၂ ကြိမ်ပြ၍ ရှုပ်

### 2. ဖုန်းအချို့တွင် ညာဘက်ခလုတ် သေး/အောက်ဆင်း
- Row = `flex items-center justify-between` — ဘယ်ဘက် (နာမည် + badge + chemical tags) တွင် `flex-1 min-w-0` မရှိ၊ ညာဘက်ခလုတ်တွင် `shrink-0` မရှိ
- ဆေးနာမည်ရှည် / tag များလျှင် ဘယ်ဘက်က နေရာယူ၍ ခလုတ်ကို ညှစ် → ခလုတ်စာ ကျုံ့/ကြောင်းခွဲ
- ခလုတ်စာ size `text-[8px]` (ဖုန်းတွင် အလွန်သေး)

### 3. ဆေးနာမည် မဆန့်လျှင် ကြောင်းမခွဲ
- နာမည် span သည် `inline-flex` ဖြစ်ပြီး badge များနှင့် တစ်တန်းတည်း → ရှည်လျှင် row အပြင်ကို တွန်း

## ၂. ပြင်ပုံ

```
┌──────────────────────────────────────────────┐
│ [ဘယ်: flex-1 min-w-0]          [ညာ: shrink-0]│
│ Silkron Cream ← ရှည်လျှင်       ┌──────────┐ │
│ အောက်ကြောင်း ဆင်း               │ပစ္စည်းပြတ်│ │  ← width/size fix
│ [Clotrimazole] [Betamethasone]  └──────────┘ │
│ [🛒 2]  (cart badge — နာမည်အောက်)              │
└──────────────────────────────────────────────┘
```

| အပိုင်း | ပြောင်းလဲမှု |
|---|---|
| Row | `items-center` → `items-start`, `gap-3` |
| ဘယ်ဘက် | `flex-1 min-w-0`; နာမည်ကို `inline-flex` မှ block `<h3>` ပြောင်း + `break-words` (မဆန့်လျှင် **ဆေးနာမည်သာ** အောက်ကြောင်းဆင်း) |
| နာမည်ဘေး "ပစ္စည်းပြတ်နေပါသည်" badge | **ဖယ်** — ညာဘက် status pill တစ်ခုတည်း ကျန် |
| Cart qty badge (🛒 2) | နာမည်ဘေးမှ chemical tags တန်းသို့ ရွှေ့ (နာမည် ကြောင်းခွဲမှု မထိခိုက်စေရန်) |
| ညာဘက် ခလုတ် / pill | `shrink-0` + `min-w-[104px] md:min-w-[140px]` + `justify-center` + `whitespace-nowrap`; စာ `text-[12px] md:text-[15px]` (`text-[8px]` ဖယ်) — **ခလုတ် size မပြောင်းတော့** |
| ပစ္စည်းပြတ် pill | ခလုတ်နှင့် အရွယ်တူ (`min-w` တူ) — "ပစ္စည်းပြတ်" (တိုတို) |
| Chemical tags | ယခုအတိုင်း `flex-wrap` |

## ၃. ပြင်ဆင်မည့်ဖိုင်
| ဖိုင် | |
|---|---|
| `src/pages/products/ProductRow.tsx` | အထက်ပါ layout |
| `src/pages/Search.tsx` (line ~232-285) | Search result row သည် ProductRow ကို မသုံးဘဲ တူညီသော code ကို ကူးထား၍ **တူညီအောင်** ပြင် (ဤနေရာတွင်လည်း စာသား ၂ ခု ထပ်နေ) |

> Logic (expand / variant / cart) မပြောင်းပါ — layout နှင့် စာသားသာ

## ၄. စစ်ဆေးမည့်နည်း
1. `npm run typecheck` / `npm run build`
2. Demo data (ဆေးနာမည်ရှည် + chemical tag ၃ ခု + ပစ္စည်းပြတ် product ပါ) ဖြင့် browser —
   - ဖုန်းအရွယ် **320px / 360px / 390px** နှင့် desktop
   - ခလုတ်/pill size တူညီ၊ မကျုံ့၊ အောက်မဆင်း
   - နာမည်ရှည်လျှင် နာမည်သာ ကြောင်းခွဲ
   - "ပစ္စည်းပြတ်" တစ်ကြိမ်သာ ပေါ်
   - Expand → variant ရွေး → cart ထည့် ယခုအတိုင်း အလုပ်လုပ်

## ၅. မှတ်ချက်
Screenshot ရှိ live site (pyitawthar.com) တွင် navbar ၌ logout ခလုတ် ပါနေသေး — ယခင် UI fix များ **deploy မလုပ်ရသေး** (commit မလုပ်ရသေး) ဖြစ်၍ ဤပြင်ဆင်မှုနှင့်အတူ deploy လုပ်ရန် လို
