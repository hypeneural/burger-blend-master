import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import type { BottomTab } from "@/components/BottomNav";
import { presets, type Preset, type BlendIngredient } from "@/data/presets";
import {
  DEFAULT_ALERT_THRESHOLDS,
  type AlertThresholds,
} from "@/domain/blendEngine";
import { type BurgerStyle, type GrindPass, type GrindSize } from "@/data/constants";
import { cuts, type Cut } from "@/data/cuts";
import { ingredients, type Ingredient } from "@/data/ingredients";
import type { BlendExtra, BlendHistoryEntry, SavedBlend } from "@/types/blend";

export type AppStep = "home" | "customize" | "report";
export type LowDataPreference = "auto" | "on" | "off";

const DEFAULT_PREP_STYLE = "Chapa ou Grelha";
const DEFAULT_PREP_TIPS = [
  "Misture os ingredientes e moa duas vezes",
  "Molde sem apertar demais",
  "Grelhe em fogo alto",
  "Deixe descansar antes de servir",
];
const DEFAULT_SEASONINGS = ["sal-fino", "pimenta-do-reino"];
const DEFAULT_GRIND_SIZE: GrindSize = "MEDIUM";
const DEFAULT_GRIND_PASS: GrindPass = "SINGLE";
const DEFAULT_BURGER_STYLE: BurgerStyle = "Gourmet";

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
  burgerStyle: BurgerStyle;
  grindSize: GrindSize;
  grindPass: GrindPass;
  prepStyle: string;
  prepTips: string[];
  seasonings: string[];
  traceabilityOrigin: string;
  traceabilitySupplier: string;
  traceabilityLot: string;
  showPicker: boolean;
  showExtrasPicker: boolean;
  targetFat: number;
  cmvTarget: number;
  roundingStep: number;
  fatSourceId: string;
  wakeLockEnabled: boolean;
  lowDataMode: LowDataPreference;
  alertThresholds: AlertThresholds;
  priceOverrides: Record<string, number>;
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
  setBurgerStyle: (value: BurgerStyle) => void;
  setGrindSize: (value: GrindSize) => void;
  setGrindPass: (value: GrindPass) => void;
  setPrepStyle: (value: string) => void;
  setPrepTips: (value: string[]) => void;
  setSeasonings: (value: string[]) => void;
  setTraceabilityOrigin: (value: string) => void;
  setTraceabilitySupplier: (value: string) => void;
  setTraceabilityLot: (value: string) => void;
  setShowPicker: (value: boolean) => void;
  setShowExtrasPicker: (value: boolean) => void;
  setTargetFat: (value: number) => void;
  setCmvTarget: (value: number) => void;
  setRoundingStep: (value: number) => void;
  setFatSourceId: (value: string) => void;
  setWakeLockEnabled: (value: boolean) => void;
  setLowDataMode: (value: LowDataPreference) => void;
  setAlertThresholds: (value: Partial<AlertThresholds>) => void;
  setPriceOverrides: (value: Record<string, number>) => void;
  setSavedBlends: (value: SavedBlend[]) => void;
  setHistoryEntries: (value: BlendHistoryEntry[]) => void;
  applyPreset: (preset: Preset) => void;
  startCustomBlend: () => void;
  loadSavedBlend: (blend: SavedBlend) => void;
  updateIngredientPercentage: (ingredientId: string, percentage: number) => void;
  updateIngredientPercentageRaw: (ingredientId: string, percentage: number) => void;
  removeIngredient: (ingredientId: string) => void;
  removeIngredientRaw: (ingredientId: string) => void;
  addIngredient: (ingredientId: string) => void;
  addIngredientRaw: (ingredientId: string) => void;
  addExtra: (ingredientId: string) => void;
  updateExtra: (ingredientId: string, grams: number) => void;
  removeExtra: (ingredientId: string) => void;
  applyTargetSuggestion: (ingredientId: string, grams: number) => void;
  normalizeIngredients: () => void;
}

