import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getIngredientById } from "@/data/ingredients";
import type { BlendIngredient } from "@/data/presets";
import type { BlendExtra } from "@/types/blend";
import type { BurgerStyle, GrindPass, GrindSize } from "@/data/constants";
import { formatWeight } from "@/lib/blendMath";

interface ProductionSheetProps {
  ingredients: BlendIngredient[];
  extras: BlendExtra[];
  burgerCount: number;
  burgerWeight: number;
  burgerStyle: BurgerStyle;
  grindSize: GrindSize;
  grindPass: GrindPass;
  prepStyle: string;
}

const grindSizeLabels: Record<GrindSize, string> = {
  FINE: "Fina (3mm)",
  MEDIUM: "Media (5mm)",
  COARSE: "Grossa (8mm)",
};

const grindPassLabels: Record<GrindPass, string> = {
  SINGLE: "Simples",
  DOUBLE: "Dupla",
};

const getYieldRate = (prepStyle: string) => {
  const style = prepStyle.toLowerCase();
  if (style.includes("smash")) return 0.7;
  if (style.includes("churrasqueira") || style.includes("grelha")) return 0.72;
  if (style.includes("airfryer")) return 0.8;
  return 0.78;
};

export function ProductionSheet({
  ingredients,
  extras,
  burgerCount,
  burgerWeight,
  burgerStyle,
  grindSize,
  grindPass,
  prepStyle,
}: ProductionSheetProps) {
  const [batchCount, setBatchCount] = useState(burgerCount);

  const baseWeight = burgerCount * burgerWeight;
  const factor = burgerCount > 0 ? batchCount / burgerCount : 1;
  const scaledBaseWeight = baseWeight * factor;
  const scaledExtrasWeight = extras.reduce((sum, extra) => sum + extra.grams, 0) * factor;
  const totalWeight = scaledBaseWeight + scaledExtrasWeight;
  const yieldRate = getYieldRate(prepStyle);

  const scaledIngredients = useMemo(
    () =>
      ingredients.map((item) => ({
        ...item,
        grams: (item.percentage / 100) * scaledBaseWeight,
      })),
    [ingredients, scaledBaseWeight],
  );

  const scaledExtras = useMemo(
    () =>
      extras.map((extra) => ({
        ...extra,
        grams: extra.grams * factor,
      })),
    [extras, factor],
  );

  return (
    <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            Ficha tecnica operacional
          </h3>
          <p className="text-sm text-muted-foreground">
            Lote, moagem e pesos para producao.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 p-3">
        <div>
          <p className="text-sm font-medium text-foreground">Tamanho do lote</p>
          <p className="text-xs text-muted-foreground">
            Base: {burgerCount} burgers de {burgerWeight}g
          </p>
        </div>
        <Input
          type="number"
          min={1}
          value={batchCount}
          onChange={(event) => setBatchCount(Number(event.target.value))}
          className="w-20 text-center"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {[10, 25, 50, 100].map((value) => (
          <Button
            key={value}
            variant={batchCount === value ? "default" : "secondary"}
            size="sm"
            onClick={() => setBatchCount(value)}
          >
            {value} burgers
          </Button>
        ))}
      </div>

      <div className="rounded-xl bg-background p-3 text-sm text-muted-foreground space-y-1">
        <p>
          Total do lote: <span className="text-foreground font-semibold">{formatWeight(totalWeight)}</span>
        </p>
        <p>
          Moagem: {grindSizeLabels[grindSize]} ({grindPassLabels[grindPass]}) | Estilo: {burgerStyle}
        </p>
        <p>
          Rendimento estimado: {(yieldRate * 100).toFixed(0)}% (perda ~
          {((1 - yieldRate) * 100).toFixed(0)}%).
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Ingredientes para o lote
        </p>
        {scaledIngredients.map((item) => {
          const ingredient = getIngredientById(item.ingredientId);
          if (!ingredient) return null;
          return (
            <div
              key={item.ingredientId}
              className="flex items-center justify-between rounded-lg bg-background p-3"
            >
              <span className="text-sm text-foreground">
                {ingredient.name} ({item.percentage}%)
              </span>
              <span className="text-sm font-semibold text-primary">
                {formatWeight(item.grams)}
              </span>
            </div>
          );
        })}
      </div>

      {scaledExtras.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Extras</p>
          {scaledExtras.map((extra) => {
            const ingredient = getIngredientById(extra.ingredientId);
            if (!ingredient) return null;
            return (
              <div
                key={extra.ingredientId}
                className="flex items-center justify-between rounded-lg bg-background p-3"
              >
                <span className="text-sm text-foreground">{ingredient.name}</span>
                <span className="text-sm font-semibold text-primary">
                  {formatWeight(extra.grams)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
        Checklist rapido: moer gelado, misturar sem apertar, porcionar no peso certo e
        descansar 10 minutos antes da chapa.
      </div>
    </div>
  );
}
