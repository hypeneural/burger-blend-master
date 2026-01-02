import type { BlendIngredient } from "@/data/presets";
import type { BurgerStyle, GrindPass, GrindSize } from "@/data/constants";

export interface BlendExtra {
  ingredientId: string;
  grams: number;
}

export interface SavedBlend {
  id: string;
  name: string;
  description: string;
  ingredients: BlendIngredient[];
  extras: BlendExtra[];
  burgerCount: number;
  burgerWeight: number;
  burgerStyle: BurgerStyle;
  grindSize: GrindSize;
  grindPass: GrindPass;
  prepStyle: string;
  prepTips: string[];
  seasonings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlendHistoryEntry {
  id: string;
  blendId?: string;
  name: string;
  snapshot: {
    ingredients: BlendIngredient[];
    extras: BlendExtra[];
    burgerCount: number;
    burgerWeight: number;
    fatPercentage: number;
  };
  createdAt: string;
}

export interface PreferenceEntry {
  key: string;
  value: string;
  updatedAt: string;
}
