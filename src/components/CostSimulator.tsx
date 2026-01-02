import { useMemo } from "react";
import type { BlendIngredient } from "@/data/presets";
import type { BlendExtra } from "@/types/blend";
import type { PriceOverrides } from "@/lib/costing";
import { calculateBlendCost, formatCurrency } from "@/lib/costing";
import { formatWeight } from "@/lib/blendMath";
import { InfoTooltip } from "@/components/InfoTooltip";
import { Input } from "@/components/ui/input";

interface CostSimulatorProps {
  ingredients: BlendIngredient[];
  extras: BlendExtra[];
  burgerCount: number;
  burgerWeight: number;
  cmvTarget: number;
  priceOverrides?: PriceOverrides;
  onCmvTargetChange: (value: number) => void;
}

export function CostSimulator({
  ingredients,
  extras,
  burgerCount,
  burgerWeight,
  cmvTarget,
  priceOverrides,
  onCmvTargetChange,
}: CostSimulatorProps) {
  const summary = useMemo(
    () => calculateBlendCost(ingredients, extras, burgerCount, burgerWeight, priceOverrides),
    [ingredients, extras, burgerCount, burgerWeight, priceOverrides],
  );

  const suggestedPrice =
    cmvTarget > 0 ? summary.costPerBurger / (cmvTarget / 100) : 0;

  const topItems = [...summary.items]
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 6);

  return (
    <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground">
            CMV e custo
          </h3>
          <InfoTooltip label="Valores ficticios para simulacao. Ajuste o CMV alvo conforme seu negocio." />
        </div>
        <span className="text-xs text-muted-foreground">Simulador</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Custo do lote</span>
          <span className="font-semibold text-foreground">
            {formatCurrency(summary.totalCost)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Custo por burger</span>
          <span className="font-semibold text-foreground">
            {formatCurrency(summary.costPerBurger)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Custo por kg</span>
          <span className="font-semibold text-foreground">
            {formatCurrency(summary.costPerKg)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Peso total</span>
          <span>{formatWeight(summary.totalWeight)}</span>
        </div>
      </div>

      <div className="rounded-xl bg-muted/40 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">CMV alvo (%)</p>
            <p className="text-xs text-muted-foreground">
              Ex: 30% significa que o custo e 30% do preco.
            </p>
          </div>
          <Input
            type="number"
            min={20}
            max={60}
            value={cmvTarget}
            onChange={(event) => onCmvTargetChange(Number(event.target.value))}
            className="w-20 text-center"
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Preco sugerido (1 burger)</span>
          <span className="font-semibold text-foreground">
            {formatCurrency(suggestedPrice)}
          </span>
        </div>
      </div>

      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer">Ver custos por ingrediente</summary>
        <div className="mt-3 space-y-2">
          {topItems.map((item) => (
            <div
              key={`${item.kind}-${item.id}`}
              className="flex items-center justify-between rounded-lg bg-background p-2"
            >
              <div>
                <p className="text-foreground">
                  {item.name} {item.kind === "extra" ? "(extra)" : ""}
                </p>
                <p>
                  {formatWeight(item.grams)} x {formatCurrency(item.pricePerKg)}/kg
                </p>
              </div>
              <span className="font-semibold text-foreground">
                {formatCurrency(item.cost)}
              </span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
