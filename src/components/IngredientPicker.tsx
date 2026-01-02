import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ingredients, type Ingredient } from '@/data/ingredients';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface IngredientPickerProps {
  selectedIds: string[];
  onSelect: (ingredientId: string) => void;
  onClose: () => void;
}

const categoryLabels = {
  bovine: { name: 'Bovinos', icon: '🐄' },
  pork: { name: 'Suínos', icon: '🐷' },
  vegan: { name: 'Veganos', icon: '🌱' },
  extra: { name: 'Extras', icon: '✨' },
};

export function IngredientPicker({ selectedIds, onSelect, onClose }: IngredientPickerProps) {
  const [activeCategory, setActiveCategory] = useState<Ingredient['category']>('bovine');
  
  const categories = Object.keys(categoryLabels) as Ingredient['category'][];
  const filteredIngredients = ingredients.filter(i => i.category === activeCategory);

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
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">Adicionar Ingrediente</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Category Tabs */}
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

        {/* Ingredients List */}
        <div className="p-4 space-y-2 max-h-[50vh] overflow-y-auto">
          {filteredIngredients.map((ingredient) => {
            const isSelected = selectedIds.includes(ingredient.id);
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
                    : 'bg-card border-border hover:border-primary hover:shadow-warm'
                )}
              >
                <span className="text-3xl">{ingredient.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{ingredient.name}</h4>
                  <p className="text-sm text-muted-foreground">{ingredient.description}</p>
                  <span className="text-xs text-muted-foreground">{ingredient.fatPercentage}% gordura</span>
                </div>
                {isSelected ? (
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">Já adicionado</span>
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
