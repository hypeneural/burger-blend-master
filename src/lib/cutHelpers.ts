import type { Cut } from "@/data/cuts";
import type {
  CollagenLevel,
  CostTier,
  CutFunction,
  FatType,
  GrindPass,
  GrindSize,
  MeltingProfile,
  OxidationRate,
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

const collagenLabels: Record<CollagenLevel, string> = {
  LOW: 'baixo',
  MEDIUM: 'medio',
  HIGH: 'alto',
};

const oxidationLabels: Record<OxidationRate, string> = {
  LOW: 'estavel',
  MEDIUM: 'media',
  HIGH: 'rapida',
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

export const formatCollagenLevel = (cut: Cut) => collagenLabels[cut.collagenLevel];

export const formatOxidationRate = (cut: Cut) => oxidationLabels[cut.oxidationRate];

export const formatMaillardPotential = (cut: Cut) => {
  const value = Math.max(0, Math.min(10, Math.round(cut.maillardPotential)));
  if (value >= 8) return `alto (${value}/10)`;
  if (value >= 5) return `medio (${value}/10)`;
  return `baixo (${value}/10)`;
};

export const getCutDynamicTips = (cut: Cut) => {
  const tips: string[] = [];
  if (cut.oxidationRate === 'HIGH') {
    tips.push('Oxida rapido: moa e use na hora.');
  }
  if (cut.collagenLevel === 'HIGH') {
    tips.push('Colageno alto: moagem dupla ajuda.');
  }
  if (cut.fatType === 'SOFT') {
    tips.push('Gordura mole: derrete rapido na grelha.');
  }
  if (cut.fatType === 'HARD') {
    tips.push('Gordura dura: aguenta calor alto.');
  }
  if (cut.maillardPotential >= 8) {
    tips.push('Crosta forte na chapa.');
  }
  return tips;
};

export const getPrepStyleWarnings = (cut: Cut, prepStyle?: string) => {
  if (!prepStyle) return [];
  const style = prepStyle.toLowerCase();
  const isGrill =
    style.includes('grelha') || style.includes('churrasqueira') || style.includes('carvao');
  const isGriddle = style.includes('chapa') || style.includes('frigideira');
  const isSmash = style.includes('smash');
  const warnings: string[] = [];

  if (isGrill && cut.fatType === 'SOFT') {
    warnings.push('Na grelha: gordura mole derrete rapido e pode pingar.');
  }
  if (isGrill && cut.fatType === 'PURE') {
    warnings.push('Na grelha: use zona indireta para evitar labaredas.');
  }
  if (isGriddle && cut.collagenLevel === 'HIGH') {
    warnings.push('Chapa quente: moa bem para evitar nervos.');
  }
  if (isSmash && cut.fatPercentRange.default < 15) {
    warnings.push('Smash pede gordura extra para formar crosta.');
  }
  if (cut.oxidationRate === 'HIGH' && (isGrill || isGriddle)) {
    warnings.push('Oxida rapido: moa e use na hora.');
  }

  return warnings;
};
