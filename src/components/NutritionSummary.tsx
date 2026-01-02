import { Activity, Droplet, Flame } from "lucide-react";
import { formatWeight } from "@/lib/blendMath";

interface NutritionSummaryProps {
  calories: number;
  protein: number;
  fat: number;
  perBurgerWeight: number;
}

export function NutritionSummary({
  calories,
  protein,
  fat,
  perBurgerWeight,
}: NutritionSummaryProps) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Dados Nutricionais</h3>
          <p className="text-sm text-muted-foreground">
            Estimativa por hamburguer ({formatWeight(perBurgerWeight)})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-background text-center space-y-1">
          <Flame className="w-4 h-4 text-grill-orange mx-auto" />
          <div className="text-lg font-semibold text-foreground">{calories}</div>
          <p className="text-xs text-muted-foreground">kcal</p>
        </div>
        <div className="p-3 rounded-xl bg-background text-center space-y-1">
          <Activity className="w-4 h-4 text-vegan-green mx-auto" />
          <div className="text-lg font-semibold text-foreground">{protein}g</div>
          <p className="text-xs text-muted-foreground">proteina</p>
        </div>
        <div className="p-3 rounded-xl bg-background text-center space-y-1">
          <Droplet className="w-4 h-4 text-cheese-gold mx-auto" />
          <div className="text-lg font-semibold text-foreground">{fat}g</div>
          <p className="text-xs text-muted-foreground">gordura</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Valores aproximados com base nos ingredientes informados.
      </p>
    </div>
  );
}
