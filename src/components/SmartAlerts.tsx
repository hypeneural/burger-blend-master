import { AlertTriangle, Info } from "lucide-react";
import { getIngredientById } from "@/data/ingredients";
import type { BlendIngredient } from "@/data/presets";

interface SmartAlertsProps {
  ingredients: BlendIngredient[];
  fatPercentage: number;
  prepStyle: string;
}

interface AlertItem {
  title: string;
  detail: string;
  reason: string;
}

export function SmartAlerts({ ingredients, fatPercentage, prepStyle }: SmartAlertsProps) {
  const alerts: AlertItem[] = [];

  if (fatPercentage < 15) {
    alerts.push({
      title: "Risco de ressecamento",
      detail: "Blend com pouca gordura tende a ficar seco.",
      reason: "A gordura retenciona umidade e ajuda na textura. Abaixo de 15% o burger perde suculencia.",
    });
  }

  if (fatPercentage > 30) {
    alerts.push({
      title: "Risco de encolhimento",
      detail: "Gordura alta pode derreter demais.",
      reason: "Acima de 30% ha grande perda de gordura na chapa e o disco encolhe com facilidade.",
    });
  }

  const coxao = ingredients.find((item) => item.ingredientId === "coxao-duro");
  if (coxao && coxao.percentage > 40 && fatPercentage < 20) {
    alerts.push({
      title: "Coxao duro dominante",
      detail: "Coxao duro em alta proporcao sem gordura suficiente.",
      reason: "Cortes muito magros pedem compensacao de gordura para manter maciez.",
    });
  }

  const prepLower = prepStyle.toLowerCase();
  if ((prepLower.includes("grelha") || prepLower.includes("churrasqueira")) && fatPercentage > 28) {
    alerts.push({
      title: "Risco de flare-ups",
      detail: "Gordura alta na grelha pode pingar e queimar.",
      reason: "Use zona indireta para evitar labaredas e gosto amargo.",
    });
  }

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
        <div key={alert.title} className="p-4 rounded-2xl bg-card border border-border space-y-2">
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
