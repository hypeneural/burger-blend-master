import type { CategoryFunction, Cut, GrindPass, GrindSize, RecommendedRole } from "@/data/cuts";

const functionLabels: Record<CategoryFunction, string> = {
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
  fine: 'fina',
  medium: 'media',
  coarse: 'grossa',
};

const grindPassLabels: Record<GrindPass, string> = {
  single: 'simples',
  double: 'dupla',
};

export const formatCutFunction = (cut: Cut) => functionLabels[cut.categoryFunction];

export const formatCutFatRange = (cut: Cut) =>
  `${cut.fatPercentRange.min}-${cut.fatPercentRange.max}% (padrao ${cut.fatPercentRange.default}%)`;

export const formatCutRoles = (cut: Cut) =>
  cut.recommendedRoles.map((role) => roleLabels[role]).join(', ');

export const formatGrindRecommendation = (cut: Cut) =>
  `Moagem ${grindSizeLabels[cut.grindRecommendation.size]} (${grindPassLabels[cut.grindRecommendation.passes]})`;
