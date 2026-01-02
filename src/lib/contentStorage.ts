import { cuts } from "@/data/cuts";
import { ingredients } from "@/data/ingredients";
import { presets } from "@/data/presets";
import { db } from "@/lib/db";
import type { CatalogContent, ContentMetaEntry } from "@/types/content";
import { INGREDIENT_CATEGORIES, type IngredientCategory } from "@/data/constants";

const CONTENT_VERSION = "2026-02-04";
const META_KEY = "catalogVersion";
const SCOPE_KEY = "catalogScope";
const CORE_CATEGORIES: IngredientCategory[] = ["bovine"];
const ALL_CATEGORIES = INGREDIENT_CATEGORIES as IngredientCategory[];

const nowIso = () => new Date().toISOString();
const emitCatalogUpdate = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("catalog-updated"));
};

type CatalogScope = {
  version: string;
  categories: IngredientCategory[];
  updatedAt: string;
};

const parseScope = (value?: string): CatalogScope | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as CatalogScope;
    if (!parsed || !Array.isArray(parsed.categories)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const saveScope = async (categories: IngredientCategory[]) => {
  const entry: ContentMetaEntry = {
    key: SCOPE_KEY,
    value: JSON.stringify({
      version: CONTENT_VERSION,
      categories,
      updatedAt: nowIso(),
    } satisfies CatalogScope),
    updatedAt: nowIso(),
  };
  await db.contentMeta.put(entry);
  emitCatalogUpdate();
};

const mergeById = <T extends { id: string }>(cached: T[], fallback: T[]) => {
  const map = new Map(cached.map((item) => [item.id, item]));
  return fallback.map((item) => map.get(item.id) ?? item);
};

export const seedCatalogIfNeeded = async (): Promise<boolean> => {
  const meta = await db.contentMeta.get(META_KEY);
  if (meta?.value === CONTENT_VERSION) return false;

  await db.transaction("rw", db.cuts, db.ingredients, db.presets, db.contentMeta, async () => {
    await Promise.all([db.cuts.clear(), db.ingredients.clear(), db.presets.clear()]);
    await db.cuts.bulkPut(cuts);
    await db.ingredients.bulkPut(
      ingredients.filter((ingredient) => CORE_CATEGORIES.includes(ingredient.category)),
    );
    await db.presets.bulkPut(presets);
    const entry: ContentMetaEntry = { key: META_KEY, value: CONTENT_VERSION, updatedAt: nowIso() };
    await db.contentMeta.put(entry);
    await saveScope(CORE_CATEGORIES);
  });
  emitCatalogUpdate();

  return true;
};

export const precacheCatalogCategories = async (
  categories: IngredientCategory[],
): Promise<boolean> => {
  const scopeEntry = await db.contentMeta.get(SCOPE_KEY);
  const scope = parseScope(scopeEntry?.value) ?? {
    version: CONTENT_VERSION,
    categories: [],
    updatedAt: nowIso(),
  };
  const missing = categories.filter((category) => !scope.categories.includes(category));
  if (missing.length === 0) return false;

  await db.transaction("rw", db.ingredients, db.contentMeta, async () => {
    await db.ingredients.bulkPut(
      ingredients.filter((ingredient) => missing.includes(ingredient.category)),
    );
    await saveScope([...scope.categories, ...missing]);
  });
  emitCatalogUpdate();
  return true;
};

const fallbackCatalog: CatalogContent = {
  cuts,
  ingredients,
  presets,
};

export const loadCatalog = async (): Promise<CatalogContent> => {
  try {
    const [cachedCuts, cachedIngredients, cachedPresets] = await Promise.all([
      db.cuts.toArray(),
      db.ingredients.toArray(),
      db.presets.toArray(),
    ]);

    return {
      cuts: cachedCuts.length ? mergeById(cachedCuts, fallbackCatalog.cuts) : fallbackCatalog.cuts,
      ingredients: cachedIngredients.length
        ? mergeById(cachedIngredients, fallbackCatalog.ingredients)
        : fallbackCatalog.ingredients,
      presets: cachedPresets.length
        ? mergeById(cachedPresets, fallbackCatalog.presets)
        : fallbackCatalog.presets,
    };
  } catch (error) {
    console.warn("Falha ao carregar catalogo local, usando fallback.", error);
    return fallbackCatalog;
  }
};

export const getCatalogStatus = async () => {
  const [versionEntry, scopeEntry, cutsCount, presetsCount, ingredientsCount] = await Promise.all([
    db.contentMeta.get(META_KEY),
    db.contentMeta.get(SCOPE_KEY),
    db.cuts.count(),
    db.presets.count(),
    db.ingredients.count(),
  ]);
  const scope = parseScope(scopeEntry?.value);
  const categories = scope?.categories ?? [];
  const isReady = Boolean(
    versionEntry?.value === CONTENT_VERSION &&
      cutsCount > 0 &&
      presetsCount > 0 &&
      ingredientsCount > 0 &&
      categories.length > 0,
  );

  return {
    isReady,
    lastUpdated: scope?.updatedAt ?? versionEntry?.updatedAt ?? null,
    categories,
    version: versionEntry?.value ?? null,
    remainingCategories: ALL_CATEGORIES.filter((category) => !categories.includes(category)),
  };
};
