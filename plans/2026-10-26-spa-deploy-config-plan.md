# Ecommerce SPA Deploy Config Plan (Netlify / Cloudflare Pages)

- **ရက်စွဲ:** 2026-10-26
- **အခြေအနေ:** ✅ ဖိုင် ၄ ခု ထည့်ပြီး build စစ်ပြီး (2026-10-26) — host ပေါ်တွင် deploy ပြီး မစစ်ရသေး

## ၁. ရည်ရွယ်ချက်
Netlify သို့မဟုတ် Cloudflare Pages တွင် deploy လုပ်ပြီးနောက် `/product/:id`, `/cart`, `/profile` စသည့် route များကို refresh / link တိုက်ရိုက်ဖွင့်လျှင် 404 မဖြစ်စေရန်။

## ၂. ပြဿနာ
React Router (`BrowserRouter`) သုံးသော SPA ဖြစ်သဖြင့် `/cart` ဆိုသော ဖိုင် server ပေါ်တွင် မရှိပါ။ Host က `index.html` ကို ပြန်မပေးလျှင် 404 ဖြစ်သည်။ ယခု ecommerce တွင် deploy config ဖိုင် လုံးဝမရှိပါ။

## ၃. ချဉ်းကပ်ပုံ — ဖိုင်တစ်ခုတည်းဖြင့် host နှစ်ခုလုံး
`public/_redirects` ကို Netlify ရော Cloudflare Pages ပါ နားလည်သည်။ Vite က `public/` ထဲရှိဖိုင်များကို `dist/` သို့ ကူးပေးသည်။

| Host | အပြုအမူ |
|---|---|
| **Netlify** | `/* /index.html 200` rule မရှိလျှင် 404 — **မဖြစ်မနေလို** |
| **Cloudflare Pages** | `404.html` မရှိလျှင် SPA fallback ကို default ပေးပြီးသား။ `_redirects` rule ကို "infinite loop" warning ဖြင့် ignore လုပ်နိုင်သော်လည်း အန္တရာယ်မရှိ |

## ၄. ပြင်ဆင်မည့်ဖိုင်များ

| ဖိုင် | အကြောင်းအရာ |
|---|---|
| `public/_redirects` *(အသစ်)* | `/*  /index.html  200` |
| `public/_headers` *(အသစ်)* | `/assets/*` → `Cache-Control: public, max-age=31536000, immutable` (Vite ၏ hash ပါသော ဖိုင်များ) — host နှစ်ခုလုံး ထောက်ပံ့ |
| `netlify.toml` *(အသစ်)* | `command = "npm run build"`, `publish = "dist"` — Netlify အတွက်သာ (Cloudflare က ignore) |
| `.env.example` *(အသစ်)* | `VITE_API_URL=https://<backend-domain>/api/v1` — host dashboard တွင် ထည့်ရမည့် variable ကို မှတ်တမ်းတင်ရန် |

> `.env` ကို `.gitignore` တွင် ထည့်ထားပြီးသားဖြစ်၍ production `VITE_API_URL` ကို host ၏ environment variable setting တွင် ထည့်ရမည် (build time တွင် bundle ထဲ ထည့်သွင်းသည်)။

## ၅. Host setting (code မဟုတ်၊ user ကိုယ်တိုင်)

| Setting | Netlify | Cloudflare Pages |
|---|---|---|
| Base directory | `ecommerce` | Root directory: `ecommerce` |
| Build command | `npm run build` | `npm run build` |
| Output | `dist` | `dist` |
| Env var | `VITE_API_URL` | `VITE_API_URL` |

## ၆. Code ပြင်ပ လိုအပ်ချက် (ဤ plan တွင် မပါ)
- Backend `CLIENT_ORIGINS` တွင် ecommerce domain ထည့် (CORS) — မထည့်လျှင် API call အားလုံး block ဖြစ်မည်။
- Backend production server တွင် `NODE_ENV=production`။

## ၇. စစ်ဆေးမည့်နည်း
1. `npm run build` → `dist/_redirects`, `dist/_headers` ပါမပါ စစ်။
2. `npm run preview` ဖြင့် build ကို local တွင် ဖွင့်ပြီး route များ အလုပ်လုပ်မလုပ် စစ်။
3. Deploy ပြီးနောက် `/product/<id>`, `/cart` ကို tab အသစ်တွင် ဖွင့် → 404 မဖြစ်။
4. Browser DevTools → `/assets/*.js` response တွင် `Cache-Control: ... immutable` ပါ။
