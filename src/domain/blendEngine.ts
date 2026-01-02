import { getIngredientById } from "@/data/ingredients";
import type { BlendIngredient } from "@/data/presets";
import type { BlendExtra } from "@/types/blend";
import {
  calculateBaseWeight,
  calculateExtrasWeight,
  calculateFatTotals,
  formatWeight,
} from "@/lib/blendMath";

export interface TargetLockInput {
  ingredients: BlendIngredient[];
  extras: BlendExtra[];
  burgerCount: number;
  burgerWeight: number;
  target: number;
  roundingStep: number;
  fatSourceId: string;
}

export interface TargetLockResult {
  status: 'ok' | 'warning';
  warning?: string;
  recommendation?: string;
  suggestedGrams?: number;
}

const roundToStep = (value: number, step: number) => {
  if (step <= 0) return Math.round(value);
  return Math.round(value / step) * step;
};

export const getTargetLockSuggestion = ({
  ingredients,
  extras,
  burgerCount,
  burgerWeight,
  target,
  roundingStep,
  fatSourceId,
}: TargetLockInput): TargetLockResult => {
  const { totalWeight, totalFatGrams } = calculateFatTotals(
    ingredients,
    extras,
    burgerCount,
    burgerWeight,
  );
  const fatSource = getIngredientById(fatSourceId);
  const fatSourcePercent = fatSource ? fatSource.fatPercentage / 100 : 0;
  const targetDecimal = target / 100;
  const currentPercent = totalWeight > 0 ? Math.round((totalFatGrams / totalWeight) * 100) : 0;

  if (!fatSource) {
    return { status: 'warning', warning: 'Selecione uma fonte de gordura para calcular.' };
  }

  if (fatSourcePercent <= targetDecimal) {
    return {
      status: 'warning',
      warning: 'Essa fonte nao corrige o alvo porque tem gordura menor ou igual ao alvo.',
    };
  }

  if (totalWeight <= 0) {
    return { status: 'warning', warning: 'Defina o peso da receita para calcular o alvo.' };
  }

  const raw = (targetDecimal * totalWeight - totalFatGrams) / (fatSourcePercent - targetDecimal);
  if (raw < 0) {
    return {
      status: 'warning',
      warning: 'Voce ja passou do alvo. Reduza gordura ou aumente carne magra.',
    };
  }

  const suggestedGrams = Math.max(0, roundToStep(raw, roundingStep));
  const recommendation = `Voce escolheu alvo ${target}%. Sua mistura atual esta em ${currentPercent}%. Para chegar em ${target}%, precisamos adicionar ${formatWeight(suggestedGrams)} de ${fatSource.name} porque a formula equilibra a gordura total.`;

  return { status: 'ok', suggestedGrams, recommendation };
};

export interface SmartAlert {
  id: string;
  title: string;
  detail: string;
  reason: string;
}

export interface AlertThresholds {
  baseLowFat: number;
  baseHighFat: number;
  grillFlareFat: number;
  smashMinFat: number;
  airfryerMaxFat: number;
  fitMaxFat: number;
  tallMinFat: number;
  coxaoMinFat: number;
}

export const DEFAULT_ALERT_THRESHOLDS: AlertThresholds = {
  baseLowFat: 15,
  baseHighFat: 30,
  grillFlareFat: 28,
  smashMinFat: 22,
  airfryerMaxFat: 22,
  fitMaxFat: 16,
  tallMinFat: 20,
  coxaoMinFat: 20,
};

export const getSmartAlerts = (
  ingredients: BlendIngredient[],
  fatPercentage: number,
  prepStyle: string,
  burgerStyle: string,
  thresholds: Partial<AlertThresholds> = {},
): SmartAlert[] => {
  const config: AlertThresholds = { ...DEFAULT_ALERT_THRESHOLDS, ...thresholds };
  const alerts: SmartAlert[] = [];

  if (fatPercentage < config.baseLowFat) {
    alerts.push({
      id: 'low-fat',
      title: 'Risco de ressecamento',
      detail: 'Blend com pouca gordura tende a ficar seco.',
      reason: `A gordura retenciona umidade e ajuda na textura. Abaixo de ${config.baseLowFat}% o burger perde suculencia.`,
    });
  }

  if (fatPercentage > config.baseHighFat) {
    alerts.push({
      id: 'high-fat',
      title: 'Risco de encolhimento',
      detail: 'Gordura alta pode derreter demais.',
      reason: `Acima de ${config.baseHighFat}% ha grande perda de gordura na chapa e o disco encolhe com facilidade.`,
    });
  }

  const coxao = ingredients.find((item) => item.ingredientId === 'coxao-duro');
  if (coxao && coxao.percentage > 40 && fatPercentage < config.coxaoMinFat) {
    alerts.push({
      id: 'coxao-dominant',
      title: 'Coxao duro dominante',
      detail: 'Coxao duro em alta proporcao sem gordura suficiente.',
      reason: 'Cortes muito magros pedem compensacao de gordura para manter maciez.',
    });
  }

  const prepLower = prepStyle.toLowerCase();
  const styleLower = burgerStyle.toLowerCase();
  const isSmash = prepLower.includes('smash') || styleLower.includes('smash');
  const isAirfryer = prepLower.includes('airfryer');
  const isFit = styleLower.includes('fit');
  const isTall = styleLower.includes('alto');

  if (
    (prepLower.includes('grelha') || prepLower.includes('churrasqueira') || prepLower.includes('carvao')) &&
    fatPercentage > config.grillFlareFat
  ) {
    alerts.push({
      id: 'flare-ups',
      title: 'Risco de flare-ups',
      detail: 'Gordura alta na grelha pode pingar e queimar.',
      reason: 'Use zona indireta para evitar labaredas e gosto amargo.',
    });
  }

  if (isSmash && fatPercentage < config.smashMinFat) {
    alerts.push({
      id: 'smash-low-fat',
      title: 'Smash pede mais gordura',
      detail: 'Disco fino perde umidade rapido.',
      reason: `No smash a gordura acima de ${config.smashMinFat}% ajuda a manter crosta e suculencia.`,
    });
  }

  if (isAirfryer && fatPercentage > config.airfryerMaxFat) {
    alerts.push({
      id: 'airfryer-high-fat',
      title: 'Airfryer com gordura alta',
      detail: 'Pode gerar fumaca e respingos.',
      reason: `Gordura pinga no cesto e queima rapido. Mire ate ${config.airfryerMaxFat}% ou use bandeja.`,
    });
  }

  if (isFit && fatPercentage > config.fitMaxFat) {
    alerts.push({
      id: 'fit-high-fat',
      title: 'Fit com gordura acima do ideal',
      detail: 'Para o estilo Fit, reduza a gordura.',
      reason: 'Blends Fit priorizam leveza e menor oleosidade para digestao mais leve.',
    });
  }

  if (isTall && fatPercentage < config.tallMinFat) {
    alerts.push({
      id: 'tall-low-fat',
      title: 'Burger alto pede mais gordura',
      detail: 'Discos espessos ficam secos se magros.',
      reason: `Para burgers altos, ${config.tallMinFat}-25% ajuda a manter o miolo suculento.`,
    });
  }

  return alerts;
};

