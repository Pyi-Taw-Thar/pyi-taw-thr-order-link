import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./axios";
import { ApiProductItem, Product } from "../pages/products/types";
import { mapApiProduct } from "../utils/mapProduct";

// Product / brand / category data အတွက် query hook များ — page ပြန်ဝင်လျှင် cache မှ ချက်ချင်းပြ

export interface ProductQueryParams {
  brand?: string | null;
  subCategory?: string | null;
  search?: string | null;
  limitedOnly?: boolean;
  id?: string;
}

// undefined / null / "" တန်ဖိုးများ ဖယ် — query key နှင့် API params တူညီစေရန်
const cleanParams = (params: ProductQueryParams) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ) as ProductQueryParams;

export const productKeys = {
  all: ["products"] as const,
  list: (params: ProductQueryParams) => ["products", cleanParams(params)] as const,
  detail: (id: string) => ["product", id] as const,
};

const fetchProducts = async (params: ProductQueryParams): Promise<Product[]> => {
  const response = await api.get("/ecommerce/products", { params: cleanParams(params) });
  const items: ApiProductItem[] = response.data.data || [];
  return items.map(mapApiProduct);
};

export function useProducts(params: ProductQueryParams, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
    enabled: options.enabled ?? true,
  });
}

// List cache ထဲတွင် ထို product ရှိလျှင် detail ကို ချက်ချင်းပြ၍ နောက်ကွယ်တွင် အသစ်ယူ
export function useProduct(id: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: productKeys.detail(id ?? ""),
    queryFn: async () => {
      const list = await fetchProducts({ id });
      return list[0] ?? null;
    },
    enabled: Boolean(id),
    initialData: () => {
      if (!id) return undefined;
      for (const [, list] of queryClient.getQueriesData<Product[]>({ queryKey: productKeys.all })) {
        const found = list?.find((p) => p.id === id);
        if (found) return found;
      }
      return undefined;
    },
    // list မှ ယူထားသော data ဖြစ်၍ ချက်ချင်း stale သတ်မှတ် → detail API ဖြင့် အသစ်ပြန်စစ်
    initialDataUpdatedAt: 0,
  });
}

export function useBrands(subCategory?: string | null, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["brands", subCategory ?? null],
    queryFn: async (): Promise<string[]> => {
      const response = await api.get("/ecommerce/products/brands", {
        params: subCategory ? { subCategory } : undefined,
      });
      return response.data.data || [];
    },
    enabled: options.enabled ?? true,
  });
}

export function useSubCategories() {
  return useQuery({
    queryKey: ["subcategories"],
    queryFn: async (): Promise<string[]> => {
      const response = await api.get("/ecommerce/products/subcategories");
      return response.data.data || [];
    },
  });
}
