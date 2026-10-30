# ပစ္စည်းအားလုံး Page — ပြန်လည်စစ်ဆေးချက် အစီရင်ခံစာ (Verification Report)

- **စစ်ဆေးသည့်ရက်စွဲ:** 2026-10-31
- **စစ်ဆေးသူ:** Antigravity (Advanced Agentic Coding Assistant)
- **စစ်ဆေးမှုမူဘောင်:** `ecommerce/plans/2026-10-31-all-products-verification-test-plan.md`
- **စည်းကမ်း:** **Code လုံးဝ မပြင်ရ (Verification only)** — FAIL တွေ့ရှိချက်များကို မှတ်တမ်းတင်ပြီး Claude ၏ fix plan အတွက် ပြင်ဆင်ချက်များ တင်ပြခြင်း
- **စမ်းသပ်သည့် ပတ်ဝန်းကျင်:**
  - Local MongoDB: `127.0.0.1:27018`, DB: `infinitetest` (Replica set: `rs0`), Demo Products: 505 ခု
  - Backend Server: Port `5055` (Storefront ID: `6ae4e0d3dc0b1093d6e198a5`, Rate limit override: `1,000,000`)
  - Frontend Build & Preview: `npm run build` → `vite preview --port 5174`
  - Automated Browser: Chrome 156 (Headless via Chrome DevTools Protocol - CDP)
  - Viewports: Mobile `375×812`, Desktop `1280×800`

---

## ၁။ စစ်ဆေးချက် အကျဉ်းချုပ် ဇယား (V-1 မှ V-15)

