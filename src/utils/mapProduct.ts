import { ApiProductItem, Product } from "../pages/products/types";
import { buildUnitPrices } from "./uom";

// Backend ၏ /ecommerce/products item ကို UI တွင်သုံးမည့် Product ပုံစံသို့ ပြောင်းသည်
export function mapApiProduct(item: ApiProductItem): Product {
  const p = item.product;
  return {
    id: p._id,
    name: p.productName,
    brand: p.brand,
    category: p.category || "အထွေထွေ",
    code: p.productCode,
    chemicalNames: p.chemicalNames || [],
    images: p.images || [],
    quantity: item.quantity ?? 0,
    isOutOfStock: (item.quantity ?? 0) <= 0,
    baseUnit: p.unitOfMeasure,
    maxPerUser: p.ecommerceMaxPerUser ?? null,
    // Unit အလိုက် လက်လီစျေးနှင့် wholesale tier များကို တွက်ချက်သည်
    prices: buildUnitPrices(p.unitOfMeasure, p.sellingPrice, p.uomConversions, p.wholesalePrices),
  };
}
