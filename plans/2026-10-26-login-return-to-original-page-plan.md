# Login ဝင်ပြီးနောက် မူလ Page သို့ ပြန်ပို့ရန် Plan

- **ရက်စွဲ:** 2026-10-26
- **အခြေအနေ:** ✅ Implement ပြီး (2026-10-26) — URL ကျန်ခြင်း/401 flow ကို browser ဖြင့်စစ်ပြီး; login အောင်မြင်ပြီးနောက် redirect ကို account အစစ်ဖြင့် မစစ်ရသေး

## ၁. ရည်ရွယ်ချက်
Login မဝင်ရသေးသူက share လုပ်ထားသော link (ဥပမာ `/product/<id>`) ကို ဖွင့်လျှင် login ဝင်ပြီးနောက် **ထို page သို့ပင် ပြန်ရောက်စေရန်** (ယခု home သို့သာ ရောက်သည်)။

## ၂. လက်ရှိ Flow နှင့် ပြဿနာ
`App.tsx` သည် `isLoggedIn` မရှိလျှင် Router မပါဘဲ `<Login />` ကိုသာ render လုပ်သည်။ ထို့ကြောင့် **URL (`/product/<id>`) သည် browser address bar တွင် မပြောင်းဘဲ ကျန်နေသည်**။ သို့သော် —

| နေရာ | Code | ပြဿနာ |
|---|---|---|
| `pages/Login.tsx:24` | `window.location.href = "/"` | Login အောင်မြင်လျှင် မူလ URL ကို လွှင့်ပစ်ပြီး home သို့ ပို့သည် |
| `services/axios.ts:36` | `window.location.href = '/login'` | Token expire (401) ဖြစ်လျှင် မူလ URL ပျောက်ပြီး `/login` (router တွင်မရှိ → Home) သို့ ရောက်သည် |
| `pages/Cart.tsx:17` | `navigate('/login')` | Token မရှိလျှင် `/login` route မရှိ၍ Home သို့ ရောက်ပြီး Login screen ပင် မပြပါ |

## ၃. ချဉ်းကပ်ပုံ
URL သည် login screen ပြနေစဉ် မပြောင်းသောကြောင့် **redirect param / storage မလိုပါ** — login ပြီးလျှင် လက်ရှိ URL ကိုပင် reload လုပ်ရုံဖြင့် မူလ page သို့ ရောက်မည်။ Same-origin path သာဖြစ်၍ open-redirect အန္တရာယ်မရှိ။

## ၄. ပြင်ဆင်မည့်ဖိုင်များ

### `src/pages/Login.tsx`
```ts
// URL ကို မပြောင်းဘဲ login screen ပြထား၍ လက်ရှိ page ကို reload လုပ်ရုံဖြင့် မူလ page သို့ ရောက်မည်
// (axios interceptor အဟောင်းကြောင့် /login ပေါ်တွင်ရှိနေလျှင် home သို့)
const { pathname, search, hash } = window.location;
window.location.replace(pathname === "/login" ? "/" : pathname + search + hash);
```
`replace` သုံးသဖြင့် back နှိပ်လျှင် login screen သို့ ပြန်မရောက်။

### `src/services/axios.ts`
`window.location.href = '/login'` → `window.location.reload()`
- Auth key များ ဖျက်ပြီး reload လုပ်သဖြင့် App က Login ကို ပြမည်၊ URL မပျောက်။
- `user_info` ကိုလည်း ဖျက်ရန် `authService.logout()` ကို ပြန်သုံးမည် (ယခု key တချို့သာ ဖျက်နေ)။

### `src/pages/Cart.tsx`
Token မရှိလျှင် `navigate('/login')` → `authService.logout(); window.location.reload();`
- Login ပြီးနောက် `/cart` သို့ ပြန်ရောက်မည်။ Cart item များ (`localStorage`) မပျောက်။

## ၅. စစ်ဆေးမည့်နည်း
1. Logout → `/product/<id>` URL ကို tab အသစ်တွင်ဖွင့် → Login screen → login → **ထို product page** ပြ။
2. Logout → `/` ဖွင့် → login → Home။
3. `/login` URL ဖြင့် ဖွင့် → login → Home။
4. Query ပါ URL (`/products?brand=X`) → login → ထို filter ဖြင့် ပြန်ရောက်။
5. `access_token` ကို DevTools မှ မှားအောင်ပြင် → API call 401 → Login screen ပြ, URL မပြောင်း → login → မူလ page။
6. Login ပြီး Back နှိပ် → Login screen သို့ ပြန်မရောက်။
7. `npm run typecheck` / `lint` — error အသစ်မရှိ။
