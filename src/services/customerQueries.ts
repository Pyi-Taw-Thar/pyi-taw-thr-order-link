import { useQuery } from "@tanstack/react-query";
import api from "./axios";

export interface MyCreditData {
  creditRemaining: number;
  payableRemaining: number;
  isCreditPerson: boolean;
  blacklist: boolean;
}

export const customerCreditKeys = {
  me: ["customer-credit"] as const,
};

// လက်ရှိ customer ၏ ပေးရန်ကျန်ငွေနှင့် အော်ဒါတင်ခွင့် အခြေအနေ (staleTime: 0 — Cart နှင့် Profile ဝင်တိုင်း အသစ်ရယူသည်)
export function useMyCredit() {
  const hasToken =
    typeof window !== "undefined" && Boolean(localStorage.getItem("access_token"));

  return useQuery({
    queryKey: customerCreditKeys.me,
    queryFn: async (): Promise<MyCreditData> => {
      const response = await api.get("/customer/me/credit");
      return (
        response.data.data || {
          creditRemaining: 0,
          payableRemaining: 0,
          isCreditPerson: true,
          blacklist: false,
        }
      );
    },
    enabled: hasToken,
    staleTime: 0,
    refetchOnMount: "always",
  });
}
