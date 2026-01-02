import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCutForIngredient, getIngredientById } from "@/data/ingredients";
import { calculateFatTotals, formatWeight } from "@/lib/blendMath";
import { formatCutFatRange } from "@/lib/cutHelpers";
import type { BlendIngredient } from "@/data/presets";
import type { BlendExtra } from "@/types/blend";

interface FatExplanationDialogProps {
  ingredients: BlendIngredient[];
  extras: BlendExtra[];
  burgerCount: number;
  burgerWeight: number;
}

export function FatExplanationDialog({
  ingredients,
  extras,
  burgerCount,
  burgerWeight,
}: FatExplanationDialogProps) {
  const { baseWeight, extrasWeight, totalWeight, totalFatGrams } = calculateFatTotals(
    ingredients,
    extras,
    burgerCount,
    burgerWeight,
  );

  const formatGrams = (value: number) => `${Math.round(value)}g`;
  const fatPercent = totalWeight > 0 ? Math.round((totalFatGrams / totalWeight) * 100) : 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full text-xs">
          Por que deu esse numero?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Explicacao do calculo</DialogTitle>
          <DialogDescription>
            Veja como cada ingrediente impacta o teor de gordura final.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="p-3 rounded-xl bg-muted/40">
            <p className="font-medium text-foreground">Peso base</p>
            <p className="text-muted-foreground">
              {burgerCount}x {burgerWeight}g = {formatWeight(baseWeight)}
            </p>
            {extrasWeight > 0 && (
              <p className="text-muted-foreground">Extras: {formatWeight(extrasWeight)}</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="font-medium text-foreground">Ingredientes</p>
            {ingredients.map((item) => {
              const ingredient = getIngredientById(item.ingredientId);
              const cut = getCutForIngredient(item.ingredientId);
              if (!ingredient) return null;
              const weight = (item.percentage / 100) * baseWeight;
              const fatGrams = (ingredient.fatPercentage / 100) * weight;
              return (
                <div
                  key={item.ingredientId}
                  className="flex items-center justify-between rounded-lg bg-background px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-foreground">{ingredient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.percentage}% - {formatWeight(weight)} - {ingredient.fatPercentage}% gordura
                    </p>
                    {cut && (
                      <p className="text-[11px] text-muted-foreground">
                        Faixa tecnica: {formatCutFatRange(cut)}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{formatGrams(fatGrams)}</span>
                </div>
              );
            })}
          </div>

          {extras.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-foreground">Extras</p>
              {extras.map((extra) => {
                const ingredient = getIngredientById(extra.ingredientId);
                const cut = getCutForIngredient(extra.ingredientId);
                if (!ingredient) return null;
                const fatGrams = (ingredient.fatPercentage / 100) * extra.grams;
                return (
                  <div
                    key={extra.ingredientId}
                    className="flex items-center justify-between rounded-lg bg-background px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-foreground">{ingredient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatWeight(extra.grams)} - {ingredient.fatPercentage}% gordura
                      </p>
                      {cut && (
                        <p className="text-[11px] text-muted-foreground">
                          Faixa tecnica: {formatCutFatRange(cut)}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{formatGrams(fatGrams)}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Formula usada</p>
            <p>Gordura total = soma(peso de cada ingrediente x % gordura).</p>
            <p>% final = gordura total / peso total.</p>
          </div>

          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <p className="font-medium text-foreground">Calculo final</p>
            <p className="text-xs text-muted-foreground">
              Gordura total {formatGrams(totalFatGrams)} / peso total {formatWeight(totalWeight)}
            </p>
            <p className="text-sm font-semibold text-primary">{fatPercent}% gordura</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
