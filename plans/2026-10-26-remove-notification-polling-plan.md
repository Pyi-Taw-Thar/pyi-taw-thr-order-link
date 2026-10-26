# Notification Polling ဖယ်ရှားရန် Plan

- **ရက်စွဲ:** 2026-10-26
- **အခြေအနေ:** ✅ ပြီး (2026-10-27) — typecheck / build pass; `src/` တွင် `setInterval` မကျန်; browser Network tab ဖြင့် မစစ်ရသေး

## ၁. ရည်ရွယ်ချက်
User ဆုံးဖြတ်ချက် — **Polling ရော Socket ရော မသုံးဘဲ app ထဲ ဝင်ချိန်တွင် တစ်ကြိမ်သာ** notification စစ်မည်။

## ၂. လက်ရှိ (`src/components/Navbar.tsx:33-37`)
```tsx
useEffect(() => {
  fetchUnreadCount();
  const interval = setInterval(fetchUnreadCount, 30000);   // ← စက္ကန့် ၃၀ တစ်ခါ poll
  return () => clearInterval(interval);
}, []);
```

## ၃. ပြောင်းလဲမှု
```tsx
// App ထဲ ဝင်ချိန် (Navbar mount) တွင် တစ်ကြိမ်သာ စစ်သည် — polling / socket မသုံး
useEffect(() => {
  fetchUnreadCount();
}, []);
```

### မပြောင်းသော အပြုအမူ (ဆက်အလုပ်လုပ်)
| အချိန် | Unread count / list |
|---|---|
| App ဖွင့် / login ဝင် / browser refresh | ✅ တစ်ကြိမ် စစ် (Navbar mount) |
| Bell နှိပ်၍ modal ဖွင့် | ✅ list အပြည့် ယူ + count ပြန်စစ် (`NotificationModal` ယခုအတိုင်း) |
| Notification တစ်ခု / အားလုံး ဖတ်ပြီးမှတ် | ✅ count ပြန်စစ် (`onRefreshCount` ယခုအတိုင်း) |
| App ဖွင့်ထားစဉ် admin က order ပြင်/cancel | ❌ badge **အလိုအလျောက် မပေါ်တော့** — refresh သို့မဟုတ် bell နှိပ်မှ မြင်ရ |

## ၄. ပြင်ဆင်မည့်ဖိုင်
| ဖိုင် | ပြောင်းလဲမှု |
|---|---|
| `src/components/Navbar.tsx` | `setInterval` / `clearInterval` ဖယ် |

> Backend `src/utils/initSocket.utils.js` (socket.io မထည့်ထား၊ ဘယ်နေရာမှ မခေါ်) — dead code ဖြစ်သော်လည်း ဤ plan တွင် **မထိပါ**။

## ၅. စစ်ဆေးမည့်နည်း
1. `npm run typecheck` / `npm run build`
2. Browser — Network tab တွင် `/customer/notifications?limit=1` ကို page load တစ်ကြိမ်သာ ခေါ်, ၃၀ စက္ကန့်ကျော် စောင့်ပြီး ထပ်မခေါ်
3. Bell နှိပ် → list ပေါ်, count ပြန်စစ်
