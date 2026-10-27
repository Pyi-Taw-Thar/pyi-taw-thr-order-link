import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import ProductCard from "./ProductCard";
import Skeleton from "./Skeleton";

import { ApiProductItem, Product } from "../pages/products/types";
import { mapApiProduct } from "../utils/mapProduct";

// Card ပေါ်တွင် ပြမည့်စျေး — base unit မပြသဖြင့် ပထမ unit စျေးကို သုံးသည်
type LimitedProduct = Product & { price: number };

export default function LimitedSaleSection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<LimitedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLimitedProducts = async () => {
      try {
        const response = await api.get("/ecommerce/products", {
          params: { limitedOnly: true },
        });
        const items: ApiProductItem[] = response.data.data;
        const mapped = items.slice(0, 8).map((item) => {
          const product = mapApiProduct(item);
          return { ...product, price: product.prices[0]?.price ?? 0 };
        });
        setProducts(mapped);
      } catch (error) {
        console.error("Error fetching limited products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLimitedProducts();
  }, []);

  if (products.length === 0 && !loading) return null;

  return (
    <section className="container mx-auto py-8 md:py-20 bg-white font-ChivoMono">
      <div className="px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-primary-dark text-[20px] md:text-2xl font-semibold">
              အကန့်အသတ်ဖြင့်ရောင်းချသောဆေးများ
            </h2>
            <p className="text-gray-600 text-[10px] md:text-lg mt-1">
              အရေအတွက် အကန့်အသတ်ဖြင့်သာ ဝယ်ယူလို့ရသောဆေးများ
            </p>
          </div>
          {!loading && (
            <button
              onClick={() => navigate("/limited-products")}
              className="border-2 border-primary text-primary px-4 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center gap-1 text-sm whitespace-nowrap"
            >
              ကြည့်မယ်
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg px-3 py-6 md:px-6 md:py-8 flex flex-col justify-between space-y-4 border border-transparent"
              >
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))
            : products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                data={product}
                showBadge
                showPrice
                unit={product.prices[0]?.unit}
                maxPerUser={product.maxPerUser}
                baseUnit={product.baseUnit}
                isOutOfStock={product.isOutOfStock}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
