import { PriceTier, UomConversion } from "../pages/products/types";

const normalize = (unit?: string | null) => (unit || "").trim().toLowerCase();

// Base unit မှ target unit သို့ factor (convertFrom chain ပါ တွက်သည်)
export function getEffectiveFactor(
  baseUnit: string,
  targetUnit: string,
  conversions: UomConversion[] = [],
  visited: Set<string> = new Set(),
): number {
  const base = normalize(baseUnit);
  const target = normalize(targetUnit);
  if (!target || target === base) return 1;
  if (visited.has(target)) return 1;
  visited.add(target);

  const conv = conversions.find((c) => normalize(c.unit) === target);
  if (!conv) return 1;
  if (conv.convertFrom && normalize(conv.convertFrom) !== base) {
    return conv.factor * getEffectiveFactor(baseUnit, conv.convertFrom, conversions, visited);
  }
  return conv.factor;
}

// Unit အလိုက်စျေးစာရင်း — base unit (အငယ်ဆုံး) ကို မပြဘဲ factor ငယ်ရာမှ ကြီးရာ စီသည်
// Conversion unit မရှိသော product တွင် base unit တစ်ခုတည်းကို fallback အဖြစ် ပြသည်
export function buildUnitPrices(
  baseUnit: string,
  sellingPrice: number,
  conversions: UomConversion[] = [],
): PriceTier[] {
  const units = conversions
    .filter((c) => c.unit && normalize(c.unit) !== normalize(baseUnit))
    .map((c) => ({ unit: c.unit, factor: getEffectiveFactor(baseUnit, c.unit, conversions) }))
    .filter((u) => u.factor > 0)
    .sort((a, b) => a.factor - b.factor);

  if (units.length === 0) {
    return [{ unit: baseUnit, quantity: 1, price: sellingPrice }];
  }
  return units.map((u) => ({ unit: u.unit, quantity: 1, price: sellingPrice * u.factor }));
}
