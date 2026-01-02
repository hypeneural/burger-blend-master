import { Minus, Plus, Sparkles, Trash2 } from "lucide-react";
import { IngredientIcon } from "@/components/IngredientIcon";
import { InfoTooltip } from "@/components/InfoTooltip";
import { Button } from "@/components/ui/button";
import { getIngredientById } from "@/data/ingredients";
import { formatWeight } from "@/lib/blendMath";
import type { BlendExtra } from "@/types/blend";

interface ExtrasSectionProps {
  extras: BlendExtra[];
  onAddClick: () => void;
  onChange: (ingredientId: string, grams: number) => void;
  onRemove: (ingredientId: string) => void;
}

const MIN_GRAMS = 0;
const MAX_GRAMS = 300;
const STEP_GRAMS = 10;

export function ExtrasSection({ extras, onAddClick, onChange, onRemove }: ExtrasSectionProps) {
  const totalExtras = extras.reduce((sum, extra) => sum + extra.grams, 0);

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cheese-gold/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-cheese-gold" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">Extras do blend</h3>
            <p className="text-sm text-muted-foreground">
              Misture na carne. Nao entram no % principal
            </p>
          </div>
        </div>
        <InfoTooltip label="Extras entram em gramas separadas. Eles alteram o sabor da carne, nao a montagem do lanche." />
        {extras.length > 0 && (
          <span className="text-sm text-muted-foreground">{formatWeight(totalExtras)}</span>
        )}
      </div>

      <div className="rounded-xl bg-background p-3 text-xs text-muted-foreground">
        Exemplos: bacon moido, queijo em cubos, tutano. Isso altera o sabor da carne, nao a
        montagem do lanche.
      </div>

      {extras.length === 0 ? (
        <div className="p-4 rounded-xl bg-background text-sm text-muted-foreground text-center">
          Nenhum extra adicionado ainda.
        </div>
      ) : (
        <div className="space-y-2">
          {extras.map((extra) => {
            const ingredient = getIngredientById(extra.ingredientId);
            if (!ingredient) return null;
            const grams = Math.min(MAX_GRAMS, Math.max(MIN_GRAMS, extra.grams));

            return (
              <div
                key={extra.ingredientId}
                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-background"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <IngredientIcon category={ingredient.category} className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{ingredient.name}</span>
                    <p className="text-xs text-muted-foreground">{ingredient.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onChange(extra.ingredientId, Math.max(MIN_GRAMS, grams - STEP_GRAMS))}
                    disabled={grams <= MIN_GRAMS}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="min-w-[3.5rem] text-center text-sm font-semibold text-foreground">
                    {grams}g
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onChange(extra.ingredientId, Math.min(MAX_GRAMS, grams + STEP_GRAMS))}
                    disabled={grams >= MAX_GRAMS}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(extra.ingredientId)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Button variant="outline" className="w-full" onClick={onAddClick}>
        <Plus className="w-4 h-4" />
        Adicionar extras
      </Button>
    </div>
  );
}
