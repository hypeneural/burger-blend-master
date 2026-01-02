import { getIngredientById } from "@/data/ingredients";
import type { BlendIngredient } from "@/data/presets";
import type { BlendExtra } from "@/types/blend";

export const calculateBaseWeight = (burgerCount: number, burgerWeight: number) =>
  burgerCount * burgerWeight;

export const calculateExtrasWeight = (extras: BlendExtra[]) =>
  extras.reduce((sum, extra) => sum + extra.grams, 0);

export const calculateTotalWeight = (
  burgerCount: number,
  burgerWeight: number,
  extras: BlendExtra[],
) => calculateBaseWeight(burgerCount, burgerWeight) + calculateExtrasWeight(extras);

export const calculateFatPercentage = (
  ingredients: BlendIngredient[],
  extras: BlendExtra[],
  burgerCount: number,
  burgerWeight: number,
) => {
  const { totalFatGrams, totalWeight } = calculateFatTotals(
    ingredients,
    extras,
    burgerCount,
    burgerWeight,
  );

  if (totalWeight <= 0) return 0;
  return Math.round((totalFatGrams / totalWeight) * 100);
};

export const calculateFatTotals = (
  ingredients: BlendIngredient[],
  extras: BlendExtra[],
  burgerCount: number,
  burgerWeight: number,
) => {
  const baseWeight = calculateBaseWeight(burgerCount, burgerWeight);
  const extrasWeight = calculateExtrasWeight(extras);
  const totalWeight = baseWeight + extrasWeight;

  let totalFatGrams = 0;

  ingredients.forEach((item) => {
    const ingredient = getIngredientById(item.ingredientId);
    if (!ingredient) return;
    const weight = (item.percentage / 100) * baseWeight;
    totalFatGrams += (ingredient.fatPercentage / 100) * weight;
  });

  extras.forEach((extra) => {
    const ingredient = getIngredientById(extra.ingredientId);
    if (!ingredient) return;
    totalFatGrams += (ingredient.fatPercentage / 100) * extra.grams;
  });

  return { baseWeight, extrasWeight, totalWeight, totalFatGrams };
};

const roundMacro = (value: number) => Math.round(value * 10) / 10;

export const calculateNutritionPerBurger = (
  ingredients: BlendIngredient[],
  extras: BlendExtra[],
  burgerCount: number,
  burgerWeight: number,
) => {
  const baseWeight = calculateBaseWeight(burgerCount, burgerWeight);
  const extrasWeight = calculateExtrasWeight(extras);
  const totalWeight = baseWeight + extrasWeight;

  if (burgerCount <= 0 || totalWeight <= 0) {
    return { calories: 0, protein: 0, fat: 0, perBurgerWeight: 0 };
  }

  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;

  ingredients.forEach((item) => {
    const ingredient = getIngredientById(item.ingredientId);
    if (!ingredient) return;
    const weight = (item.percentage / 100) * baseWeight;
    const factor = weight / 100;
    totalProtein += ingredient.nutrition.protein * factor;
    totalFat += ingredient.nutrition.fat * factor;
    totalCarbs += (ingredient.nutrition.carbs ?? 0) * factor;
  });

  extras.forEach((extra) => {
    const ingredient = getIngredientById(extra.ingredientId);
    if (!ingredient) return;
    const factor = extra.grams / 100;
    totalProtein += ingredient.nutrition.protein * factor;
    totalFat += ingredient.nutrition.fat * factor;
    totalCarbs += (ingredient.nutrition.carbs ?? 0) * factor;
  });

  const perBurgerProtein = totalProtein / burgerCount;
  const perBurgerFat = totalFat / burgerCount;
  const perBurgerCarbs = totalCarbs / burgerCount;
  const calories = Math.round(perBurgerProtein * 4 + perBurgerCarbs * 4 + perBurgerFat * 9);

  return {
    calories,
    protein: roundMacro(perBurgerProtein),
    fat: roundMacro(perBurgerFat),
    perBurgerWeight: totalWeight / burgerCount,
  };
};

export const formatWeight = (grams: number, decimals = 1) => {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(decimals)}kg`;
  }
  return `${Math.round(grams)}g`;
};