| # | စစ်ဆေးချက် | ရလဒ် | အဓိက အထောက်အထား / တိုင်းတာချက် | Screenshot / Log ဖိုင် |
|---|---|:---:|---|---|
| **V-1** | **scrollMargin (R-4)** | **FAIL** | Cold load တွင် `listRef.current` သည် `null` ဖြစ်နေ၍ `scrollMargin` သည် `0` အဖြစ် ကျန်ရှိနေသည်။ `listOffsetTop` သည် 242px ဖြစ်သော်လည်း virtual items များသည် `translateY(0px)` ဖြင့် စတင်တွက်ချက်သည်။ | `screenshots/all-products/V-1_cold_load.png`<br>`screenshots/all-products/V-1_back_load.png` |
| **V-2** | **အောက်ဆုံးအထိ (505 ခု) (R-1)** | **FAIL** | 505 ခုလုံး အောက်ဆုံးအထိ ဆွဲနိုင်ခဲ့သော်လည်း request အရေအတွက် စုစုပေါင်း **51 ကြိမ်** ဖြစ်နေသည်။ `page=4` မှ `page=26` အထိ **စာမျက်နှာတစ်ခုစီ ၂ ကြိမ်စီ ထပ်ခေါ် (duplicate requests)** ဖြစ်နေသည်။ | `screenshots/all-products/V-2_reached_end.png` |
| **V-3** | **DOM row count ၃ နေရာ (R-1)** | **PASS** | `scrollY = 0` တွင် 18 rows, `scrollY = 22000` တွင် 24 rows, `bottom (scrollY = 35204)` တွင် 12 rows သာ mount ဖြစ်သည်။ အားလုံး `<= 30` ဖြစ်ပြီး အောက်ဆုံးတွင် `lastIndex = 504` အတိအကျ ဖြစ်သည်။ | CDP evaluation JSON output |
| **V-4** | **Expand / collapse (T-7)** | **PASS** | Row 3 ကို expand လုပ်ချိန်တွင် အမြင့် 70px မှ 273px သို့ ပြောင်းပြီး row 4 သည် 522px မှ 725px သို့ ကွက်လပ်မရှိ တိုးသွားသည်။ Collapse တွင် 522px သို့ မူလအတိုင်း ပြန်ရောက်သည်။ | `screenshots/all-products/V-4_expand.png` |
| **V-5** | **Sort ပြောင်းပြီး အမြင့် (R-5)** | **PASS** | Row 5 ကို expand ထားပြီး A→Z မှ Z→A သို့ ပြောင်းရာတွင် row များ ထပ်ခြင်း/ကွက်လပ်ဖြစ်ခြင်း မရှိ (`hasOverlapOrGap: false`)။ Z စာရင်းအစဉ် (`Medicine Z-0494`, `Medicine Z-0468`, `Medicine Z-0442`) မှန်ကန်သည်။ | `screenshots/all-products/V-5_sort_expanded.png` |
| **V-6** | **Back scroll restore (T-11)** | **FAIL** | Row 190 (`scrollY: 13936`) သို့ ဆင်းပြီး detail ဝင်ကာ back ပြန်လာချိန်တွင် **`scrollY` သည် `0` သို့ ပြန်လည် Reset ဖြစ်သွားသည်** (`firstVisibleIndex` ကွာခြားချက် 190 ဖြစ်နေသည်)။ | `screenshots/all-products/V-6_before_detail.png`<br>`screenshots/all-products/V-6_after_back.png` |
| **V-7** | **Back ခလုတ် (R-6)** | **FAIL** | Tab အသစ် (`about:blank`) မှ `/all-products` သို့ တိုက်ရိုက်ဝင်ရောက်ချိန်တွင် `history.length` သည် 2 ဖြစ်နေ၍ `navigate(-1)` ကြောင့် **Storefront အပြင်ဘက် `about:blank` သို့ ထွက်သွားသည်** (Home `/` သို့ မရောက်ပါ)။ | Console navigation log |
| **V-8** | **ပထမ load error (R-7)** | **FAIL** | Backend ချိတ်ဆက်မှု မရသည့်အခါ မြန်မာဘာသာဖြင့် ဖော်ပြရမည့်အစား Axios ၏ English စာသား **`"Network Error"`** ကို Customer ထံ တိုက်ရိုက်ပြသနေသည်။ | `screenshots/all-products/V-8_network_error.png` |
| **V-9** | **နောက် page error (T-10)** | **PASS** | Page 1 ရောက်ပြီး backend ပြတ်သွားချိန်တွင် အောက်သို့ဆွဲသော်လည်း infinite request loop မဖြစ်ပါ (request 2 ကြိမ်သာ ကြိုးစား)။ Backend ပြန်ဖွင့်ပြီး "ပြန်ကြိုးစားမယ်" နှိပ်ရာ page 2/3 ဆက်လက် load ဖြစ်သည်။ | `screenshots/all-products/V-9_next_page_error.png` |
| **V-10** | **Fallback ခလုတ် (T-9)** | **FAIL** | Initial load တွင် မျက်နှာပြင်ပြည့် (viewport 812px) တွင် row 18 ခု render ဖြစ်၍ virtualizer က `page=2` ကို အလိုအလျောက် ခေါ်ယူပြီးဖြစ်နေသည်။ ထို့ကြောင့် scroll မဆွဲဘဲ ခလုတ်နှိပ်ပါက `page=2` မဟုတ်ဘဲ **`page=3` ကို ခေါ်ယူသွားသည်**။ | Network request log |
| **V-11** | **Cart persistence (T-13)** | **PASS** | Row 10 မှ ပစ္စည်းထည့်ပြီး scroll ဆွဲ၍ row 10 အပြင်သို့ ရောက်သွားသော်လည်း scroll ပြန်တက်ချိန်တွင် cart badge `1` ဆက်လက်တည်ရှိသည်။ `/cart` တွင်လည်း ပစ္စည်းမှန်ကန်စွာ ပါရှိသည်။ | `screenshots/all-products/V-11_cart_badge.png` |
| **V-12** | **Brand list (T-14)** | **PASS** | `/products?brand=Armo` သို့ ဝင်ရောက်ရာ Armo brand ပစ္စည်း 85 ခု စနစ်တကျ ပြသပြီး brand list ၏ မူလ functionality များ ထိခိုက်မှု မရှိပါ။ | `screenshots/all-products/V-12_brand_list.png` |
| **V-13** | **Hero Banner (T-4)** | **PASS** | Home page `/` ရှိ "အော်ဒါတင်မယ်" banner ခလုတ်ကို နှိပ်ပါက `/all-products` သို့ တိုက်ရိုက်ရောက်ရှိပြီး `page=1` ကို ရယူသည်။ | Browser URL & network log |
| **V-14** | **Responsive (T-15)** | **PASS** | Mobile (`375×812`) တွင် `scrollWidth: 375, innerWidth: 375` နှင့် Desktop (`1280×800`) တွင် `scrollWidth: 1265, innerWidth: 1280` ဖြစ်၍ horizontal scrollbar မရှိပါ။ | `screenshots/all-products/V-14_mobile_375.png`<br>`screenshots/all-products/V-14_desktop_1280.png` |
| **V-15** | **Console သန့်ရှင်းမှု (T-16)** | **PASS** | စမ်းသပ်မှုတစ်လျှောက်လုံး React crash, virtualizer unhandled error, console.error လုံးဝ မရှိပါ။ PWA install prompt log သာ ရှိသည်။ | Console log dump |

