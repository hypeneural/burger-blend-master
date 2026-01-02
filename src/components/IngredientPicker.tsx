import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { INGREDIENT_CATEGORIES, type IngredientCategory } from '@/data/constants';
import { getCutForIngredient, type Ingredient } from '@/data/ingredients';
import { getSeasoningById } from '@/data/seasonings';
import {
  formatCalories,
  formatCostTier,
  formatCollagenLevel,
  formatCutFatRange,
  formatCutFunction,
  formatCutRoles,
  formatFatType,
  formatGrindRecommendation,
  formatMaillardPotential,
  formatMeltingProfile,
  formatOxidationRate,
  getCutDynamicTips,
  getPrepStyleWarnings,
} from '@/lib/cutHelpers';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface IngredientPickerProps {
  ingredients: Ingredient[];
  selectedIds: string[];
  onSelect: (ingredientId: string) => void;
  onClose: () => void;
  prepStyle?: string;
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
  prepStyle,
}: IngredientPickerProps) {
  const [activeCategory, setActiveCategory] = useState<IngredientCategory>('bovine');

  const filteredIngredients = ingredients.filter((ingredient) => ingredient.category === activeCategory);
  const formatSeasonings = (values?: string[]) => {
    if (!values || values.length === 0) return undefined;
    return values
      .slice(0, 4)
      .map((value) => getSeasoningById(value)?.name ?? value)
      .join(', ');
  };
  const formatSimpleList = (values?: string[]) => {
    if (!values || values.length === 0) return undefined;
    return values.slice(0, 3).join(', ');
  };

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
                  {cut?.bestUseBadge && (
                    <span className="ml-2 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                      {cut.bestUseBadge}
                    </span>
                  )}
                  {cut && (
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <span className="rounded-full bg-muted px-2 py-1">
                          Colageno {formatCollagenLevel(cut)}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-1">
                          Oxidacao {formatOxidationRate(cut)}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-1">
                          Maillard {formatMaillardPotential(cut)}
                        </span>
                      </div>
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
                      {cut.flavorTags.length > 0 && (
                        <p>
                          Sabor: <span className="text-foreground">{formatSimpleList(cut.flavorTags)}</span>
                        </p>
                      )}
                      {cut.bestSpices && (
                        <p>
                          Temperos: <span className="text-foreground">{formatSeasonings(cut.bestSpices)}</span>
                        </p>
                      )}
                      {cut.bestCheeses && (
                        <p>
                          Queijo: <span className="text-foreground">{formatSimpleList(cut.bestCheeses)}</span>
                        </p>
                      )}
                      {cut.bestBuns && (
                        <p>
                          Pao: <span className="text-foreground">{formatSimpleList(cut.bestBuns)}</span>
                        </p>
                      )}
                      {cut.bestUseBadge && (
                        <p>
                          Melhor uso: <span className="text-foreground">{cut.bestUseBadge}</span>
                        </p>
                      )}
                      {formatGrindRecommendation(cut) && (
                        <p className="text-muted-foreground">{formatGrindRecommendation(cut)}</p>
                      )}
                      {getCutDynamicTips(cut)
                        .slice(0, 2)
                        .map((tip) => (
                          <p key={tip} className="text-foreground">
                            {tip}
                          </p>
                        ))}
                      {getPrepStyleWarnings(cut, prepStyle)
                        .slice(0, 1)
                        .map((tip) => (
                          <p key={tip} className="text-fat-warning">
                            {tip}
                          </p>
                        ))}
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
