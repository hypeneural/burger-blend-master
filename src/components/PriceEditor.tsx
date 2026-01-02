import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { IngredientIcon } from "@/components/IngredientIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Ingredient } from "@/data/ingredients";
import { resolvePricePerKg, getDefaultPricePerKg, type PriceOverrides } from "@/lib/costing";

interface PriceEditorProps {
  ingredients: Ingredient[];
  priceOverrides: PriceOverrides;
  onChange: (next: PriceOverrides) => void;
}

const categoryLabels: Record<string, string> = {
  bovine: "Bovinos",
  pork: "Suinos",
  vegan: "Veganos",
  extra: "Extras",
};

export function PriceEditor({ ingredients, priceOverrides, onChange }: PriceEditorProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, Ingredient[]>();
    ingredients.forEach((ingredient) => {
      const list = map.get(ingredient.category) ?? [];
      list.push(ingredient);
      map.set(ingredient.category, list);
    });
    return Array.from(map.entries());
  }, [ingredients]);

  const handleUpdate = (ingredientId: string, value: number) => {
    if (!value || value <= 0) {
      const next = { ...priceOverrides };
      delete next[ingredientId];
      onChange(next);
      return;
    }
    onChange({ ...priceOverrides, [ingredientId]: value });
  };

  const handleResetAll = () => {
    onChange({});
  };

  return (
    <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Precos por kg
          </h2>
          <p className="text-sm text-muted-foreground">
            Valores ficticios para simulacao. Ajuste para sua regiao.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleResetAll}>
          <RotateCcw className="w-4 h-4" />
          Resetar
        </Button>
      </div>

      <div className="space-y-4">
        {grouped.map(([category, items]) => (
          <details key={category} className="rounded-xl border border-border bg-background">
            <summary className="cursor-pointer px-4 py-3 flex items-center justify-between text-sm font-medium text-foreground">
              <span className="flex items-center gap-2">
                <IngredientIcon category={category as Ingredient["category"]} className="h-4 w-4" />
                {categoryLabels[category] ?? category}
              </span>
              <span className="text-xs text-muted-foreground">{items.length} itens</span>
            </summary>
            <div className="px-4 pb-3 space-y-3">
              {items.map((ingredient) => {
                const current = resolvePricePerKg(ingredient.id, priceOverrides);
                const defaultValue = getDefaultPricePerKg(ingredient.id);
                return (
                  <div
                    key={ingredient.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{ingredient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Base: {defaultValue.toFixed(2)} / kg
                      </p>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      step={0.5}
                      value={Number.isNaN(current) ? "" : current}
                      onChange={(event) => handleUpdate(ingredient.id, Number(event.target.value))}
                      className="w-24 text-center"
                    />
                  </div>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
