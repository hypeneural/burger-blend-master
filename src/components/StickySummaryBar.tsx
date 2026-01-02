import { Coins, Droplet, Scale } from "lucide-react";
import { formatCurrency } from "@/lib/costing";
import { formatWeight } from "@/lib/blendMath";

interface StickySummaryBarProps {
  fatPercentage: number;
  costPerBurger: number;
  totalWeight: number;
}

export function StickySummaryBar({
  fatPercentage,
  costPerBurger,
  totalWeight,
}: StickySummaryBarProps) {
  return (
    <div className="sticky top-3 z-30">
      <div className="rounded-2xl border border-border bg-background/95 px-3 py-2 shadow-card backdrop-blur">
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-fat-warning/15 flex items-center justify-center">
              <Droplet className="h-4 w-4 text-fat-warning" />
            </div>
            <div>
              <p className="text-muted-foreground">Gordura</p>
              <p className="text-base font-semibold text-foreground">{fatPercentage}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-grill-orange/15 flex items-center justify-center">
              <Coins className="h-4 w-4 text-grill-orange" />
            </div>
            <div>
              <p className="text-muted-foreground">Custo/burger</p>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(costPerBurger)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Scale className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">Total</p>
              <p className="text-sm font-semibold text-foreground">{formatWeight(totalWeight)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