export const useBlendStore = createWithEqualityFn<BlendStore>((set) => ({
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
  burgerStyle: DEFAULT_BURGER_STYLE,
  grindSize: DEFAULT_GRIND_SIZE,
  grindPass: DEFAULT_GRIND_PASS,
  prepStyle: DEFAULT_PREP_STYLE,
  prepTips: DEFAULT_PREP_TIPS,
  seasonings: DEFAULT_SEASONINGS,
  traceabilityOrigin: "",
  traceabilitySupplier: "",
  traceabilityLot: "",
  showPicker: false,
  showExtrasPicker: false,
  targetFat: 22,
  cmvTarget: 30,
  roundingStep: 10,
  fatSourceId: "gordura-bovina",
  wakeLockEnabled: false,
  lowDataMode: "auto",
  alertThresholds: DEFAULT_ALERT_THRESHOLDS,
  priceOverrides: {},
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
  setBurgerStyle: (value) => set({ burgerStyle: value }),
  setGrindSize: (value) => set({ grindSize: value }),
  setGrindPass: (value) => set({ grindPass: value }),
  setPrepStyle: (value) => set({ prepStyle: value }),
  setPrepTips: (value) => set({ prepTips: value }),
  setSeasonings: (value) => set({ seasonings: value }),
  setTraceabilityOrigin: (value) => set({ traceabilityOrigin: value }),
  setTraceabilitySupplier: (value) => set({ traceabilitySupplier: value }),
  setTraceabilityLot: (value) => set({ traceabilityLot: value }),
  setShowPicker: (value) => set({ showPicker: value }),
  setShowExtrasPicker: (value) => set({ showExtrasPicker: value }),
  setTargetFat: (value) => set({ targetFat: value }),
  setCmvTarget: (value) => set({ cmvTarget: value }),
  setRoundingStep: (value) => set({ roundingStep: value }),
  setFatSourceId: (value) => set({ fatSourceId: value }),
  setWakeLockEnabled: (value) => set({ wakeLockEnabled: value }),
  setLowDataMode: (value) => set({ lowDataMode: value }),
  setAlertThresholds: (value) =>
    set((state) => ({
      alertThresholds: { ...state.alertThresholds, ...value },
    })),
  setPriceOverrides: (value) => set({ priceOverrides: value }),
  setSavedBlends: (value) => set({ savedBlends: value }),
  setHistoryEntries: (value) => set({ historyEntries: value }),
  applyPreset: (preset) =>
    set(() => {
      const presetStyle: BurgerStyle =
        preset.category === "smash"
          ? "Smash"
          : preset.category === "vegan"
            ? "Veg"
            : preset.category === "classic"
              ? "Diner"
              : "Gourmet";
      return {
      ingredients: [...preset.ingredients],
      extras: [],
      blendName: preset.name,
      blendDescription: preset.description,
      burgerStyle: presetStyle,
      grindSize: DEFAULT_GRIND_SIZE,
      grindPass: DEFAULT_GRIND_PASS,
      prepStyle: preset.prepStyle,
      prepTips: preset.prepTips,
      seasonings: preset.seasonings,
      traceabilityOrigin: "",
      traceabilitySupplier: "",
      traceabilityLot: "",
      step: "customize",
      activeTab: "lab",
      };
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
      burgerStyle: DEFAULT_BURGER_STYLE,
      grindSize: DEFAULT_GRIND_SIZE,
      grindPass: DEFAULT_GRIND_PASS,
      prepStyle: DEFAULT_PREP_STYLE,
      prepTips: DEFAULT_PREP_TIPS,
      seasonings: DEFAULT_SEASONINGS,
      traceabilityOrigin: "",
      traceabilitySupplier: "",
      traceabilityLot: "",
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
      burgerStyle: blend.burgerStyle ?? DEFAULT_BURGER_STYLE,
      grindSize: blend.grindSize ?? DEFAULT_GRIND_SIZE,
      grindPass: blend.grindPass ?? DEFAULT_GRIND_PASS,
      prepStyle: blend.prepStyle || DEFAULT_PREP_STYLE,
      prepTips: blend.prepTips?.length ? blend.prepTips : DEFAULT_PREP_TIPS,
      seasonings: blend.seasonings?.length ? blend.seasonings : DEFAULT_SEASONINGS,
      traceabilityOrigin: blend.traceabilityOrigin ?? "",
      traceabilitySupplier: blend.traceabilitySupplier ?? "",
      traceabilityLot: blend.traceabilityLot ?? "",
      step: "customize",
      activeTab: "lab",
    }),
  updateIngredientPercentage: (ingredientId, newPercentage) =>
    set((state) => {
      const clamped = Math.min(100, Math.max(0, newPercentage));
      const updated = state.ingredients.map((item) =>
        item.ingredientId === ingredientId ? { ...item, percentage: clamped } : item,
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
  updateIngredientPercentageRaw: (ingredientId, newPercentage) =>
    set((state) => {
      const clamped = Math.min(100, Math.max(0, newPercentage));
      return {
        ingredients: state.ingredients.map((item) =>
          item.ingredientId === ingredientId ? { ...item, percentage: clamped } : item,
        ),
      };
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
  removeIngredientRaw: (ingredientId) =>
    set((state) => {
      if (state.ingredients.length <= 1) return state;
      return {
        ingredients: state.ingredients.filter((item) => item.ingredientId !== ingredientId),
      };
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
  addIngredientRaw: (ingredientId) =>
    set((state) => {
      if (state.ingredients.some((item) => item.ingredientId === ingredientId)) return state;
      return {
        ingredients: [...state.ingredients, { ingredientId, percentage: 0 }],
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
  normalizeIngredients: () =>
    set((state) => {
      const total = state.ingredients.reduce((sum, item) => sum + item.percentage, 0);
      if (total <= 0) return state;
      const factor = 100 / total;
      if (state.ingredients.length === 1) {
        return {
          ingredients: [{ ...state.ingredients[0], percentage: 100 }],
        };
      }
      const lastIndex = state.ingredients.length - 1;
      const normalized = state.ingredients.map((item, index) => ({
        ...item,
        percentage: index === lastIndex ? item.percentage * factor : item.percentage * factor,
      }));
      const sumOthers = normalized
        .slice(0, lastIndex)
        .reduce((sum, item) => sum + item.percentage, 0);
      const lastValue = Math.max(0, 100 - sumOthers);
      return {
        ingredients: normalized.map((item, index) =>
          index === lastIndex ? { ...item, percentage: lastValue } : item,
        ),
      };
    }),
}), shallow);
