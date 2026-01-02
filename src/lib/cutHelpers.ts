import type { Cut } from "@/data/cuts";
import type {
  CostTier,
  CutFunction,
  FatType,
  GrindPass,
  GrindSize,
  MeltingProfile,
  RecommendedRole,
} from "@/data/constants";

const functionLabels: Record<CutFunction, string> = {
  STRUCTURE: 'Fundacao',
  FAT_JUICINESS: 'Suculencia',
  FLAVOR_TEXTURE: 'Sabor e textura',
};

const roleLabels: Record<RecommendedRole, string> = {
  base: 'base',
  booster: 'booster',
  'fat-source': 'fonte de gordura',
  luxury: 'luxo',
};

const grindSizeLabels: Record<GrindSize, string> = {
  FINE: 'fina',
  MEDIUM: 'media',
  COARSE: 'grossa',
};

const grindPassLabels: Record<GrindPass, string> = {
  SINGLE: 'simples',
  DOUBLE: 'dupla',
};

const costTierLabels: Record<CostTier, string> = {
  LOW: 'baixo',
  MEDIUM: 'medio',
  HIGH: 'alto',
  PREMIUM: 'premium',
};

const fatTypeLabels: Record<FatType, string> = {
  HARD: 'dura',
  SOFT: 'mole',
  MIXED: 'mista',
  PURE: 'pura',
};

const meltingLabels: Record<MeltingProfile, string> = {
  FAST: 'rapida',
  MEDIUM: 'media',
  SLOW: 'lenta',
};

export const formatCutFunction = (cut: Cut) => functionLabels[cut.categoryFunction];

export const formatCutFatRange = (cut: Cut) => {
  const { min, max, default: defaultValue } = cut.fatPercentRange;
  if (min === max) return `${defaultValue}%`;
  return `${min}-${max}% (padrao ${defaultValue}%)`;
};

export const formatCutRoles = (cut: Cut) =>
  cut.recommendedRoles.map((role) => roleLabels[role]).join(', ');

export const formatGrindRecommendation = (cut: Cut) => {
  if (!cut.grindRecommendation) return undefined;
  return `Moagem ${grindSizeLabels[cut.grindRecommendation.size]} (${grindPassLabels[cut.grindRecommendation.passes]})`;
};

export const formatCostTier = (cut: Cut) => costTierLabels[cut.costTier];

export const formatFatType = (cut: Cut) => fatTypeLabels[cut.fatType];

export const formatMeltingProfile = (cut: Cut) => meltingLabels[cut.meltingProfile];

export const formatCalories = (cut: Cut) => `${cut.caloriesPer100g} kcal/100g`;
