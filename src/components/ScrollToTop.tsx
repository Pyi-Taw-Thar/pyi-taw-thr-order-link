import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const STORAGE_KEY = 'scroll_positions_v1';

const readPositions = (): Record<string, number> => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const writePositions = (positions: Record<string, number>) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // private mode စသည်ဖြင့် သိမ်းမရလည်း app ဆက်အလုပ်လုပ်
  }
};

// Link နှိပ်၍ page အသစ်သွားလျှင် ထိပ်ဆုံး / Back-Forward တွင် ယခင် scroll နေရာသို့ ပြန်
export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef<Record<string, number>>(readPositions());
  const prevPathname = useRef(location.pathname);
  // route ပြောင်းချိန် (commit) တွင် ချက်ချင်း update — page အဟောင်း၏ နေရာကို scroll event နောက်ကျ၍ overwrite မဖြစ်စေရန်
  const currentKey = useRef(location.key);

  // လက်ရှိ history entry ၏ scroll နေရာကို key အလိုက် မှတ်
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // နေရာကို ချက်ချင်းမှတ်ပြီး sessionStorage သို့ 150ms throttle ဖြင့်သာ ရေး
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      positions.current[currentKey.current] = window.scrollY;
      if (timer) return;
      timer = setTimeout(() => {
        timer = undefined;
        writePositions(positions.current);
      }, 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    currentKey.current = location.key;
    const pathnameChanged = prevPathname.current !== location.pathname;
    prevPathname.current = location.pathname;

    if (navigationType === 'POP') {
      const target = positions.current[location.key] ?? 0;
      // Cache မှ content render ပြီး page အမြင့် လုံလောက်မှ restore (အများဆုံး ~1 စက္ကန့်)
      let tries = 0;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const restore = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll >= target || tries >= 60) {
          window.scrollTo(0, Math.min(target, Math.max(0, maxScroll)));
          return;
        }
        tries += 1;
        timer = setTimeout(restore, 16);
      };
      restore();
      return () => {
        if (timer) clearTimeout(timer);
      };
    }

    // query string သာ ပြောင်းလျှင် (search ရိုက်ခြင်း စသည်) scroll မထိ — ယခင်အတိုင်း
    if (pathnameChanged) window.scrollTo(0, 0);
  }, [location.key, location.pathname, navigationType]);

  // Route မပြောင်းမီ (page အဟောင်း DOM မဖယ်ရသေးချိန်) ထို entry ၏ scroll နေရာကို အတိအကျ မှတ်
  useLayoutEffect(() => {
    const key = location.key;
    const store = positions.current; // object တစ်ခုတည်းကို mutate လုပ်၍ သုံး
    return () => {
      store[key] = window.scrollY;
      writePositions(store);
    };
  }, [location.key]);

  return null;
}
