import { AlertTriangle, Info } from "lucide-react";
import type { BlendIngredient } from "@/data/presets";
import { getSmartAlerts } from "@/domain/blendEngine";

interface SmartAlertsProps {
  ingredients: BlendIngredient[];
  fatPercentage: number;
  prepStyle: string;
}

export function SmartAlerts({ ingredients, fatPercentage, prepStyle }: SmartAlertsProps) {
  const alerts = getSmartAlerts(ingredients, fatPercentage, prepStyle);

  if (alerts.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-card border border-border flex items-center gap-3 text-sm text-muted-foreground">
        <Info className="w-4 h-4 text-vegan-green" />
        Nenhum alerta critico no momento.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div key={alert.id} className="p-4 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-fat-danger" />
            <p className="font-medium text-foreground">{alert.title}</p>
          </div>
          <p className="text-sm text-muted-foreground">{alert.detail}</p>
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer">Entenda por que</summary>
            <p className="mt-1">{alert.reason}</p>
          </details>
        </div>
      ))}
    </div>
  );
}
