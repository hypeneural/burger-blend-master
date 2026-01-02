import Dexie, { type Table } from "dexie";
import type { BlendHistoryEntry, PreferenceEntry, SavedBlend } from "@/types/blend";
import type { Cut } from "@/data/cuts";
import type { Ingredient } from "@/data/ingredients";
import type { Preset } from "@/data/presets";
import type { ContentMetaEntry } from "@/types/content";

export class BlendDatabase extends Dexie {
  blends!: Table<SavedBlend, string>;
  history!: Table<BlendHistoryEntry, string>;
  preferences!: Table<PreferenceEntry, string>;
  cuts!: Table<Cut, string>;
  ingredients!: Table<Ingredient, string>;
  presets!: Table<Preset, string>;
  contentMeta!: Table<ContentMetaEntry, string>;

  constructor() {
    super("blendMasterDB");
    this.version(1).stores({
      blends: "id, createdAt, updatedAt, name",
      history: "id, blendId, createdAt",
      preferences: "key, updatedAt",
    });
    this.version(2).stores({
      blends: "id, createdAt, updatedAt, name",
      history: "id, blendId, createdAt",
      preferences: "key, updatedAt",
      cuts: "id",
      ingredients: "id, category",
      presets: "id, category",
      contentMeta: "key, updatedAt",
    });
  }
}

export const db = new BlendDatabase();

export const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `blend_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};
