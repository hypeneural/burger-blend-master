import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { IngredientIcon } from '@/components/IngredientIcon';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCutForIngredient, getIngredientById } from '@/data/ingredients';
import { formatWeight } from '@/lib/blendMath';
import { cn } from '@/lib/utils';
import {
  formatCollagenLevel,
  formatMaillardPotential,
  formatOxidationRate,
  getCutDynamicTips,
  getPrepStyleWarnings,
} from '@/lib/cutHelpers';

interface IngredientSliderProps {
  ingredientId: string;
  percentage: number;
  onPercentageChange: (value: number) => void;
  onRemove: () => void;
  showRemove?: boolean;
  prepStyle?: string;
  inputMode?: 'percentage' | 'grams';
  baseWeight?: number;
}

export function IngredientSlider({
  ingredientId,
  percentage,
  onPercentageChange,
  onRemove,
  showRemove = true,
  prepStyle,
  inputMode = 'percentage',
  baseWeight,
}: IngredientSliderProps) {
  const ingredient = getIngredientById(ingredientId);
  const cut = getCutForIngredient(ingredientId);

  if (!ingredient) return null;

  const categoryColors = {
    bovine: 'meat' as const,
    pork: 'meat' as const,
    vegan: 'vegan' as const,
    extra: 'warning' as const,
  };

  const grams = baseWeight ? Math.round((percentage / 100) * baseWeight) : 0;
  const handleGramsChange = (value: number) => {
    if (!baseWeight) return;
    const clamped = Math.min(baseWeight, Math.max(0, value));
    const nextPercent = Math.round((clamped / baseWeight) * 100);
    onPercentageChange(nextPercent);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-4 rounded-xl bg-card border border-border"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <IngredientIcon category={ingredient.category} className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">{ingredient.name}</h4>
            <p className="text-xs text-muted-foreground leading-snug">
              {ingredient.description} - {ingredient.fatPercentage}% gordura
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex flex-col items-end leading-tight">
            <motion.span
              key={inputMode === 'grams' ? grams : percentage}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className={cn(
                'text-xl font-bold min-w-[4rem] text-right',
                percentage > 50 ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {inputMode === 'grams' && baseWeight ? `${grams}g` : `${percentage}%`}
            </motion.span>
            {inputMode === 'grams' && baseWeight && (
              <span className="text-[10px] text-muted-foreground">{percentage}%</span>
            )}
          </div>
          {showRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {cut && (
        <div className="mb-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          <span className="rounded-full bg-muted px-2 py-1">Colageno {formatCollagenLevel(cut)}</span>
          <span className="rounded-full bg-muted px-2 py-1">Oxidacao {formatOxidationRate(cut)}</span>
          <span className="rounded-full bg-muted px-2 py-1">Maillard {formatMaillardPotential(cut)}</span>
          {cut.bestUseBadge && (
            <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
              {cut.bestUseBadge}
            </span>
          )}
        </div>
      )}

      {cut && (
        <div className="mb-3 space-y-1 text-xs text-muted-foreground">
          {Array.from(
            new Set([
              ...getPrepStyleWarnings(cut, prepStyle),
              ...getCutDynamicTips(cut),
            ]),
          )
            .slice(0, 2)
            .map((tip) => (
              <div key={tip}>{tip}</div>
            ))}
        </div>
      )}

      {inputMode === 'grams' && baseWeight ? (
        <div className="mt-3 flex items-center gap-2">
          <Input
            type="number"
            min={0}
            max={baseWeight}
            value={grams}
            onChange={(event) => handleGramsChange(Number(event.target.value))}
            className="h-9 w-24 text-center"
          />
          <span className="text-xs text-muted-foreground">
            g (base {formatWeight(baseWeight)})
          </span>
        </div>
      ) : (
        <Slider
          value={[percentage]}
          onValueChange={([value]) => onPercentageChange(value)}
          max={100}
          step={5}
          variant={categoryColors[ingredient.category]}
          className="mt-2"
        />
      )}
    </motion.div>
  );
}
