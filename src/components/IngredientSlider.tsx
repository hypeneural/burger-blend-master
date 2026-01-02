import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getIngredientById } from '@/data/ingredients';
import { cn } from '@/lib/utils';

interface IngredientSliderProps {
  ingredientId: string;
  percentage: number;
  onPercentageChange: (value: number) => void;
  onRemove: () => void;
  showRemove?: boolean;
}

export function IngredientSlider({
  ingredientId,
  percentage,
  onPercentageChange,
  onRemove,
  showRemove = true,
}: IngredientSliderProps) {
  const ingredient = getIngredientById(ingredientId);

  if (!ingredient) return null;

  const categoryColors = {
    bovine: 'meat' as const,
    pork: 'meat' as const,
    vegan: 'vegan' as const,
    extra: 'warning' as const,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-4 rounded-xl bg-card border border-border"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{ingredient.icon}</span>
          <div>
            <h4 className="font-medium text-foreground">{ingredient.name}</h4>
            <p className="text-xs text-muted-foreground">
              {ingredient.description} - {ingredient.fatPercentage}% gordura
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            key={percentage}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={cn(
              'text-xl font-bold min-w-[4rem] text-right',
              percentage > 50 ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {percentage}%
          </motion.span>
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

      <Slider
        value={[percentage]}
        onValueChange={([value]) => onPercentageChange(value)}
        max={100}
        step={5}
        variant={categoryColors[ingredient.category]}
        className="mt-2"
      />
    </motion.div>
  );
}
