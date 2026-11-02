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

// Unit အလိုက်စျေးစာရင်း — visibleUnits သတ်မှတ်ထားပါက ထို unit များကိုသာ factor အစဉ်လိုက် စီ၍ ပြသည်
// visibleUnits မပါရှိပါက default အတိုင်း conversion များကိုသာ ပြပြီး (base unit ဖျောက်သည်)၊ conversion မရှိမှ base unit ကို ပြသည်
// Unit တစ်ခုချင်းစီအတွက် ကိုက်ညီသော wholesale tier များကို တွဲပေးသည်
export function buildUnitPrices(
  baseUnit: string,
  sellingPrice: number,
  conversions: UomConversion[] = [],
  wholesalePrices: { unit?: string | null; quantity: number; price: number }[] = [],
  visibleUnits?: string[],
): PriceTier[] {
  // visibleUnits သတ်မှတ်ထားပြီး အနည်းဆုံး unit ၁ ခု ပါရှိပါက ထို unit များကိုသာ ဖော်ပြသည်
  if (visibleUnits && visibleUnits.length > 0) {
    const baseNorm = normalize(baseUnit);
    const visibleNorms = new Set(visibleUnits.map(normalize));

    const candidateUnits: { unit: string; factor: number }[] = [];

    // Base unit ပါဝင်ပါက factor 1 ဖြင့် ထည့်သွင်းသည်
    if (visibleNorms.has(baseNorm)) {
      candidateUnits.push({ unit: baseUnit, factor: 1 });
    }

    // Conversions ထဲမှ ပါဝင်သော unit များကို ထည့်သွင်းသည်
    for (const c of conversions) {
      if (!c.unit) continue;
      const cNorm = normalize(c.unit);
      if (visibleNorms.has(cNorm) && !candidateUnits.some((cu) => normalize(cu.unit) === cNorm)) {
        const factor = getEffectiveFactor(baseUnit, c.unit, conversions);
        if (factor > 0) {
          candidateUnits.push({ unit: c.unit, factor });
        }
      }
    }

    // Factor ငယ်ရာမှ ကြီးရာ အစဉ်လိုက် စီသည်
    candidateUnits.sort((a, b) => a.factor - b.factor);

    if (candidateUnits.length > 0) {
      return candidateUnits.map((u) => {
        const wholesaleTiers = getMatchingTiersForUnit(u.unit, baseUnit, wholesalePrices);
        return {
          unit: u.unit,
          quantity: 1,
          price: sellingPrice * u.factor,
          ...(wholesaleTiers.length > 0 ? { wholesaleTiers } : {}),
        };
      });
    }
  }

  // Fallback / Default rule (visibleUnits မပါရှိခြင်း သို့မဟုတ် မကိုက်ညီခြင်း)
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
