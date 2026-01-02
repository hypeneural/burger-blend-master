import { AlertTriangle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { getIngredientById, ingredients as allIngredients } from "@/data/ingredients";
import { calculateFatTotals, formatWeight } from "@/lib/blendMath";
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

const roundToStep = (value: number, step: number) => {
  if (step <= 0) return Math.round(value);
  return Math.round(value / step) * step;
};

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
  const { totalWeight, totalFatGrams } = calculateFatTotals(ingredients, extras, burgerCount, burgerWeight);
  const fatSource = getIngredientById(fatSourceId);
  const fatSourcePercent = fatSource ? fatSource.fatPercentage / 100 : 0;
  const targetDecimal = target / 100;
  const currentPercent = totalWeight > 0 ? Math.round((totalFatGrams / totalWeight) * 100) : 0;

  let recommendation: string | null = null;
  let suggestedGrams: number | null = null;
  let warning: string | null = null;

  if (!fatSource) {
    warning = "Selecione uma fonte de gordura para calcular.";
  } else if (fatSourcePercent <= targetDecimal) {
    warning = "Essa fonte nao corrige o alvo porque tem gordura menor ou igual ao alvo.";
  } else if (totalWeight <= 0) {
    warning = "Defina o peso da receita para calcular o alvo.";
  } else {
    const raw = (targetDecimal * totalWeight - totalFatGrams) / (fatSourcePercent - targetDecimal);
    if (raw < 0) {
      warning = "Voce ja passou do alvo. Reduza gordura ou aumente carne magra.";
    } else {
      const rounded = roundToStep(raw, roundingStep);
      suggestedGrams = Math.max(0, rounded);
      recommendation = `Voce escolheu alvo ${target}%. Sua mistura atual esta em ${currentPercent}%. Para chegar em ${target}%, precisamos adicionar ${formatWeight(suggestedGrams)} de ${fatSource.name} porque a formula equilibra a gordura total.`;
    }
  }

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
          {suggestedGrams !== null && fatSource && onApplySuggestion && (
            <Button
              variant="warm"
              className="w-full"
              onClick={() => onApplySuggestion(fatSource.id, suggestedGrams)}
            >
              Adicionar {formatWeight(suggestedGrams)} como extra
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
