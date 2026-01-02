import { getIngredientById, getCutForIngredient } from "@/data/ingredients";
import { getSeasoningById, seasonings } from "@/data/seasonings";
import type { Seasoning, SeasoningKind, SeasoningUsage } from "@/data/seasonings";
import type { BlendIngredient } from "@/data/presets";
import type { BlendExtra } from "@/types/blend";

export interface SeasoningSuggestionInput {
  ingredients: BlendIngredient[];
  extras: BlendExtra[];
  fatPercentage?: number;
}

export interface SeasoningSuggestion {
  id: string;
  name: string;
  reason: string;
  kind: SeasoningKind;
  usage: SeasoningUsage;
}

export interface SeasoningSuggestionResult {
  suggested: SeasoningSuggestion[];
  avoid: SeasoningSuggestion[];
  notes: string[];
}

const aliasMap: Record<string, string> = {
  "sal grosso": "sal-parrilla",
  "sal na hora": "sal-fino",
  "sal parrilla": "sal-parrilla",
  "pimenta-do-reino": "pimenta-do-reino",
  "pimenta do reino": "pimenta-do-reino",
  "alho em po": "alho-em-po",
  "paprica defumada": "paprica-defumada",
  "chimichurri": "chimichurri-seco",
};

const normalizeKey = (value: string) => value.trim().toLowerCase();

export const normalizeSeasoningId = (value: string): string | null => {
  if (!value) return null;
  const normalized = normalizeKey(value);
  if (!normalized) return null;
  const alias = aliasMap[normalized];
  if (alias) return alias;
  const byId = seasonings.find((item) => item.id === value);
  if (byId) return byId.id;
  const byName = seasonings.find((item) => item.name.toLowerCase() === normalized);
  return byName?.id ?? null;
};

export const normalizeSeasoningList = (values: string[]): string[] => {
  const result: string[] = [];
  const seen = new Set<string>();
  values.forEach((value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const normalized = normalizeSeasoningId(trimmed);
    const key = normalized ?? normalizeKey(trimmed);
    if (seen.has(key)) return;
    seen.add(key);
    result.push(normalized ?? trimmed);
  });
  return result;
};

export const getSeasoningLabel = (value: string): string => {
  const normalized = normalizeSeasoningId(value);
  if (!normalized) return value;
  return getSeasoningById(normalized)?.name ?? value;
};

const addToMap = (
  map: Map<string, { seasoning: Seasoning; reasons: Set<string> }>,
  id: string,
  reason: string,
) => {
  const seasoning = getSeasoningById(id);
  if (!seasoning) return;
  const existing = map.get(id);
  if (existing) {
    existing.reasons.add(reason);
    return;
  }
  map.set(id, { seasoning, reasons: new Set([reason]) });
};

const usageLabels: Record<SeasoningUsage, string> = {
  surface: "superficie",
  mix: "mistura",
  finish: "finalizacao",
};

const buildReason = (cutName: string, kind: "base" | "secondary" | "chef" | "accent") => {
  const reasons: Record<typeof kind, string> = {
    base: `Base segura para ${cutName}.`,
    secondary: `Completa o sabor de ${cutName}.`,
    chef: `Toque extra para destacar ${cutName}.`,
    accent: `Finalizacao leve para ${cutName}.`,
  };
  return reasons[kind];
};

const mapToSuggestionList = (
  map: Map<string, { seasoning: Seasoning; reasons: Set<string> }>,
): SeasoningSuggestion[] => {
  const list = Array.from(map.values()).map(({ seasoning, reasons }) => ({
    id: seasoning.id,
    name: seasoning.name,
    reason: Array.from(reasons).join(" "),
    kind: seasoning.kind,
    usage: seasoning.usage,
  }));
  const order: Record<SeasoningKind, number> = {
    base: 0,
    secondary: 1,
    chef: 2,
    accent: 3,
    avoid: 4,
  };
  return list.sort((a, b) => order[a.kind] - order[b.kind]);
};

export const buildSeasoningSuggestions = ({
  ingredients,
  extras,
  fatPercentage,
}: SeasoningSuggestionInput): SeasoningSuggestionResult => {
  const suggestedMap = new Map<string, { seasoning: Seasoning; reasons: Set<string> }>();
  const avoidMap = new Map<string, { seasoning: Seasoning; reasons: Set<string> }>();
  const notes: string[] = [];

  const categories = new Set<string>();
  const ingredientIds = new Set<string>();

  ingredients.forEach((item) => {
    const ingredient = getIngredientById(item.ingredientId);
    if (!ingredient) return;
    categories.add(ingredient.category);
    ingredientIds.add(ingredient.id);
    const cut = getCutForIngredient(item.ingredientId);
    if (!cut?.seasoningProfile) return;
    const profile = cut.seasoningProfile;
    profile.base.forEach((id) => addToMap(suggestedMap, id, buildReason(cut.namePt, "base")));
    profile.secondary?.forEach((id) =>
      addToMap(suggestedMap, id, buildReason(cut.namePt, "secondary")),
    );
    profile.chef?.forEach((id) => addToMap(suggestedMap, id, buildReason(cut.namePt, "chef")));
    profile.accent?.forEach((id) =>
      addToMap(suggestedMap, id, buildReason(cut.namePt, "accent")),
    );
    profile.avoid?.forEach((id) =>
      addToMap(avoidMap, id, `Evite em ${cut.namePt} para nao mascarar o sabor.`),
    );
    if (profile.notes) notes.push(profile.notes);
  });

  extras.forEach((extra) => {
    const ingredient = getIngredientById(extra.ingredientId);
    if (!ingredient) return;
    categories.add(ingredient.category);
    ingredientIds.add(ingredient.id);
  });

  if (categories.has("pork")) {
    addToMap(suggestedMap, "erva-doce", "Perfil suino pede aroma de erva-doce.");
    addToMap(suggestedMap, "pimenta-calabresa", "Calor seco combina com porco.");
  }

  if (categories.has("vegan")) {
    addToMap(suggestedMap, "cominho", "Leguminosas pedem calor terroso.");
    addToMap(suggestedMap, "paprica-doce", "Ajuda na cor e sabor vegetal.");
    addToMap(suggestedMap, "alho-em-po", "Sabor concentrado sem umidade.");
    addToMap(suggestedMap, "cebola-em-po", "Carameliza rapido na chapa.");
  }

  if (ingredientIds.has("bacon") || ingredientIds.has("panceta")) {
    addToMap(suggestedMap, "paprica-defumada", "Amplifica o defumado do bacon.");
  }

  if (typeof fatPercentage === "number" && fatPercentage >= 28) {
    addToMap(suggestedMap, "lemon-pepper", "Acidez corta gordura alta.");
    addToMap(suggestedMap, "pimenta-caiena", "Picancia ajuda a limpar o paladar.");
    notes.push("Blend bem gordo: acidez e picancia deixam o sabor mais leve.");
  }

  return {
    suggested: mapToSuggestionList(suggestedMap),
    avoid: mapToSuggestionList(avoidMap),
    notes,
  };
};

export const getSeasoningUsageLabel = (usage: SeasoningUsage) => usageLabels[usage];
