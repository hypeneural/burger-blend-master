import { AlertTriangle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ingredients as allIngredients } from "@/data/ingredients";
import { getTargetLockSuggestion, formatWeight } from "@/domain/blendEngine";
import type { BlendIngredient } from "@/data/presets";
import type { BlendExtra } from "@/types/blend";

interface TargetLockProps {
  ingredients: BlendIngredient[];
  extras: BlendExtra[];
  burgerCount: number;
  burgerWeight: number;
  target: number;
  roundingStep: number;
  fatSourceId: string;
  onTargetChange: (value: number) => void;
  onRoundingStepChange: (value: number) => void;
  onFatSourceChange: (value: string) => void;
  onApplySuggestion?: (ingredientId: string, grams: number) => void;
}

const roundingOptions = [5, 10];

export function TargetLock({
  ingredients,
  extras,
  burgerCount,
  burgerWeight,
  target,
  roundingStep,
  fatSourceId,
  onTargetChange,
  onRoundingStepChange,
  onFatSourceChange,
  onApplySuggestion,
}: TargetLockProps) {
  const { warning, recommendation, suggestedGrams } = getTargetLockSuggestion({
    ingredients,
    extras,
    burgerCount,
    burgerWeight,
    target,
    roundingStep,
    fatSourceId,
  });

  return (
    <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Target Lock</h3>
          <p className="text-sm text-muted-foreground">Defina o alvo de gordura e ajuste automatico.</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Alvo de gordura</span>
          <span className="font-semibold text-foreground">{target}%</span>
        </div>
        <Slider
          value={[target]}
          onValueChange={([value]) => onTargetChange(value)}
          min={10}
          max={35}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <span className="text-sm text-muted-foreground">Fonte de gordura</span>
        <Select value={fatSourceId} onValueChange={onFatSourceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Escolha um ingrediente" />
          </SelectTrigger>
          <SelectContent>
            {allIngredients.map((ingredient) => (
              <SelectItem key={ingredient.id} value={ingredient.id}>
                {ingredient.name} ({ingredient.fatPercentage}%)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <span className="text-sm text-muted-foreground">Arredondar para</span>
        <div className="flex gap-2">
          {roundingOptions.map((option) => (
            <Button
              key={option}
              variant={roundingStep === option ? "default" : "secondary"}
              size="sm"
              onClick={() => onRoundingStepChange(option)}
            >
              {option}g
            </Button>
          ))}
        </div>
      </div>

      {warning ? (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-muted text-sm text-muted-foreground">
          <AlertTriangle className="w-4 h-4 mt-0.5" />
          <p>{warning}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{recommendation}</p>
          {typeof suggestedGrams === "number" && onApplySuggestion && (
            <Button
              variant="warm"
              className="w-full"
              onClick={() => onApplySuggestion(fatSourceId, suggestedGrams)}
            >
              Adicionar {formatWeight(suggestedGrams)} como extra
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
