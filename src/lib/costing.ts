import { getCutForIngredient, getIngredientById } from "@/data/ingredients";
import type { BlendIngredient } from "@/data/presets";
import type { BlendExtra } from "@/types/blend";
import { calculateBaseWeight, calculateExtrasWeight } from "@/lib/blendMath";

export interface CostItem {
  id: string;
  name: string;
  grams: number;
  pricePerKg: number;
  cost: number;
  kind: "ingredient" | "extra";
}

export interface CostSummary {
  items: CostItem[];
  totalCost: number;
  totalWeight: number;
  costPerKg: number;
  costPerBurger: number;
}

export type PriceOverrides = Record<string, number>;

export const getDefaultPricePerKg = (ingredientId: string) => {
  const ingredient = getIngredientById(ingredientId);
  if (!ingredient) return 0;
  const cut = getCutForIngredient(ingredientId);
  if (cut?.avgPriceBrlKg) return cut.avgPriceBrlKg;
  return ingredient.avgPriceBrlKg ?? 0;
};

export const resolvePricePerKg = (
  ingredientId: string,
  overrides?: PriceOverrides,
) => {
  const override = overrides?.[ingredientId];
  if (typeof override === "number" && override > 0) return override;
  return getDefaultPricePerKg(ingredientId);
};

const toCost = (grams: number, pricePerKg: number) => (grams / 1000) * pricePerKg;

export const calculateBlendCost = (
  ingredients: BlendIngredient[],
  extras: BlendExtra[],
  burgerCount: number,
  burgerWeight: number,
  overrides?: PriceOverrides,
): CostSummary => {
  const baseWeight = calculateBaseWeight(burgerCount, burgerWeight);
  const extrasWeight = calculateExtrasWeight(extras);
  const totalWeight = baseWeight + extrasWeight;

  const items: CostItem[] = [];

  ingredients.forEach((item) => {
    const ingredient = getIngredientById(item.ingredientId);
    if (!ingredient) return;
    const grams = (item.percentage / 100) * baseWeight;
    const pricePerKg = resolvePricePerKg(item.ingredientId, overrides);
    items.push({
      id: item.ingredientId,
      name: ingredient.name,
      grams,
      pricePerKg,
      cost: toCost(grams, pricePerKg),
      kind: "ingredient",
    });
  });

  extras.forEach((extra) => {
    const ingredient = getIngredientById(extra.ingredientId);
    if (!ingredient) return;
    const pricePerKg = resolvePricePerKg(extra.ingredientId, overrides);
    items.push({
      id: extra.ingredientId,
      name: ingredient.name,
      grams: extra.grams,
      pricePerKg,
      cost: toCost(extra.grams, pricePerKg),
      kind: "extra",
    });
  });

  const totalCost = items.reduce((sum, item) => sum + item.cost, 0);
  const costPerKg = totalWeight > 0 ? totalCost / (totalWeight / 1000) : 0;
  const costPerBurger = burgerCount > 0 ? totalCost / burgerCount : 0;

  return { items, totalCost, totalWeight, costPerKg, costPerBurger };
};

export const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
