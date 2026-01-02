import { cuts, type Cut } from "@/data/cuts";
import { ingredients, getIngredientById } from "@/data/ingredients";
import type { BlendIngredient } from "@/data/presets";
import type { PriceOverrides } from "@/lib/costing";
import { resolvePricePerKg } from "@/lib/costing";

export interface CutSwapSuggestion {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  fatDeltaGrams: number;
  fatDeltaPercent: number;
  costDeltaKg: number;
  costDeltaBlend: number;
  reason: string;
}

const findIngredientForCut = (cutId: string) =>
  ingredients.find((ingredient) => ingredient.cutId === cutId);

const resolveCutPrice = (ingredientId: string, overrides?: PriceOverrides) =>
  resolvePricePerKg(ingredientId, overrides);

const buildReason = (fatDeltaPercent: number, costDeltaKg: number) => {
  const notes: string[] = [];
  if (Math.abs(fatDeltaPercent) <= 3) {
    notes.push("gordura parecida");
  } else if (fatDeltaPercent < 0) {
    notes.push("mais magra");
  } else {
    notes.push("mais gordurosa");
  }
  if (costDeltaKg < 0) {
    notes.push("economiza no kg");
  } else if (costDeltaKg > 0) {
    notes.push("mais premium");
  } else {
    notes.push("custo equivalente");
  }
  return notes.join(" • ");
};

const scoreCandidate = (
  current: Cut,
  candidate: Cut,
  currentPrice: number,
  candidatePrice: number,
) => {
  const fatDiff = Math.abs(candidate.fatPercentRange.default - current.fatPercentRange.default);
  const costDiff = Math.abs(candidatePrice - currentPrice);
  let score = fatDiff * 3 + costDiff / 5;
  if (candidatePrice <= currentPrice * 1.02) score -= 1.5;
  if (fatDiff <= 3) score -= 1;
  return score;
};

const pickSwapCandidate = (current: Cut, overrides?: PriceOverrides) => {
  const currentIngredient = findIngredientForCut(current.id);
  if (!currentIngredient) return null;
  const currentPrice = resolveCutPrice(currentIngredient.id, overrides);
  const candidates = cuts
    .filter((cut) => cut.categoryFunction === current.categoryFunction && cut.id !== current.id)
    .map((candidate) => {
      const ingredient = findIngredientForCut(candidate.id);
      if (!ingredient) return null;
      const candidatePrice = resolveCutPrice(ingredient.id, overrides);
      return { candidate, ingredient, candidatePrice };
    })
    .filter(Boolean) as Array<{
    candidate: Cut;
    ingredient: { id: string; name: string };
    candidatePrice: number;
  }>;

  if (candidates.length === 0) return null;
  const scored = candidates
    .map((item) => ({
      ...item,
      score: scoreCandidate(current, item.candidate, currentPrice, item.candidatePrice),
      currentPrice,
    }))
    .sort((a, b) => a.score - b.score);
  return scored[0];
};

export const buildCutSwapSuggestions = (
  ingredientsList: BlendIngredient[],
  baseWeight: number,
  overrides?: PriceOverrides,
): CutSwapSuggestion[] => {
  return ingredientsList
    .map((item) => {
      const ingredient = getIngredientById(item.ingredientId);
      if (!ingredient || ingredient.category !== "bovine") return null;
      const currentCut = cuts.find((cut) => cut.id === ingredient.cutId);
      if (!currentCut || currentCut.id === "gordura-peito") return null;

      const candidatePick = pickSwapCandidate(currentCut, overrides);
      if (!candidatePick) return null;

      const portionWeight = (item.percentage / 100) * baseWeight;
      const currentFatPercent = currentCut.fatPercentRange.default;
      const candidateFatPercent = candidatePick.candidate.fatPercentRange.default;
      const fatDeltaPercent = candidateFatPercent - currentFatPercent;
      const fatDeltaGrams = (portionWeight * fatDeltaPercent) / 100;
      const costDeltaKg = candidatePick.candidatePrice - candidatePick.currentPrice;
      const costDeltaBlend = (portionWeight / 1000) * costDeltaKg;

      return {
        fromId: ingredient.id,
        toId: candidatePick.ingredient.id,
        fromName: ingredient.name,
        toName: candidatePick.ingredient.name,
        fatDeltaGrams,
        fatDeltaPercent,
        costDeltaKg,
        costDeltaBlend,
        reason: buildReason(fatDeltaPercent, costDeltaKg),
      };
    })
    .filter(Boolean) as CutSwapSuggestion[];
};
