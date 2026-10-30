import { PriceTier, WholesaleTier } from "../pages/products/types";

export interface TierState {
  price: number;
  retailPrice: number;
  current: WholesaleTier | null;
  next: WholesaleTier | null;
  remaining: number;
}

// Unit တစ်ခု၏ quantity အလိုက် သက်ရောက်မည့် ဈေးနှင့် tier အခြေအနေကို တွက်ချက်သည်
export function getTierState(tier: PriceTier, qty: number): TierState {
  const retailPrice = tier.price;
  const tiers = tier.wholesaleTiers || [];

  if (tiers.length === 0 || qty <= 0) {
    return {
      price: retailPrice,
      retailPrice,
      current: null,
      next: tiers.length > 0 ? tiers[0] : null,
      remaining: tiers.length > 0 ? Math.max(0, tiers[0].minQty - qty) : 0,
    };
  }

  // current: minQty <= qty ဖြစ်သော အမြင့်ဆုံး tier
  // next: minQty > qty ဖြစ်သော အနိမ့်ဆုံး tier
  let current: WholesaleTier | null = null;
  let next: WholesaleTier | null = null;

  for (const t of tiers) {
    if (t.minQty <= qty) {
      current = t;
    } else if (!next) {
      next = t;
    }
  }

  const price = current ? current.price : retailPrice;
  const remaining = next ? Math.max(0, next.minQty - qty) : 0;

  return {
    price,
    retailPrice,
    current,
    next,
    remaining,
  };
}

// ProductDetail အတွက် လက်ရှိ findBestTierIndex ကို ဆက်လက်ထားရှိသည်
export function findBestTierIndex(
  prices: PriceTier[],
  currentUnit: string,
  quantity: number
): number {
  if (quantity <= 0 || prices.length === 0) return 0;

  const sameUnitTiers = prices
    .map((p, i) => ({ ...p, index: i }))
    .filter((p) => p.unit === currentUnit)
    .sort((a, b) => b.quantity - a.quantity);

  const bestTier = sameUnitTiers.find((t) => t.quantity <= quantity);

  return bestTier ? bestTier.index : 0;
}
