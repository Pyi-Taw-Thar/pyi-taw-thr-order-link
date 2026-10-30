import { ArrowLeft, ArrowUpDown, RefreshCw } from "lucide-react";
import { useState, useMemo, useRef, useLayoutEffect, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useAllProductsInfinite } from "../services/productQueries";
import ProductRow from "./products/ProductRow";
import SearchHeader from "../components/SearchHeader";
import { useProductRowActions } from "./products/useProductRowActions";
import Skeleton from "../components/Skeleton";

// Module-level cache — detail page သို့ သွားပြီး back ပြန်လာပါက scroll အမြင့် မလွဲစေရန် တိုင်းပြီးသော element measurements များကို သိမ်းသည်
const measurementsCacheMap = new Map<"asc" | "desc", unknown[]>();

export default function AllProducts() {
  const navigate = useNavigate();
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  // Infinite query ဖြင့် ပစ္စည်းများအား ၂၀ စီ စနစ်တကျ pagination ဆွဲသည်
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useAllProductsInfinite(sortDir);

  const {
    expandedProductId,
    selectedVariantIndex,
    quantities,
    toggleProduct,
    setSelectedVariantIndex,
    updateQuantity,
    setQuantityValue,
    getProductCartQty,
    cartQtyByUnitMap,
    handleAddToCart,
  } = useProductRowActions();

  // Pages များထဲမှ ပစ္စည်းအားလုံးကို စုစည်းသည်
  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const totalItemsCount = data?.pages[0]?.pagination?.totalItems ?? allProducts.length;

  // Header / ခေါင်းစဉ်တို့၏ အမြင့် offsetTop ကို တိုင်းတာပြီး virtualizer ၏ scrollMargin အဖြစ် သတ်မှတ်သည်
  useLayoutEffect(() => {
    if (listRef.current) {
      setScrollMargin(listRef.current.offsetTop);
    }
  }, []);

  // Window-based virtualization ကို အသုံးပြုသည်
  const virtualizer = useWindowVirtualizer({
    count: allProducts.length,
    estimateSize: () => 88, // Collapsed row + margin ခန့်မှန်းခြေ
    overscan: 6,
    scrollMargin,
    initialMeasurementsCache: (measurementsCacheMap.get(sortDir) as any) ?? undefined,
  });

  // Unmount တွင် measurements cache ကို သိမ်းဆည်းသည်
  useEffect(() => {
    return () => {
      if (virtualizer.measurementsCache) {
        measurementsCacheMap.set(sortDir, [...virtualizer.measurementsCache]);
      }
    };
  }, [sortDir, virtualizer.measurementsCache]);

  const virtualItems = virtualizer.getVirtualItems();

  // Infinite scroll trigger: နောက်ဆုံး virtual item သည် loaded - 5 ရောက်ရှိပြီး နောက် page ရှိပါက ကြိုတင် ဆွဲယူသည်
  useEffect(() => {
    if (virtualItems.length === 0) return;
    const lastItem = virtualItems[virtualItems.length - 1];

    if (
      lastItem.index >= allProducts.length - 5 &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isError // Error ဖြစ်နေပါက auto loop မဖြစ်စေရန် စောင့်ဆိုင်းသည်
    ) {
      fetchNextPage();
    }
  }, [virtualItems, allProducts.length, hasNextPage, isFetchingNextPage, isError, fetchNextPage]);

  // Sort ပြောင်းလဲသည့်အခါ
  const handleToggleSort = () => {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="bg-[#f8f9fa] max-w-3xl mx-auto min-h-screen pb-20 font-ChivoMono">
      <SearchHeader />

      <div className="px-4 py-6 space-y-6">
        {/* Header bar */}
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBack}
                aria-label="နောက်သို့ ပြန်သွားမည်"
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2 text-[14px] md:text-2xl font-bold text-primary">
                <span>ပစ္စည်းအားလုံး</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-10">
              <p className="text-gray-500 text-[10px] md:text-[16px]">
                ဆေးဝါး{" "}
                <span className="font-bold text-gray-800">
                  {isLoading ? "..." : totalItemsCount}
                </span>{" "}
                မျိုး
              </p>
            </div>
          </div>

          {/* A → Z ⇄ Z → A ပြောင်းရန် ခလုတ် */}
          <button
            type="button"
            onClick={handleToggleSort}
            aria-label={
              sortDir === "asc"
                ? "ဆေးနာမည် A မှ Z စီထားသည် — Z မှ A သို့ ပြောင်းရန်"
                : "ဆေးနာမည် Z မှ A စီထားသည် — A မှ Z သို့ ပြောင်းရန်"
            }
            className="shrink-0 min-h-[44px] inline-flex items-center gap-1.5 whitespace-nowrap px-3.5 rounded-full border border-gray-200 bg-white text-[12px] md:text-[14px] font-bold text-gray-700 hover:border-blue-300 hover:text-primary focus-visible:ring-2 focus-visible:ring-blue-500 outline-none transition-colors"
          >
            {sortDir === "asc" ? "A → Z" : "Z → A"}
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* ပထမအကြိမ် စတင် Loading ပြသမှု */}
        {isLoading && (
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <Skeleton className="h-4 w-1/4 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ပထမအကြိမ် Error ပြသမှု */}
        {!isLoading && isError && allProducts.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center space-y-4 border border-red-100 shadow-sm">
            <p className="text-red-500 font-medium text-sm md:text-base">
              {(error as any)?.message || "ပစ္စည်းများ ရယူ၍ မရနိုင်ပါ။ ခဏနေ ပြန်ကြိုးစားပါ။"}
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              ပြန်ကြိုးစားမယ်
            </button>
          </div>
        )}

        {/* ပစ္စည်း ၀ ခု Empty state */}
        {!isLoading && !isError && allProducts.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center space-y-2 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700">ဆေးဝါးများ မရှိသေးပါ</h3>
            <p className="text-sm text-gray-500">လက်ရှိတွင် စာရင်းသွင်းထားသော ပစ္စည်း မရှိသေးပါ။</p>
          </div>
        )}

        {/* Virtualized ပစ္စည်းစာရင်း Container */}
        {allProducts.length > 0 && (
          <div
            ref={listRef}
            role="list"
            aria-label="ပစ္စည်းစာရင်း"
            className="w-full relative"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {virtualItems.map((virtualRow) => {
              const product = allProducts[virtualRow.index];
              if (!product) return null;

              return (
                <div
                  key={product.id}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  role="listitem"
                  className="w-full pb-3 md:pb-4"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                  }}
                >
                  <ProductRow
                    product={product}
                    expanded={expandedProductId === product.id}
                    selectedVariantIndex={
                      expandedProductId === product.id ? selectedVariantIndex : 0
                    }
                    quantity={quantities[product.id] ?? 1}
                    cartQty={getProductCartQty(product.id)}
                    cartQtyByUnit={cartQtyByUnitMap[product.id] || {}}
                    onToggle={() => toggleProduct(product.id)}
                    onVariantSelect={setSelectedVariantIndex}
                    onQuantityDelta={(delta) => updateQuantity(product.id, delta)}
                    onQuantityChange={(value) => setQuantityValue(product.id, value)}
                    onAddToCart={() => handleAddToCart(product)}
                    onNavigate={() =>
                      navigate(`/product/${product.id}`, { state: { product } })
                    }
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Infinite Scroll Footer / Status Indicators (Virtual container အပြင်ဘက်တွင် ထားရှိသည်) */}
        {allProducts.length > 0 && (
          <div className="pt-4 pb-8 text-center">
            {/* နောက် page ဆွဲနေဆဲ Loading Skeletons */}
            {isFetchingNextPage && (
              <div className="space-y-3 md:space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 w-3/4 rounded" />
                        <div className="h-3 bg-gray-200 w-1/2 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* နောက် page ဆွဲရာတွင် Error ဖြစ်ပေါ်မှုနှင့် Retry ခလုတ် */}
            {isError && !isFetchingNextPage && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center space-y-2 my-2">
                <p className="text-red-600 text-sm font-medium">ဆက်ဆွဲ၍ မရပါ</p>
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  className="inline-flex items-center gap-1.5 bg-red-600 text-white px-4 py-1.5 rounded-xl text-xs md:text-sm font-bold shadow hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  ပြန်ကြိုးစားမယ်
                </button>
              </div>
            )}

            {/* Fallback Manual Button: hasNextPage ရှိနေသရွေ့ အသုံးပြုသူ ကိုယ်တိုင် နှိပ်၍ ဆွဲနိုင်စေရန် ပြသသည် */}
            {hasNextPage && !isFetchingNextPage && !isError && (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:border-blue-300 hover:text-primary shadow-sm transition-all"
              >
                နောက်ထပ် ကြည့်မယ်
              </button>
            )}

            {/* ပစ္စည်းအားလုံး အဆုံးရောက်ရှိခြင်း */}
            {!hasNextPage && (
              <p className="text-gray-400 text-xs md:text-sm font-medium py-2">
                ပစ္စည်းအားလုံး ပြပြီးပါပြီ
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
