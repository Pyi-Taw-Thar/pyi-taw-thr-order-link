import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import ProductCard from "./ProductCard";

interface LimitedProduct {
  id: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  code: string;
  prices: { unit: string; quantity: string; price: number }[];
}

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
        const items = response.data.data;
        const mapped = items.slice(0, 8).map((item: any) => {
          const p = item.product;
          return {
            id: p._id,
            name: p.productName,
            price: p.sellingPrice,
            brand: p.brand,
            category: p.category || 'အထွေထွေ',
            code: p.productCode,
            prices: [
              { unit: p.unitOfMeasure, quantity: p.unitOfMeasure, price: p.sellingPrice },
              ...(p.wholesalePrices || []).map((w: any) => ({
                unit: w.unit,
                quantity: w.unit,
                price: w.price,
              })),
            ],
          };
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

  if (loading || products.length === 0) return null;

  return (
    <section className="bg-white font-ChivoMono">
      <div className="container mx-auto py-8 md:py-20 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-primary-dark text-[20px] md:text-2xl font-semibold">
              အကန့်သတ်ရသောဆေးများ
            </h2>
            <p className="text-gray-600 text-[10px] md:text-lg mt-1">
              အရေအတွက် အကန့်အသန့်ဖြင့်သာ ဝယ်ယူလို့ရသောဆေးများ
            </p>
          </div>
          <button
            onClick={() => navigate("/limited-products")}
            className="border-2 border-primary text-primary px-4 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center gap-1 text-sm whitespace-nowrap"
          >
            ကြည့်မယ်
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              data={product}
              showBadge
            />
          ))}
        </div>
      </div>
    </section>
  );
}
