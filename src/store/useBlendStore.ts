import { create } from "zustand";
import type { BottomTab } from "@/components/BottomNav";
import { presets, type Preset, type BlendIngredient } from "@/data/presets";
import { cuts, type Cut } from "@/data/cuts";
import { ingredients, type Ingredient } from "@/data/ingredients";
import type { BlendExtra, BlendHistoryEntry, SavedBlend } from "@/types/blend";

export type AppStep = "home" | "customize" | "report";

const DEFAULT_PREP_STYLE = "Chapa ou Grelha";
const DEFAULT_PREP_TIPS = [
  "Misture os ingredientes e moa duas vezes",
  "Molde sem apertar demais",
  "Grelhe em fogo alto",
  "Deixe descansar antes de servir",
];
const DEFAULT_SEASONINGS = ["sal-fino", "pimenta-do-reino"];

interface BlendStore {
  catalogCuts: Cut[];
  catalogIngredients: Ingredient[];
  catalogPresets: Preset[];
  activeTab: BottomTab;
  step: AppStep;
  ingredients: BlendIngredient[];
  extras: BlendExtra[];
  burgerCount: number;
  burgerWeight: number;
  blendName: string;
  blendDescription: string;
  prepStyle: string;
  prepTips: string[];
  seasonings: string[];
  showPicker: boolean;
  showExtrasPicker: boolean;
  targetFat: number;
  roundingStep: number;
  fatSourceId: string;
  wakeLockEnabled: boolean;
  savedBlends: SavedBlend[];
  historyEntries: BlendHistoryEntry[];
  setCatalog: (catalog: Partial<Pick<BlendStore, "catalogCuts" | "catalogIngredients" | "catalogPresets">>) => void;
  setActiveTab: (value: BottomTab) => void;
  setStep: (value: AppStep) => void;
  setIngredients: (value: BlendIngredient[]) => void;
  setExtras: (value: BlendExtra[]) => void;
  setBurgerCount: (value: number) => void;
  setBurgerWeight: (value: number) => void;
  setBlendName: (value: string) => void;
  setBlendDescription: (value: string) => void;
  setPrepStyle: (value: string) => void;
  setPrepTips: (value: string[]) => void;
  setSeasonings: (value: string[]) => void;
  setShowPicker: (value: boolean) => void;
  setShowExtrasPicker: (value: boolean) => void;
  setTargetFat: (value: number) => void;
  setRoundingStep: (value: number) => void;
  setFatSourceId: (value: string) => void;
  setWakeLockEnabled: (value: boolean) => void;
  setSavedBlends: (value: SavedBlend[]) => void;
  setHistoryEntries: (value: BlendHistoryEntry[]) => void;
  applyPreset: (preset: Preset) => void;
  startCustomBlend: () => void;
  loadSavedBlend: (blend: SavedBlend) => void;
  updateIngredientPercentage: (ingredientId: string, percentage: number) => void;
  removeIngredient: (ingredientId: string) => void;
  addIngredient: (ingredientId: string) => void;
  addExtra: (ingredientId: string) => void;
  updateExtra: (ingredientId: string, grams: number) => void;
  removeExtra: (ingredientId: string) => void;
  applyTargetSuggestion: (ingredientId: string, grams: number) => void;
}

