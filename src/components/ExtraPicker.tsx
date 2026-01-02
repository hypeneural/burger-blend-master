import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { IngredientIcon } from "@/components/IngredientIcon";
import { Button } from "@/components/ui/button";
import type { Ingredient } from "@/data/ingredients";
import { cn } from "@/lib/utils";

interface ExtraPickerProps {
  ingredients: Ingredient[];
  selectedIds: string[];
  onSelect: (ingredientId: string) => void;
  onClose: () => void;
}

export function ExtraPicker({ ingredients, selectedIds, onSelect, onClose }: ExtraPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-h-[80vh] bg-background rounded-t-3xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">Adicionar Extras</h2>
            <p className="text-sm text-muted-foreground">Nao entram no % principal</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {ingredients.map((ingredient) => {
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
                  "w-full p-4 rounded-xl border-2 flex items-center gap-4 text-left transition-all",
                  isSelected
                    ? "bg-muted border-muted opacity-50 cursor-not-allowed"
                    : "bg-card border-border hover:border-primary hover:shadow-warm",
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted">
                  <IngredientIcon category={ingredient.category} className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{ingredient.name}</h4>
                  <p className="text-sm text-muted-foreground">{ingredient.description}</p>
                  <span className="text-xs text-muted-foreground">{ingredient.fatPercentage}% gordura</span>
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
