import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { getIngredientById } from '@/data/ingredients';
import type { BlendIngredient } from '@/data/presets';

interface IngredientBreakdownProps {
  ingredients: BlendIngredient[];
  totalWeight: number;
}

export function IngredientBreakdown({ ingredients, totalWeight }: IngredientBreakdownProps) {
  return (
    <div className="space-y-4 p-5 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cheese-gold/20 flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-cheese-gold" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Lista de Ingredientes</h3>
          <p className="text-sm text-muted-foreground">Quantidades calculadas automaticamente</p>
        </div>
      </div>

      <div className="space-y-2">
        {ingredients.map((item, index) => {
          const ingredient = getIngredientById(item.ingredientId);
          if (!ingredient) return null;
          
          const weight = Math.round((item.percentage / 100) * totalWeight);
          
          return (
            <motion.div
              key={item.ingredientId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-background"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{ingredient.icon}</span>
                <div>
                  <span className="font-medium text-foreground">{ingredient.name}</span>
                  <span className="text-muted-foreground text-sm ml-2">({item.percentage}%)</span>
                </div>
              </div>
              <span className="text-lg font-semibold text-primary">
                {weight >= 1000 ? `${(weight / 1000).toFixed(2)}kg` : `${weight}g`}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="font-medium text-muted-foreground">Total</span>
        <span className="text-xl font-display font-bold text-foreground">
          {totalWeight >= 1000 ? `${(totalWeight / 1000).toFixed(1)}kg` : `${totalWeight}g`}
        </span>
      </div>
    </div>
  );
}