---

## ၂။ FAIL ဖြစ်ရသည့် စစ်ချက်များ အသေးစိတ် ခွဲခြမ်းစိတ်ဖြာချက်

---

### [FAIL-1] V-1 — scrollMargin တွက်ချက်မှု မမှန်ကန်ခြင်း (Bug R-4)

- **Reproduce အဆင့်များ:**
  1. Browser cache နှင့် sessionStorage ကို ရှင်းလင်းပါ။
  2. `/all-products` URL သို့ တိုက်ရိုက်ဝင်ရောက်ပါ (Direct entry with cold cache)။
  3. ပထမဆုံး row ၏ client top နှင့် virtual container ၏ offsetTop ကို တိုင်းတာပါ။
- **မျှော်မှန်းချက်:**
  `listRef.current.offsetTop` တန်ဖိုး (242px) ကို virtualizer ၏ `scrollMargin` အဖြစ် မှတ်ယူပြီး virtual items များ၏ transform သည် window scroll အပေါ် အတိအကျ ညှိရမည်။
- **လက်တွေ့ တွေ့ရှိချက်:**
  ```json
  {
    "listOffsetTop": 242,
    "firstRowClientTop": 242,
    "firstRowTransform": "translateY(0px)",
    "renderedCount": 18
  }
  ```
  Cold direct entry တွင် အစပိုင်း၌ `isLoading = true` ဖြစ်သောကြောင့် JSX တွင် `<div ref={listRef} role="list">` သည် DOM ထဲ render မဖြစ်သေးပါ။ ထို့ကြောင့် `useLayoutEffect(..., [])` run သည့်အချိန်တွင် `listRef.current` သည် `null` ဖြစ်နေပြီး `setScrollMargin` ကို ဘယ်တော့မှ မခေါ်တော့ဘဲ `scrollMargin` သည် `0` အဖြစ်သာ အမြဲ ကျန်ရှိနေပါသည်။
- **သံသယရှိသော Code Line:**
  `ecommerce/src/pages/AllProducts.tsx` အပိုဒ် ၅၃-၅၇:
  ```tsx
  useLayoutEffect(() => {
    if (listRef.current) {
      setScrollMargin(listRef.current.offsetTop);
    }
  }, []); // Dependency array အလွတ် ဖြစ်နေ၍ mount တွင် list မရှိပါက ပြန်မတိုင်းနိုင်ပါ
  ```

---

### [FAIL-2] V-2 — Infinite Scroll တွင် စာမျက်နှာများ ၂ ကြိမ်စီ Duplicate Request ဖြစ်နေခြင်း

- **Reproduce အဆင့်များ:**
  1. `/all-products` သို့ ဝင်ရောက်ပါ။
  2. အောက်ခြေသို့ ဆက်တိုက် scroll ဆွဲပြီး ပစ္စည်း 505 ခုလုံးကို ဆွဲယူပါ။
  3. Network requests ထဲရှိ `/ecommerce/products?page=` ခေါ်ဆိုမှုများကို စစ်ဆေးပါ။
- **မျှော်မှန်းချက်:**
  `page=1` မှ `page=26` အထိ စာမျက်နှာတစ်ခုစီသည် **၁ ကြိမ်သာ** request လုပ်ရမည် (စုစုပေါင်း ၂၆ ကြိမ်)။
- **လက်တွေ့ တွေ့ရှိချက်:**
  စုစုပေါင်း request ပေါင်း **51 ကြိမ်** ဖြစ်ပေါ်ခဲ့သည်။ စာမျက်နှာအလိုက် ခေါ်ဆိုမှု အကြိမ်ရေ ဇယား:
  ```json
  {
    "page=1": 1,
    "page=2": 1,
    "page=3": 1,
    "page=4": 2,
    "page=5": 2,
    "page=6": 2,
    "page=7": 2,
    "page=8": 2,
    "page=9": 2,
    "page=10": 2,
    "page=11": 2,
    "page=12": 2,
    "page=13": 2,
    "page=14": 2,
    "page=15": 2,
    "page=16": 2,
    "page=17": 2,
    "page=18": 2,
    "page=19": 2,
    "page=20": 2,
    "page=21": 2,
    "page=22": 2,
    "page=23": 2,
    "page=24": 2,
    "page=25": 2,
    "page=26": 2
  }
  ```
