import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import { getIngredientById } from "@/data/ingredients";
import type { BlendExtra } from "@/types/blend";

interface BurgerStackProps {
  extras: BlendExtra[];
}

const layerColors = [
  "bg-cheese-gold/60",
  "bg-grill-orange/60",
  "bg-meat-red/50",
  "bg-vegan-green/50",
];

export function BurgerStack({ extras }: BurgerStackProps) {
  const [orderedExtras, setOrderedExtras] = useState(extras);

  useEffect(() => {
    setOrderedExtras(extras);
  }, [extras]);

  return (
    <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">Stack do Hamburguer</h3>
        <span className="text-xs text-muted-foreground">Arraste os extras</span>
      </div>

      <div className="space-y-1">
        <div className="h-6 rounded-full bg-[hsl(var(--cheese-gold))] text-xs text-primary-foreground flex items-center justify-center">
          Pao superior
        </div>

        {orderedExtras.length > 0 ? (
          <Reorder.Group axis="y" values={orderedExtras} onReorder={setOrderedExtras} className="space-y-1">
            {orderedExtras.map((extra, index) => {
              const ingredient = getIngredientById(extra.ingredientId);
              if (!ingredient) return null;
              const color = layerColors[index % layerColors.length];
              return (
                <Reorder.Item
                  key={extra.ingredientId}
                  value={extra}
                  className={`h-8 rounded-full ${color} text-xs text-foreground flex items-center justify-between px-3 shadow-sm`}
                >
                  <span>{ingredient.name}</span>
                  <span>{extra.grams}g</span>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        ) : (
          <div className="h-8 rounded-full bg-muted text-xs text-muted-foreground flex items-center justify-center">
            Sem extras
          </div>
        )}

        <div className="h-10 rounded-full bg-[hsl(var(--meat-brown))] text-xs text-primary-foreground flex items-center justify-center">
          Blend base
        </div>
        <div className="h-6 rounded-full bg-[hsl(var(--cheese-gold))] text-xs text-primary-foreground flex items-center justify-center">
          Pao inferior
        </div>
      </div>
    </div>
  );
}
