import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { IngredientIcon } from '@/components/IngredientIcon';
import { getIngredientById } from '@/data/ingredients';
import { calculateExtrasWeight, formatWeight } from '@/lib/blendMath';
import type { BlendIngredient } from '@/data/presets';
import type { BlendExtra } from '@/types/blend';

interface IngredientBreakdownProps {
  ingredients: BlendIngredient[];
  baseWeight: number;
  extras?: BlendExtra[];
}

export function IngredientBreakdown({ ingredients, baseWeight, extras = [] }: IngredientBreakdownProps) {
  const extrasWeight = calculateExtrasWeight(extras);
  const totalWeight = baseWeight + extrasWeight;
  const hasExtras = extras.length > 0;

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cheese-gold/20 flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-cheese-gold" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Lista de compras exata</h3>
          <p className="text-sm text-muted-foreground">Pesos prontos para comprar e moer</p>
        </div>
      </div>

      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        Carne base (100% do blend)
      </div>
      <div className="space-y-2">
        {ingredients.map((item, index) => {
          const ingredient = getIngredientById(item.ingredientId);
          if (!ingredient) return null;
          
          const weight = (item.percentage / 100) * baseWeight;
          
          return (
            <motion.div
              key={item.ingredientId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-background"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <IngredientIcon category={ingredient.category} className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-medium text-foreground">{ingredient.name}</span>
                  <span className="text-muted-foreground text-sm ml-2">({item.percentage}%)</span>
                </div>
              </div>
              <span className="text-lg font-semibold text-primary">
                {formatWeight(weight, 2)}
              </span>
            </motion.div>
          );
        })}
      </div>

      {hasExtras && (
        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
            <span>Extras do blend</span>
            <span>Nao entram no %</span>
          </div>
          {extras.map((extra) => {
            const ingredient = getIngredientById(extra.ingredientId);
            if (!ingredient) return null;

            return (
              <div
                key={extra.ingredientId}
                className="flex items-center justify-between p-3 rounded-lg bg-background"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <IngredientIcon category={ingredient.category} className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{ingredient.name}</span>
                    <span className="text-muted-foreground text-sm ml-2">extra</span>
                  </div>
                </div>
                <span className="text-lg font-semibold text-primary">
                  {formatWeight(extra.grams)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="font-medium text-muted-foreground">
          {hasExtras ? "Total (com extras)" : "Total"}
        </span>
        <span className="text-xl font-display font-bold text-foreground">
          {formatWeight(totalWeight)}
        </span>
      </div>
    </div>
  );
}
