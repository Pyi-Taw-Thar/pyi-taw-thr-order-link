export interface PriceTier {
  unit: string;
  quantity: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  prices: PriceTier[];
  brand?: string;
  category?: string;
  code?: string;
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
    unitOfMeasure: string;
    sellingPrice: number;
    wholesalePrices: { unit: string; quantity: number; price: number }[];
    images: string[];
  };
}
