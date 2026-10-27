# Product Data Cache (State Management) ထည့်ရန် Plan

- **ရက်စွဲ:** 2026-10-27
- **အခြေအနေ:** ✅ ပြီး (2026-10-27) — `@tanstack/react-query@5.104.2` (exact pin; ၂ ပတ်ကျော် version); typecheck / lint / build pass (gzip 98.8KB → 110.9KB); 390px browser — list → detail → back တွင် loading မပေါ်, request အသစ်မရှိ, scroll 1500px ပြန်ရောက်; link ဖြင့် page အသစ် = ထိပ်ဆုံး; Search `?q=` back/forward တွင် ကျန်; direct link detail OK; order တင်ပြီး list ပြန်ယူ; test DB ဖျက်ပြီး
- **အကောင်အထည်ဖော်စဉ် ညှိချက်:** scroll နေရာကို scroll event အပြင် route မပြောင်းမီ (layout effect cleanup) တွင်ပါ မှတ် — event နောက်ကျ/မထွက်လည်း မှန်စေရန်; Search ရလဒ်မှ detail သို့ link သည် ယခင်ကတည်းက မရှိ (ဤ plan တွင် မထည့်)

## ၁. ပြဿနာ
Product list → Detail → **Back** ပြန်ထွက်လျှင်:
1. `pages/Products.tsx` component အသစ် ပြန် mount ဖြစ်ပြီး `useState([])` မှ စ၍ API ကို ပြန်ခေါ် → "ဆေးဝါးများ ရှာဖွေနေပါသည်..." loading ပြန်ပေါ်
2. `components/ScrollToTop.tsx` က route ပြောင်းတိုင်း (back အပါအဝင်) `scrollTo(0, 0)` → list အောက်ပိုင်းမှ ဝင်ခဲ့လျှင် ထိပ်ဆုံးသို့ ပြန်ရောက်၍ ပြန်ရှာရ
3. `pages/Search.tsx` — ရှာထားသော စာသားက component state ထဲတွင်သာ ရှိ၍ back ပြန်လာလျှင် ရှာဖွေမှု ပျောက်

အခြား page (Home ၏ Brand / SubCategory / Limited section, LimitedProducts) တွင်လည်း page ပြန်ဝင်တိုင်း အမြဲ ပြန် fetch / loading

## ၂. ချဉ်းကပ်ပုံ — TanStack Query (`@tanstack/react-query` v5)
ဤ app ၏ "state" အများစုမှာ **server data** (product / brand / category) ဖြစ်၍ global store (Redux / Zustand) ထက် server-data cache library က ပိုကိုက်:
- Query key အလိုက် memory cache — back ပြန်လာလျှင် cache မှ **ချက်ချင်းပြ** (loading မပေါ်)
- နောက်ကွယ်တွင် အသစ်ပြန်စစ် (stale-while-revalidate) — လက်ကျန်/ဈေး ပြောင်းလျှင် UI ကို တိတ်တဆိတ် update
- Request ထပ်နေခြင်း (Home section ၂ ခု တစ်ပြိုင်နက် brand ခေါ်ခြင်းကဲ့သို့) ကို တစ်ခုတည်း ပေါင်း
- React 18 support, gzip ~13KB; Cart (CartContext + localStorage) ကို **မထိ** — client state ဖြစ်၍ ယခုအတိုင်း ကောင်း

> ရွေးစရာ: library မထည့်ဘဲ ကိုယ်ပိုင် cache context ရေးနိုင်သော်လည်း stale/refetch/dedupe/error-retry ကို ကိုယ်တိုင်ပြန်ရေးရ၍ TanStack Query ကို အကြံပြု

### Cache စည်းမျဉ်း
| | တန်ဖိုး | အကြောင်းရင်း |
|---|---|---|
| `staleTime` | 2 မိနစ် | ၂ မိနစ်အတွင်း back/ပြန်ဝင်လျှင် API မခေါ် |
| `gcTime` | 10 မိနစ် | မသုံးသော cache ကို ၁၀ မိနစ်နောက် ရှင်း |
| `refetchOnWindowFocus` | `false` | ဖုန်းတွင် app ပြန်ဖွင့်တိုင်း ပြန်မခေါ် (noti polling ဖယ်ခဲ့သည့် မူအတိုင်း) |
| `retry` | 1 | |
| Order တင်ပြီး | `invalidateQueries(["products"])` | လက်ကျန် ပြောင်း၍ နောက်တစ်ကြိမ်ကြည့်လျှင် အသစ်ယူ |