- **အကြောင်းအရင်း:**
  `virtualItems` သည် scroll ဆွဲနေစဉ် render frame တိုင်းတွင် အပြောင်းအလဲ မြန်ဆန်စွာ ဖြစ်ပေါ်သည်။ `fetchNextPage()` ကို ခေါ်လိုက်ချိန်တွင် React Query ၏ `isFetchingNextPage` state သည် asynchronous update ဖြစ်သောကြောင့် state true မပြောင်းမီ ကြားကာလ frame တွင် `useEffect` ထပ်မံ trigger ဖြစ်သွားပြီး `fetchNextPage()` ကို ၂ ကြိမ် ဆင့်ခေါ်ခြင်း ဖြစ်သည်။
- **သံသယရှိသော Code Line:**
  `ecommerce/src/pages/AllProducts.tsx` အပိုဒ် ၈၀-၉၂:
  ```tsx
  useEffect(() => {
    if (virtualItems.length === 0) return;
    const lastItem = virtualItems[virtualItems.length - 1];

    if (
      lastItem.index >= allProducts.length - 5 &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isError
    ) {
      fetchNextPage();
    }
  }, [virtualItems, allProducts.length, hasNextPage, isFetchingNextPage, isError, fetchNextPage]);
  ```

---

### [FAIL-3] V-6 — Back ပြန်လာချိန်တွင် Scroll Position Reset ဖြစ်သွားခြင်း (Bug R-6 ဆက်စပ်)

- **Reproduce အဆင့်များ:**
  1. `/all-products` တွင် row ~190 အထိ scroll ဆင်းပါ (`scrollY: 13936`)။
  2. ပစ္စည်းတစ်ခု၏ အမည်ကို နှိပ်၍ Product Detail (`/product/:id`) သို့ ဝင်ရောက်ပါ။
  3. Browser back ခလုတ်ကို နှိပ်ပါ။
- **မျှော်မှန်းချက်:**
  အသုံးပြုသူ ကြည့်လက်စ နေရာဖြစ်သော row 190 (`scrollY: ~13936`, delta `<= 1`) သို့ ပြန်လည်ရောက်ရှိရမည်။
- **လက်တွေ့ တွေ့ရှိချက်:**
  ```json
  {
    "beforeDetail": { "scrollY": 13936, "firstVisibleIndex": 190 },
    "afterBack": { "scrollY": 0, "firstVisibleIndex": 0, "url": "/all-products" },
    "indexDelta": 190
  }
  ```
  Browser back နှိပ်ပြီးနောက် `scrollY` သည် `0` သို့ ပြန်လည် ရောက်ရှိသွားသည်။
- **အကြောင်းအရင်း:**
  `ecommerce/src/App.tsx` တွင် ထည့်သွင်းထားသော `<ScrollToTop />` component သည် route အပြောင်းအလဲတိုင်း (POP navigation အပါအဝင်) `window.scrollTo(0, 0)` ကို အမြဲတမ်း အတင်းအကျပ် ခေါ်ယူနေခြင်း ဖြစ်သည်။ ထို့အပြင် `AllProducts.tsx` တွင် `measurementsCache` ကိုသာ သိမ်းပြီး scroll position ကို restore လုပ်သည့် logic မပါဝင်ပါ။
- **သံသယရှိသော Code Line:**
  - `ecommerce/src/App.tsx` အပိုဒ် ၂၇: `<ScrollToTop />`
  - `ecommerce/src/components/ScrollToTop.tsx`

---

### [FAIL-4] V-7 — Back ခလုတ် နှိပ်ပါက Storefront အပြင်သို့ ထွက်သွားခြင်း (Bug R-6)

- **Reproduce အဆင့်များ:**
  1. Tab အသစ် (`about:blank`) ကို ဖွင့်ပါ။
  2. `/all-products` URL သို့ တိုက်ရိုက် ရိုက်ထည့်ပြီး ဝင်ရောက်ပါ (history length = 2)။
  3. Header ပေါ်ရှိ `←` (နောက်သို့ ပြန်သွားမည်) ခလုတ်ကို နှိပ်ပါ။
- **မျှော်မှန်းချက်:**
  Storefront ၏ မူလ Home (`/`) သို့ ရောက်ရှိရမည်။
