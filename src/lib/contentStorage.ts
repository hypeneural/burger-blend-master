import { cuts } from "@/data/cuts";
import { ingredients } from "@/data/ingredients";
import { presets } from "@/data/presets";
import { db } from "@/lib/db";
import type { CatalogContent, ContentMetaEntry } from "@/types/content";

const CONTENT_VERSION = "2026-02-04";
const META_KEY = "catalogVersion";

const nowIso = () => new Date().toISOString();

export const seedCatalogIfNeeded = async () => {
  const meta = await db.contentMeta.get(META_KEY);
  if (meta?.value === CONTENT_VERSION) return;

  await db.transaction("rw", db.cuts, db.ingredients, db.presets, db.contentMeta, async () => {
    await Promise.all([db.cuts.clear(), db.ingredients.clear(), db.presets.clear()]);
    await db.cuts.bulkPut(cuts);
    await db.ingredients.bulkPut(ingredients);
    await db.presets.bulkPut(presets);
    const entry: ContentMetaEntry = { key: META_KEY, value: CONTENT_VERSION, updatedAt: nowIso() };
    await db.contentMeta.put(entry);
  });
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
      cuts: cachedCuts.length ? cachedCuts : fallbackCatalog.cuts,
      ingredients: cachedIngredients.length ? cachedIngredients : fallbackCatalog.ingredients,
      presets: cachedPresets.length ? cachedPresets : fallbackCatalog.presets,
    };
  } catch (error) {
    console.warn("Falha ao carregar catalogo local, usando fallback.", error);
    return fallbackCatalog;
  }
};
