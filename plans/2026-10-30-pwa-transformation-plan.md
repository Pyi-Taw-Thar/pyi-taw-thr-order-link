# Ecommerce (Customer Storefront) — PWA အသွင်ပြောင်းလဲခြင်းနှင့် Install App Banner ထည့်သွင်းခြင်း Plan

- **ရက်စွဲ:** 2026-10-30
- **အခြေအနေ:** ✅ အောင်မြင်စွာ ပြီးစီး (2026-10-30) — typecheck / build pass; PWA Service Worker (sw.js) နှင့် manifest.webmanifest အောင်မြင်စွာ generate ပြုလုပ်ပြီး၊ Install Banner UI တပ်ဆင်ပြီး
- **ပစ်မှတ် Sub-project:** `ecommerce/`

---

## ၁။ ရည်ရွယ်ချက် (Objective)
လက်ရှိ React + Vite (TypeScript) ဖြင့် ရေးသားထားသော Ecommerce Storefront ကို မိုဘိုင်းဖုန်း Chrome နှင့် အခြား Browser အသုံးပြုသူများအတွက် စွမ်းဆောင်ရည်ပြည့်ဝသော **Progressive Web App (PWA)** အဖြစ် ပြောင်းလဲပေးရန်နှင့် ဖုန်း Home Screen ပေါ်တွင် အလွယ်တကူ ထည့်သွင်းနိုင်စေမည့် စိတ်ကြိုက် **"Install App" Banner** ကို အောင်မြင်စွာ တပ်ဆင်ရန် ဖြစ်ပါသည်။

---

## ၂။ အကောင်အထည်ဖော်မည့် အဆင့်ဆင့် ချဉ်းကပ်ပုံ (Approach & Steps)

### အဆင့် (၁) - Dependency ထည့်သွင်းခြင်း
`ecommerce/` folder အတွင်း `vite-plugin-pwa` ကို dev dependency အဖြစ် install ပြုလုပ်မည်။
```bash
cd ecommerce
npm install -D vite-plugin-pwa
```

### အဆင့် (၂) - Vite Configuration (`ecommerce/vite.config.ts`) ပြင်ဆင်ခြင်း
`vite.config.ts` တွင် `VitePWA` plugin ကို ချိတ်ဆက်ပြီး အောက်ပါ settings များကို ဖွဲ့စည်းမည်-
* `registerType: 'autoUpdate'` (Service Worker ကို အလိုအလျောက် update ပြုလုပ်စေရန်)
* `devOptions: { enabled: true }` (`npm run dev` စမ်းသပ်ချိန်တွင် PWA Service Worker အလုပ်လုပ်စေရန်)
* `manifest` configuration:
  * `name`: `'Pyi Taw Thar Online Store'`
  * `short_name`: `'PyiTawThar'`
  * `description`: `'Pyi Taw Thar Online အမြန် Order ကောက်စနစ်'`
  * `theme_color`: `'#ffffff'`
  * `background_color`: `'#ffffff'`
  * `display`: `'standalone'`
  * `orientation`: `'portrait'`
  * `start_url`: `'/'`
  * `icons`: 
    * `192x192` (`/pwa-192x192.png`, `type: 'image/png'`, `purpose: 'any maskable'`)
    * `512x512` (`/pwa-512x512.png`, `type: 'image/png'`, `purpose: 'any maskable'`)

### အဆင့် (၃) - PWA Icons များ `ecommerce/public/` သို့ ပြင်ဆင်ထည့်သွင်းခြင်း
* `ecommerce/public/` directory အောက်တွင် PWA Manifest အတွက် လိုအပ်သော `pwa-192x192.png` နှင့် `pwa-512x512.png` icon ဖိုင်များကို ထည့်သွင်းပေးမည်။ (လက်ရှိ `ecommerce/src/assets/images/logo.png` ကို အခြေခံ၍ သို့မဟုတ် SVG/Canvas generator ဖြင့် Standard PWA Icon များ ဖန်တီးထည့်သွင်းပေးမည်)။
* `ecommerce/index.html` တွင် လိုအပ်သော meta tags များ (`theme-color`, `apple-touch-icon`) ကို ဖြည့်စွက်မည်။