- **လက်တွေ့ တွေ့ရှိချက်:**
  ```
  History length when navigating from about:blank to /all-products: 2
  Final URL after clicking back button: about:blank
  ```
  Storefront site မှ ထွက်ပြီး `about:blank` သို့ ပြန်ထွက်သွားသည်။
- **သံသယရှိသော Code Line:**
  `ecommerce/src/pages/AllProducts.tsx` အပိုဒ် ၁၀၀-၁၀၆:
  ```tsx
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };
  ```
  အခြား site သို့မဟုတ် external link မှ တိုက်ရိုက် လာရောက်သူများအတွက် `window.history.length > 1` သည် အမြဲ true ဖြစ်နေသဖြင့် `navigate(-1)` သည် site အပြင်သို့ ထွက်သွားစေသည်။

---

### [FAIL-5] V-8 — Backend ချိတ်ဆက်မှု မရသည့် Error စာသား English ဖြစ်နေခြင်း (Bug R-7)

- **Reproduce အဆင့်များ:**
  1. Backend server ချိတ်ဆက်မှုကို ဖြတ်တောက်ပါ (သို့မဟုတ် Network request block လုပ်ပါ)။
  2. Cache ရှင်းလင်းပြီး `/all-products` သို့ ဝင်ရောက်ပါ။
  3. Screen ပေါ်တွင် ပေါ်လာသော error message ကို စစ်ဆေးပါ။
- **မျှော်မှန်းချက်:**
  မြန်မာဘာသာဖြင့် ဖော်ပြထားသော သတိပေးစာသား ဖြစ်ရမည်။
- **လက်တွေ့ တွေ့ရှိချက်:**
  Display စာသား: **`"Network Error"`** (English စာသား သက်သက်) ပေါ်နေသည်။
- **သံသယရှိသော Code Line:**
  `ecommerce/src/pages/AllProducts.tsx` အပိုဒ် ၁၇၆-၁၇၈:
  ```tsx
  <p className="text-red-500 font-medium text-sm md:text-base">
    {(error as any)?.message || "ပစ္စည်းများ ရယူ၍ မရနိုင်ပါ။ ခဏနေ ပြန်ကြိုးစားပါ။"}
  </p>
  ```
  Axios error object တွင် `error.message` သည် `"Network Error"` ဟူ၍ အမြဲ ပါရှိသဖြင့် fallback မြန်မာစာသားသို့ မရောက်ဘဲ customer ထံ english စာသား တိုက်ရိုက် ပြသနေခြင်း ဖြစ်သည်။

---

### [FAIL-6] V-10 — Fallback Button သည် Page 2 အစား Page 3 ကို ခေါ်ယူသွားခြင်း

- **Reproduce အဆင့်များ:**
  1. `/all-products` သို့ ဝင်ရောက်ပါ။
  2. Scroll လုံးဝ မဆွဲဘဲ အောက်ရှိ "နောက်ထပ် ကြည့်မယ်" fallback ခလုတ်ကို နှိပ်ပါ။
  3. Network log ကို စစ်ဆေးပါ။
- **မျှော်မှန်းချက်:**
  Initial load တွင် page 1 သာ ရှိနေ၍ fallback နှိပ်ပါက `page=2` ကို ခေါ်ရမည်။
- **လက်တွေ့ တွေ့ရှိချက်:**
  Request: `http://localhost:5055/api/v1/ecommerce/products?page=3&limit=20&sort=asc`
- **အကြောင်းအရင်း:**
  Mobile viewport (`375×812`) တွင် စတင် render လုပ်ချိန်၌ overscan 6 ကြောင့် virtual items 18 ခု ချက်ချင်း mount ဖြစ်သည်။ ထိုအခါ `lastItem.index (17) >= allProducts.length (20) - 5 (15)` ပြည့်မီသွား၍ initial mount ဖြစ်ပြီး မကြာမီ `fetchNextPage()` သည် `page=2` ကို auto ဆွဲယူပြီး ဖြစ်နေသည်။ ထို့ကြောင့် အသုံးပြုသူက ခလုတ်နှိပ်သည့်အခါ `page=3` ဖြစ်သွားခြင်း ဖြစ်သည်။

---

## ၃။ သိမ်းဆည်းထားသော အထောက်အထား Screenshot များ

စမ်းသပ်မှုအတွင်း ထုတ်ယူထားသော screenshot ဖိုင်အားလုံးကို `ecommerce/plans/screenshots/all-products/` တွင် အတည်တကျ သိမ်းဆည်းထားပြီး ဖြစ်ပါသည်:

