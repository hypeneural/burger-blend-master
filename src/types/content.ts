import type { Cut } from "@/data/cuts";
import type { Ingredient } from "@/data/ingredients";
import type { Preset } from "@/data/presets";

export interface ContentMetaEntry {
  key: string;
  value: string;
  updatedAt: string;
}

export interface CatalogContent {
  cuts: Cut[];
  ingredients: Ingredient[];
  presets: Preset[];
}