### Query keys
| Key | API | သုံးသောနေရာ |
|---|---|---|
| `["brands", subCategory]` | `GET /ecommerce/products/brands` | Products (BrandGrid), BrandSection |
| `["subcategories"]` | `GET /ecommerce/products/subcategories` | SubCategorySection |
| `["products", { brand, subCategory }]` | `GET /ecommerce/products` | Products (ProductList) |
| `["products", { limitedOnly }]` | 〃 | LimitedSaleSection, LimitedProducts |
| `["products", { search }]` | 〃 | Search |
| `["product", id]` | `GET /ecommerce/products?id=` | ProductDetail |

- ProductDetail — list cache ထဲတွင် ထို product ရှိလျှင် `initialData` အဖြစ် ချက်ချင်းပြ (ယခု `location.state` နည်းကို အစားထိုး; refresh/direct link တွင် API မှ ယူ — ယခုအတိုင်း)
- Profile / Notification / Cart order တင်ခြင်း — **မပြောင်း** (ကိုယ်ရေး data ဖြစ်၍ အမြဲ အသစ်ယူ)

## ၃. Scroll ပြန်ရောက်ခြင်း
`ScrollToTop.tsx` ကို ပြင်:
- Link နှိပ်၍ page အသစ်သွားလျှင် (`PUSH`/`REPLACE`) → ယခုအတိုင်း ထိပ်ဆုံး
- **Back/Forward (`POP`)** → ထို history entry (`location.key`) ၏ သိမ်းထားသော scroll နေရာသို့ ပြန်သွား
- Scroll နေရာကို `sessionStorage` (try/catch) တွင် key အလိုက်သိမ်း; data cache မှ ချက်ချင်း render ဖြစ်ပြီးမှ restore (`requestAnimationFrame`)

## ၄. Search ရှာထားသောစာ မပျောက်စေရန်
`Search.tsx` — query ကို URL `?q=` တွင်ထား (`useSearchParams`, `replace`) → back ပြန်လာလျှင် ရှာထားသောစာ + ရလဒ် (cache) ပြန်ပေါ်

## ၅. ပြင်ဆင်မည့်ဖိုင်များ
| ဖိုင် | ပြောင်းလဲမှု |
|---|---|
| `package.json` | `@tanstack/react-query@^5` ထည့် (npm registry မှ) |
| `src/services/queryClient.ts` *(အသစ်)* | `QueryClient` + default options |
| `src/services/productQueries.ts` *(အသစ်)* | query key + fetch function များ (`useBrands`, `useProducts`, `useProduct` …) |
| `src/main.tsx` သို့ `src/App.tsx` | `QueryClientProvider` ဖြင့် ပတ် |
| `src/pages/Products.tsx` | `useEffect`+`useState` fetch → `useBrands` / `useProducts` |
| `src/pages/ProductDetail.tsx` | → `useProduct(id)` + list cache မှ initialData |
| `src/pages/LimitedProducts.tsx`, `src/components/LimitedSaleSection.tsx`, `BrandSection.tsx`, `SubCategorySection.tsx` | → query hook |
| `src/pages/Search.tsx` | → `useProducts({ search })` (debounce ဆက်ထား) + `?q=` |
| `src/pages/Cart.tsx` | order တင်ပြီးလျှင် products cache invalidate |
| `src/components/ScrollToTop.tsx` | back တွင် scroll restore |

> Backend **မပြောင်းပါ**; UI ပုံစံ မပြောင်း — data ယူပုံ နှင့် back behavior သာ

## ၆. စစ်ဆေးမည့်နည်း
1. `npm run typecheck` / lint (ပြင်သောဖိုင်) / `build` (bundle size အရင်/အခု နှိုင်း)
2. Demo data + build preview ဖြင့် browser (ဖုန်း 390px) —
   - Product list (အောက်ပိုင်းထိ scroll) → detail → back: **loading မပေါ်**, scroll နေရာ ပြန်ရောက်, network တွင် request အသစ် မရှိ (2 မိနစ်အတွင်း)
   - Search "bio" → detail → back: စာ + ရလဒ် ကျန်
   - Detail ကို refresh / direct link: ယခုအတိုင်း API မှ ယူ
   - Link နှိပ်၍ page အသစ်သွားလျှင် ထိပ်ဆုံးမှ စ
   - Order တင်ပြီး product list ပြန်ဝင်: အသစ်ယူ
3. စစ်ပြီး test DB / server ဖျက်
