import { Sparkles, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/InfoTooltip";
import type { BlendIngredient } from "@/data/presets";
import type { PriceOverrides } from "@/lib/costing";
import { formatCurrency } from "@/lib/costing";
import { formatWeight } from "@/lib/blendMath";
import { buildCutSwapSuggestions } from "@/lib/cutSwap";

interface CutSwapSuggestionsProps {
  ingredients: BlendIngredient[];
  baseWeight: number;
  priceOverrides?: PriceOverrides;
  onApplySwap?: (fromId: string, toId: string) => void;
}

export function CutSwapSuggestions({
  ingredients,
  baseWeight,
  priceOverrides,
  onApplySwap,
}: CutSwapSuggestionsProps) {
  const suggestions = buildCutSwapSuggestions(ingredients, baseWeight, priceOverrides);

  if (suggestions.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cheese-gold" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Trocas inteligentes
          </h3>
          <InfoTooltip label="Sugestoes para manter gordura e custo com cortes equivalentes." />
        </div>
        <span className="text-xs text-muted-foreground">{suggestions.length} sugestoes</span>
      </div>

      <div className="space-y-3">
        {suggestions.map((item) => {
          const fatImpact = Math.round(Math.abs(item.fatDeltaGrams) / 5) * 5;
          const costImpact = formatCurrency(item.costDeltaKg);
          const blendImpact = formatCurrency(item.costDeltaBlend);
          return (
            <div
              key={`${item.fromId}-${item.toId}`}
              className="rounded-xl border border-border bg-background p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {item.fromName} <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />{" "}
                  {item.toName}
                </div>
                {onApplySwap && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onApplySwap(item.fromId, item.toId)}
                  >
                    Aplicar
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{item.reason}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-2 py-1">
                  Gordura {item.fatDeltaPercent > 0 ? "+" : ""}{item.fatDeltaPercent}pp
                </span>
                <span className="rounded-full bg-muted px-2 py-1">
                  Ajuste ~{formatWeight(fatImpact)}
                </span>
                <span className="rounded-full bg-muted px-2 py-1">
                  Kg {item.costDeltaKg >= 0 ? "+" : ""}{costImpact}
                </span>
                <span className="rounded-full bg-muted px-2 py-1">
                  No blend {item.costDeltaBlend >= 0 ? "+" : ""}{blendImpact}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