const flavors = ['Salgado', 'Doce', 'Acido', 'Amargo', 'Umami', 'Picante'] as const;
export type FlavorKey = (typeof flavors)[number];

const defaultProfile: Record<FlavorKey, number> = {
  Salgado: 2,
  Doce: 1,
  Acido: 1,
  Amargo: 1,
  Umami: 2,
  Picante: 1,
};

const categoryProfiles: Record<string, Record<FlavorKey, number>> = {
  bovine: { Salgado: 3, Doce: 1, Acido: 1, Amargo: 1, Umami: 4, Picante: 1 },
  pork: { Salgado: 4, Doce: 2, Acido: 1, Amargo: 1, Umami: 3, Picante: 1 },
  vegan: { Salgado: 2, Doce: 2, Acido: 2, Amargo: 1, Umami: 2, Picante: 1 },
  extra: { Salgado: 3, Doce: 1, Acido: 1, Amargo: 1, Umami: 2, Picante: 1 },
};

const ingredientOverrides: Record<string, Partial<Record<FlavorKey, number>>> = {
  bacon: { Salgado: 5, Umami: 4 },
  cogumelo: { Umami: 4, Amargo: 2 },
  picanha: { Umami: 4, Salgado: 3 },
  'gordura-bovina': { Umami: 2, Salgado: 2 },
  'feijao-preto': { Umami: 3, Doce: 1 },
  lentilha: { Umami: 3, Doce: 1 },
  'grao-de-bico': { Doce: 2, Umami: 2 },
  queijo: { Salgado: 4, Umami: 3 },
  tutano: { Umami: 3, Salgado: 2 },
};

const getProfile = (ingredientId: string, category: string) => {
  const base = categoryProfiles[category] ?? defaultProfile;
  const overrides = ingredientOverrides[ingredientId] ?? {};
  return flavors.reduce((acc, flavor) => {
    acc[flavor] = overrides[flavor] ?? base[flavor] ?? defaultProfile[flavor];
    return acc;
  }, {} as Record<FlavorKey, number>);
};

export const calculateFlavorRadarData = (
  ingredients: BlendIngredient[],
  extras: BlendExtra[],
  burgerCount: number,
  burgerWeight: number,
) => {
  const baseWeight = calculateBaseWeight(burgerCount, burgerWeight);
  const extrasWeight = calculateExtrasWeight(extras);
  const totalWeight = baseWeight + extrasWeight;

  const sums = flavors.reduce((acc, flavor) => {
    acc[flavor] = 0;
    return acc;
  }, {} as Record<FlavorKey, number>);

  ingredients.forEach((item) => {
    const ingredient = getIngredientById(item.ingredientId);
    if (!ingredient) return;
    const weight = (item.percentage / 100) * baseWeight;
    const profile = getProfile(item.ingredientId, ingredient.category);
    flavors.forEach((flavor) => {
      sums[flavor] += profile[flavor] * weight;
    });
  });

  extras.forEach((extra) => {
    const ingredient = getIngredientById(extra.ingredientId);
    if (!ingredient) return;
    const profile = getProfile(extra.ingredientId, ingredient.category);
    flavors.forEach((flavor) => {
      sums[flavor] += profile[flavor] * extra.grams;
    });
  });

  return flavors.map((flavor) => {
    const avg = totalWeight > 0 ? sums[flavor] / totalWeight : defaultProfile[flavor];
    const value = Math.min(5, Math.max(1, Math.round(avg)));
    return { flavor, value };
  });
};

export {
  calculateBaseWeight,
  calculateExtrasWeight,
  calculateFatTotals,
  formatWeight,
} from "@/lib/blendMath";