### အဆင့် (၄) - Custom PWA Hook (`ecommerce/src/hooks/usePWAInstall.ts`) ရေးသားခြင်း
* Browser ၏ မူလ `beforeinstallprompt` event ကို ဖမ်းယူပြီး default prompt ကို `e.preventDefault()` ဖြင့် တားဆီးမည်။
* Deferred prompt event ကို state ထဲတွင် သိမ်းဆည်းထားပြီး `isInstallable` (boolean flag) အဖြစ် expose ပြုလုပ်မည်။
* `installApp()` function:
  * သိမ်းထားသော prompt ကို `deferredPrompt.prompt()` ဖြင့် ခေါ်ယူပြသမည်။
  * `await deferredPrompt.userChoice` ဖြင့် အသုံးပြုသူ၏ ရွေးချယ်မှု (accepted / dismissed) ကို စောင့်ကြည့်ပြီး event ကို ရှင်းလင်းမည်။
* `appinstalled` event ကို နားထောင်၍ App install ပြီးသွားပါက `isInstallable` ကို `false` အဖြစ် ပြောင်းလဲပြီး Banner ကို အလိုအလျောက် ပိတ်သွားစေမည်။

### အဆင့် (၅) - Custom Install Banner Component (`ecommerce/src/components/InstallBanner.tsx`) ဖန်တီးခြင်း
* `isInstallable` ဖြစ်ပြီး အသုံးပြုသူမှ dismiss မလုပ်ထားပါက Screen အောက်ခြေ (Fixed Bottom) တွင် သပ်ရပ်လှပသော UI Card အဖြစ် ပေါ်လာမည်။
* App Logo၊ "Pyi Taw Thar App သွင်းမည်" ခေါင်းစဉ်နှင့် ရှင်းလင်းချက်စာသား ပါဝင်မည်။
* အဓိက CTA ခလုတ် ("Install App" / "အက်ပ်သွင်းမည်") ကို နှိပ်ပါက `installApp()` ကို ခေါ်ယူမည်။
* Dismiss (X သို့မဟုတ် နောက်မှ) ခလုတ် ပါဝင်ပြီး လက်ရှိ session အတွင်း banner ကို ဖျောက်ထားနိုင်မည်။

### အဆင့် (၆) - Root Layout (`ecommerce/src/App.tsx`) တွင် ချိတ်ဆက်ခြင်း
* `InstallBanner` component ကို `App.tsx` တွင် ထည့်သွင်းပေးမည် (Login ဝင်ထားချိန်ရော၊ Login မဝင်ရသေးခင် Login Page တွင်ပါ ပေါ်စေရန် အဆင်ပြေအောင် ချိန်ညှိတပ်ဆင်မည်)။

---

## ၃။ ပြင်ဆင်မည့် ဖိုင်များနှင့် အသစ်ဖန်တီးမည့် ဖိုင်များ (Files to Modify / Create)

| ဖိုင်လမ်းကြောင်း | လုပ်ဆောင်ချက် | အကြောင်းအရာ |
|---|---|---|
| `ecommerce/package.json` | Modify | `vite-plugin-pwa` dependency ထည့်သွင်းခြင်း |
| `ecommerce/vite.config.ts` | Modify | `VitePWA` plugin နှင့် manifest ဖွဲ့စည်းမှု ထည့်သွင်းခြင်း |
| `ecommerce/index.html` | Modify | PWA meta tags နှင့် icon link များ ထည့်သွင်းခြင်း |
| `ecommerce/public/pwa-192x192.png` | Create | 192x192 PWA App Icon |
| `ecommerce/public/pwa-512x512.png` | Create | 512x512 PWA App Icon |
| `ecommerce/src/hooks/usePWAInstall.ts` | Create | Custom Hook for PWA install prompt & lifecycle |
| `ecommerce/src/components/InstallBanner.tsx` | Create | Sleek Fixed Bottom Install Banner UI |
| `ecommerce/src/App.tsx` | Modify | `InstallBanner` ကို Root Component တွင် တပ်ဆင်ခြင်း |

---

## ၄။ စစ်ဆေးအတည်ပြုမည့် နည်းလမ်းများ (Verification Steps)
1. `npm run typecheck` (TypeScript error ကင်းစင်မှု စစ်ဆေးခြင်း)
2. `npm run build` (Vite PWA service worker generate လုပ်မှုနှင့် production build အောင်မြင်မှု စစ်ဆေးခြင်း)
3. Chrome DevTools ၏ **Application > Manifest** နှင့် **Service Workers** tab တွင် Manifest အချက်အလက်များနှင့် Service Worker status မှန်ကန်စွာ register ဖြစ်မဖြစ် စစ်ဆေးခြင်း
4. Mobile View တွင် `isInstallable` အခြေအနေနှင့် Custom Install Banner ပေါ်ထွက်လာမှု စစ်ဆေးခြင်း
