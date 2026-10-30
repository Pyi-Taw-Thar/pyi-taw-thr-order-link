import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
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
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedProductsResponse {
  items: Product[];
  pagination: PaginationMeta;
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
  allInfinite: (sortDir: "asc" | "desc") => ["products-all", sortDir] as const,
};

const fetchProducts = async (params: ProductQueryParams): Promise<Product[]> => {
  const response = await api.get("/ecommerce/products", { params: cleanParams(params) });
  const items: ApiProductItem[] = response.data.data || [];
  return items.map(mapApiProduct);
};

export const fetchAllProductsPage = async (
  page: number,
  sort: "asc" | "desc",
  limit = 20
): Promise<PaginatedProductsResponse> => {
  const response = await api.get("/ecommerce/products", {
    params: { page, limit, sort },
  });
  const rawItems: ApiProductItem[] = response.data.data || [];
  const items = rawItems.map(mapApiProduct);
  const pagination: PaginationMeta = response.data.pagination || {
    currentPage: page,
    totalPages: 1,
    totalItems: items.length,
    itemsPerPage: limit,
  };
  return { items, pagination };
};

export function useProducts(params: ProductQueryParams, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
    enabled: options.enabled ?? true,
  });
}

// ပစ္စည်းအားလုံး infinite scroll အတွက် သီးသန့် query hook — queryKey ကို ["products-all", sortDir] သီးသန့်ထားသည်
export function useAllProductsInfinite(sortDir: "asc" | "desc") {
  return useInfiniteQuery({
    queryKey: productKeys.allInfinite(sortDir),
    queryFn: ({ pageParam }) => fetchAllProductsPage(pageParam as number, sortDir, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // ၂ မိနစ် cache ထား၍ detail သွားပြီး back ပြန်လာလျှင် API ပြန်မခေါ်စေရန်
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
      // 1. ပုံမှန် ["products"] list cache များထဲတွင် ရှာဖွေခြင်း (Array.isArray guard ပါဝင်)
      for (const [, list] of queryClient.getQueriesData<Product[]>({ queryKey: productKeys.all })) {
        if (Array.isArray(list)) {
          const found = list.find((p) => p.id === id);
          if (found) return found;
        }
      }
      // 2. ["products-all"] infinite query cache ၏ pages ထဲတွင် ရှာဖွေခြင်း
      for (const [, infiniteData] of queryClient.getQueriesData<{ pages: PaginatedProductsResponse[] }>({
        queryKey: ["products-all"],
      })) {
        if (infiniteData?.pages && Array.isArray(infiniteData.pages)) {
          for (const page of infiniteData.pages) {
            if (page?.items && Array.isArray(page.items)) {
              const found = page.items.find((p) => p.id === id);
              if (found) return found;
            }
          }
        }
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
