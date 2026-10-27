export interface PriceTier {
  unit: string;
  quantity: number;
  price: number;
}

export interface ProductImage {
  url: string;
  key?: string;
}

export interface UomConversion {
  unit: string;
  factor: number;
  convertFrom?: string | null;
}

export interface Product {
  id: string;
  name: string;
  prices: PriceTier[];
  brand?: string;
  category?: string;
  code?: string;
  chemicalNames?: string[];
  images?: ProductImage[];
  quantity?: number;
  isOutOfStock?: boolean;
  baseUnit?: string;
  // တစ်ယောက်လျှင် ဝယ်ခွင့် (base unit ဖြင့်; customer tier multiplier မပါ)
  maxPerUser?: number | null;
}

export interface ApiProductItem {
  _id: string;
  quantity: number;
  product: {
    _id: string;
    productName: string;
    productCode: string;
    SKU: string;
    category: string;
    brand: string;
    chemicalNames?: string[];
    unitOfMeasure: string;
    sellingPrice: number;
    uomConversions?: UomConversion[];
    wholesalePrices: { unit: string; quantity: number; price: number }[];
    images: ProductImage[];
    ecommerceMaxPerUser?: number | null;
  };
}