export const useBlendStore = create<BlendStore>((set) => ({
  catalogCuts: cuts,
  catalogIngredients: ingredients,
  catalogPresets: presets,
  activeTab: "lab",
  step: "home",
  ingredients: [],
  extras: [],
  burgerCount: 4,
  burgerWeight: 150,
  blendName: "Meu Blend",
  blendDescription: "Blend personalizado",
  prepStyle: DEFAULT_PREP_STYLE,
  prepTips: DEFAULT_PREP_TIPS,
  seasonings: DEFAULT_SEASONINGS,
  showPicker: false,
  showExtrasPicker: false,
  targetFat: 22,
  roundingStep: 10,
  fatSourceId: "gordura-bovina",
  wakeLockEnabled: false,
  savedBlends: [],
  historyEntries: [],
  setCatalog: (catalog) => set(catalog),
  setActiveTab: (value) => set({ activeTab: value }),
  setStep: (value) => set({ step: value }),
  setIngredients: (value) => set({ ingredients: value }),
  setExtras: (value) => set({ extras: value }),
  setBurgerCount: (value) => set({ burgerCount: value }),
  setBurgerWeight: (value) => set({ burgerWeight: value }),
  setBlendName: (value) => set({ blendName: value }),
  setBlendDescription: (value) => set({ blendDescription: value }),
  setPrepStyle: (value) => set({ prepStyle: value }),
  setPrepTips: (value) => set({ prepTips: value }),
  setSeasonings: (value) => set({ seasonings: value }),
  setShowPicker: (value) => set({ showPicker: value }),
  setShowExtrasPicker: (value) => set({ showExtrasPicker: value }),
  setTargetFat: (value) => set({ targetFat: value }),
  setRoundingStep: (value) => set({ roundingStep: value }),
  setFatSourceId: (value) => set({ fatSourceId: value }),
  setWakeLockEnabled: (value) => set({ wakeLockEnabled: value }),
  setSavedBlends: (value) => set({ savedBlends: value }),
  setHistoryEntries: (value) => set({ historyEntries: value }),
  applyPreset: (preset) =>
    set({
      ingredients: [...preset.ingredients],
      extras: [],
      blendName: preset.name,
      blendDescription: preset.description,
      prepStyle: preset.prepStyle,
      prepTips: preset.prepTips,
      seasonings: preset.seasonings,
      step: "customize",
      activeTab: "lab",
    }),
  startCustomBlend: () =>
    set({
      ingredients: [
        { ingredientId: "acem", percentage: 70 },
        { ingredientId: "fraldinha", percentage: 30 },
      ],
      extras: [],
      blendName: "Blend Personalizado",
      blendDescription: "Criacao exclusiva",
      prepStyle: DEFAULT_PREP_STYLE,
      prepTips: DEFAULT_PREP_TIPS,
      seasonings: DEFAULT_SEASONINGS,
      step: "customize",
      activeTab: "lab",
    }),
  loadSavedBlend: (blend) =>
    set({
      ingredients: blend.ingredients,
      extras: blend.extras ?? [],
      burgerCount: blend.burgerCount,
      burgerWeight: blend.burgerWeight,
      blendName: blend.name,
      blendDescription: blend.description,
      prepStyle: blend.prepStyle || DEFAULT_PREP_STYLE,
      prepTips: blend.prepTips?.length ? blend.prepTips : DEFAULT_PREP_TIPS,
      seasonings: blend.seasonings?.length ? blend.seasonings : DEFAULT_SEASONINGS,
      step: "customize",
      activeTab: "lab",
    }),
  updateIngredientPercentage: (ingredientId, newPercentage) =>
    set((state) => {
      const updated = state.ingredients.map((item) =>
        item.ingredientId === ingredientId ? { ...item, percentage: newPercentage } : item,
      );
      const total = updated.reduce((sum, item) => sum + item.percentage, 0);
      if (total !== 100 && total > 0) {
        const factor = 100 / total;
        return {
          ingredients: updated.map((item) => ({
            ...item,
            percentage: Math.round(item.percentage * factor),
          })),
        };
      }
      return { ingredients: updated };
    }),
  removeIngredient: (ingredientId) =>
    set((state) => {
      if (state.ingredients.length <= 1) return state;
      const remaining = state.ingredients.filter((item) => item.ingredientId !== ingredientId);
      const total = remaining.reduce((sum, item) => sum + item.percentage, 0);
      if (total > 0) {
        const factor = 100 / total;
        return {
          ingredients: remaining.map((item) => ({
            ...item,
            percentage: Math.round(item.percentage * factor),
          })),
        };
      }
      return { ingredients: remaining };
    }),
  addIngredient: (ingredientId) =>
    set((state) => {
      const newPercentage = 10;
      const remainingPercentage = 100 - newPercentage;
      const factor = remainingPercentage / 100;
      return {
        ingredients: [
          ...state.ingredients.map((item) => ({
            ...item,
            percentage: Math.round(item.percentage * factor),
          })),
          { ingredientId, percentage: newPercentage },
        ],
      };
    }),
  addExtra: (ingredientId) =>
    set((state) => {
      if (state.extras.some((extra) => extra.ingredientId === ingredientId)) return state;
      return { extras: [...state.extras, { ingredientId, grams: 50 }] };
    }),
  updateExtra: (ingredientId, grams) =>
    set((state) => {
      const clamped = Math.min(300, Math.max(0, grams));
      return {
        extras: state.extras.map((extra) =>
          extra.ingredientId === ingredientId ? { ...extra, grams: clamped } : extra,
        ),
      };
    }),
  removeExtra: (ingredientId) =>
    set((state) => ({
      extras: state.extras.filter((extra) => extra.ingredientId !== ingredientId),
    })),
  applyTargetSuggestion: (ingredientId, grams) =>
    set((state) => {
      const existing = state.extras.find((extra) => extra.ingredientId === ingredientId);
      if (existing) {
        return {
          extras: state.extras.map((extra) =>
            extra.ingredientId === ingredientId ? { ...extra, grams } : extra,
          ),
        };
      }
      return { extras: [...state.extras, { ingredientId, grams }] };
    }),
}));