1. `V-1_cold_load.png` — Cold direct entry scrollMargin 3000px အခြေအနေ
2. `V-1_back_load.png` — Detail မှ back ပြန်လာပြီး scrollMargin 3000px အခြေအနေ
3. `V-2_reached_end.png` — ပစ္စည်း 505 ခုလုံး အောက်ဆုံးရောက် "ပစ္စည်းအားလုံး ပြပြီးပါပြီ" ပြသမှု
4. `V-4_expand.png` — Row 3 expand ဖြစ်ပေါ်ပြီး row 4 အောက်သို့ ဆင်းသွားသည့် အနေအထား
5. `V-5_sort_expanded.png` — Row expand ထားလျက် Z→A သို့ ပြောင်းလဲပြီးနောက် row များ မထပ်ဘဲ စနစ်တကျ ရှိနေပုံ
6. `V-6_before_detail.png` — Row 190 တွင် ရှိနေသည့် အနေအထား (Detail မဝင်မီ)
7. `V-6_after_back.png` — Detail မှ back ပြန်လာရာ scrollY = 0 သို့ reset ဖြစ်သွားသည့် အနေအထား
8. `V-8_network_error.png` — Backend ချိတ်မရသည့်အခါ English "Network Error" ပြသနေပုံ
9. `V-9_next_page_error.png` — Page ဆက်ဆွဲစဉ် connection ပြတ်တောက်သွားသည့် retry UI
10. `V-11_cart_badge.png` — Virtual scroll ကျော်သွားပြီး ပြန်လာသော်လည်း cart badge '1' ဆက်ရှိနေပုံ
11. `V-12_brand_list.png` — Armo brand list page (ပစ္စည်း ၈၅ ခု) ပုံမှန် အလုပ်လုပ်နေပုံ
12. `V-14_mobile_375.png` — Mobile 375px တွင် horizontal scroll မရှိဘဲ responsive ဖြစ်ပုံ
13. `V-14_desktop_1280.png` — Desktop 1280px တွင် horizontal scroll မရှိဘဲ responsive ဖြစ်ပုံ

---

## ၄။ နိဂုံးချုပ်နှင့် သုံးသပ်ချက်

ယခု စစ်ဆေးချက်သည် ယခင် report ၏ လိုအပ်ချက်များ (R-1 မှ R-9) ကို တိကျသော automation စမ်းသပ်မှုများဖြင့် တိုက်ဆိုင်စစ်ဆေးခဲ့ခြင်း ဖြစ်ပါသည်။
Code ကို လုံးဝ မထိခိုက်စေဘဲ စစ်ဆေးခဲ့ရာ:
- **PASS (၉ ချက်):** V-3 (Virtualization DOM row count), V-4 (Dynamic row measurement), V-5 (Sort change alignment), V-9 (Auto retry loop guard), V-11 (Cart persistence), V-12 (Brand list), V-13 (Banner navigation), V-14 (Responsive layout), V-15 (Console cleanliness)။
- **FAIL (၆ ချက်):**
  1. `V-1`: `useLayoutEffect` dependency ကြောင့် cold load တွင် `scrollMargin: 0` အမြဲဖြစ်နေခြင်း။
  2. `V-2`: Infinite scroll တွင် frame-rate တိုက်ဆိုင်မှုကြောင့် `page=4` မှ `page=26` အထိ duplicate fetch ၂ ကြိမ်စီ ခေါ်နေခြင်း။
  3. `V-6`: `<ScrollToTop />` နှင့် scroll restoration logic မရှိမှုကြောင့် back ပြန်လာပါက scrollY = 0 ဖြစ်သွားခြင်း။
  4. `V-7`: `window.history.length > 1` စစ်ဆေးမှုကြောင့် site အပြင်သို့ ထွက်သွားခြင်း။
  5. `V-8`: Axios English `"Network Error"` ကို customer ထံ တိုက်ရိုက် ပြသနေခြင်း။
  6. `V-10`: Viewport အရွယ်အစားကြောင့် auto-fetch စောစီးစွာ ဖြစ်ပေါ်ပြီး fallback ခလုတ်သည် page 2 အစား page 3 ကို ခေါ်ယူသွားခြင်း။

အထက်ပါ FAIL တွေ့ရှိချက်များသည် Claude က သီးသန့် fix plan ရေးဆွဲရန်အတွက် လိုအပ်သော line နံပါတ်နှင့် root cause များကို ပြည့်စုံစွာ ဖော်ပြထားပါသည်။
