import { PriceTier, UomConversion, WholesaleTier } from "../pages/products/types";

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

// Unit တစ်ခုနှင့် ကိုက်ညီသော wholesale tier များကို စိစစ်ပြီး minQty အစဉ်လိုက် စီသည်
function getMatchingTiersForUnit(
  unit: string,
  baseUnit: string,
  wholesalePrices: { unit?: string | null; quantity: number; price: number }[] = [],
): WholesaleTier[] {
  const targetNorm = normalize(unit);
  const baseNorm = normalize(baseUnit);

  const matched = wholesalePrices.filter((wp) => {
    if (!wp || typeof wp.price !== "number" || wp.price <= 0) return false;
    const qty = Number(wp.quantity);
    if (!qty || qty <= 0) return false;

    const wpUnitNorm = normalize(wp.unit);
    if (wpUnitNorm) {
      return wpUnitNorm === targetNorm;
    }
    // Unit မပါလျှင် base unit နှင့်သာ ကိုက်ညီသည်
    return targetNorm === baseNorm;
  });

  // minQty ငယ်ရာမှ ကြီးရာ စီပြီး minQty ထပ်နေလျှင် ဖယ်သည် (နောက်ဆုံးတန်ဖိုးကို ယူသည်)
  matched.sort((a, b) => Number(a.quantity) - Number(b.quantity));
  const tierMap = new Map<number, number>();
  for (const t of matched) {
    tierMap.set(Number(t.quantity), Number(t.price));
  }

  return Array.from(tierMap.entries())
    .map(([minQty, price]) => ({ minQty, price }))
    .sort((a, b) => a.minQty - b.minQty);
}

// Unit အလိုက်စျေးစာရင်း — base unit (အငယ်ဆုံး) ကို မပြဘဲ factor ငယ်ရာမှ ကြီးရာ စီသည်
// Conversion unit မရှိသော product တွင် base unit တစ်ခုတည်းကို fallback အဖြစ် ပြသည်
// Unit တစ်ခုချင်းစီအတွက် ကိုက်ညီသော wholesale tier များကို တွဲပေးသည်
export function buildUnitPrices(
  baseUnit: string,
  sellingPrice: number,
  conversions: UomConversion[] = [],
  wholesalePrices: { unit?: string | null; quantity: number; price: number }[] = [],
): PriceTier[] {
  const units = conversions
    .filter((c) => c.unit && normalize(c.unit) !== normalize(baseUnit))
    .map((c) => ({ unit: c.unit, factor: getEffectiveFactor(baseUnit, c.unit, conversions) }))
    .filter((u) => u.factor > 0)
    .sort((a, b) => a.factor - b.factor);

  if (units.length === 0) {
    const wholesaleTiers = getMatchingTiersForUnit(baseUnit, baseUnit, wholesalePrices);
    return [
      {
        unit: baseUnit,
        quantity: 1,
        price: sellingPrice,
        ...(wholesaleTiers.length > 0 ? { wholesaleTiers } : {}),
      },
    ];
  }

  return units.map((u) => {
    const wholesaleTiers = getMatchingTiersForUnit(u.unit, baseUnit, wholesalePrices);
    return {
      unit: u.unit,
      quantity: 1,
      price: sellingPrice * u.factor,
      ...(wholesaleTiers.length > 0 ? { wholesaleTiers } : {}),
    };
  });
}
