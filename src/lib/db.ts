import Dexie, { type Table } from "dexie";
import type { BlendHistoryEntry, PreferenceEntry, SavedBlend } from "@/types/blend";

export class BlendDatabase extends Dexie {
  blends!: Table<SavedBlend, string>;
  history!: Table<BlendHistoryEntry, string>;
  preferences!: Table<PreferenceEntry, string>;

  constructor() {
    super("blendMasterDB");
    this.version(1).stores({
      blends: "id, createdAt, updatedAt, name",
      history: "id, blendId, createdAt",
      preferences: "key, updatedAt",
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
