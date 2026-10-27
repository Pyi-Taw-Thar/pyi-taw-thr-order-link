import { QueryClient } from "@tanstack/react-query";

// Server data (product / brand / category) cache — back ပြန်လာလျှင် cache မှ ချက်ချင်းပြ
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // ၂ မိနစ်အတွင်း ပြန်ဝင်လျှင် API မခေါ်
      gcTime: 10 * 60 * 1000, // မသုံးသော cache ကို ၁၀ မိနစ်နောက် ရှင်း
      refetchOnWindowFocus: false, // ဖုန်းတွင် app ပြန်ဖွင့်တိုင်း ပြန်မခေါ်
      retry: 1,
    },
  },
});
