import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { INGREDIENT_CATEGORIES, type IngredientCategory } from '@/data/constants';
import { getCutForIngredient, type Ingredient } from '@/data/ingredients';
import {
  formatCalories,
  formatCostTier,
  formatCutFatRange,
  formatCutFunction,
  formatCutRoles,
  formatFatType,
  formatGrindRecommendation,
  formatMeltingProfile,
} from '@/lib/cutHelpers';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface IngredientPickerProps {
  ingredients: Ingredient[];
  selectedIds: string[];
  onSelect: (ingredientId: string) => void;
  onClose: () => void;
}

const categories = INGREDIENT_CATEGORIES.filter((category) => category !== 'extra') as IngredientCategory[];

const categoryLabels: Record<IngredientCategory, { name: string; icon: string }> = {
  bovine: { name: 'Bovinos', icon: '🐄' },
  pork: { name: 'Suinos', icon: '🐖' },
  vegan: { name: 'Veganos', icon: '🌱' },
  extra: { name: 'Extras', icon: '??' },
};

export function IngredientPicker({
  ingredients,
  selectedIds,
  onSelect,
  onClose,
}: IngredientPickerProps) {
  const [activeCategory, setActiveCategory] = useState<IngredientCategory>('bovine');

  const filteredIngredients = ingredients.filter((ingredient) => ingredient.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-h-[80vh] bg-background rounded-t-3xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">Adicionar Ingrediente</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex gap-2 p-4 overflow-x-auto border-b border-border">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="whitespace-nowrap"
            >
              {categoryLabels[category].icon} {categoryLabels[category].name}
            </Button>
          ))}
        </div>

        <div className="p-4 space-y-2 max-h-[50vh] overflow-y-auto">
          {filteredIngredients.map((ingredient) => {
            const isSelected = selectedIds.includes(ingredient.id);
            const cut = getCutForIngredient(ingredient.id);
            return (
              <motion.button
                key={ingredient.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!isSelected) {
                    onSelect(ingredient.id);
                    onClose();
                  }
                }}
                disabled={isSelected}
                className={cn(
                  'w-full p-4 rounded-xl border-2 flex items-center gap-4 text-left transition-all',
                  isSelected
                    ? 'bg-muted border-muted opacity-50 cursor-not-allowed'
                    : 'bg-card border-border hover:border-primary hover:shadow-warm',
                )}
              >
                <span className="text-3xl">{ingredient.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{ingredient.name}</h4>
                  <p className="text-sm text-muted-foreground">{ingredient.description}</p>
                  <span className="text-xs text-muted-foreground">{ingredient.fatPercentage}% gordura</span>
                  {cut && (
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <p>
                        Funcao: <span className="text-foreground">{formatCutFunction(cut)}</span>
                      </p>
                      <p>
                        Gordura estimada: <span className="text-foreground">{formatCutFatRange(cut)}</span>
                      </p>
                      <p>
                        Calorias: <span className="text-foreground">{formatCalories(cut)}</span>
                      </p>
                      <p>
                        Gordura:{" "}
                        <span className="text-foreground">
                          {formatFatType(cut)} ({formatMeltingProfile(cut)})
                        </span>
                      </p>
                      <p>
                        Por que entra: <span className="text-foreground">{cut.shortDescription}</span>
                      </p>
                      <p>
                        Dicas: <span className="text-foreground">{cut.tips}</span>
                      </p>
                      <p>
                        Nome EN: <span className="text-foreground">{cut.nameEn}</span>
                      </p>
                      <p>
                        Custo: <span className="text-foreground">{formatCostTier(cut)}</span>
                      </p>
                      <p>
                        Recomendado: <span className="text-foreground">{formatCutRoles(cut)}</span>
                      </p>
                      {formatGrindRecommendation(cut) && (
                        <p className="text-muted-foreground">{formatGrindRecommendation(cut)}</p>
                      )}
                      {cut.warnings.length > 0 && (
                        <p className="text-fat-warning">Alerta: {cut.warnings.join(' / ')}</p>
                      )}
                    </div>
                  )}
                </div>
                {isSelected ? (
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">
                    Ja adicionado
                  </span>
                ) : (
                  <Plus className="w-5 h-5 text-primary" />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
