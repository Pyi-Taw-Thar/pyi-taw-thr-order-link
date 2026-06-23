import { PriceTier } from "../pages/products/types";

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
