import { Sparkles } from "lucide-react";
import { getIngredientById, getCutForIngredient } from "@/data/ingredients";
import { calculateBaseWeight, calculateExtrasWeight, formatWeight } from "@/lib/blendMath";
import { getPrepStyleWarnings } from "@/lib/cutHelpers";
import type { BlendIngredient } from "@/data/presets";
import type { BlendExtra } from "@/types/blend";

interface BlendSummaryProps {
  ingredients: BlendIngredient[];
  extras: BlendExtra[];
  burgerCount: number;
  burgerWeight: number;
  fatPercentage: number;
  totalPercentage: number;
  prepStyle?: string;
}

const getFatStatus = (fatPercentage: number) => {
  if (fatPercentage < 15) return "Blend magro. Risco de ressecamento.";
  if (fatPercentage <= 25) return "Faixa ideal para suculencia.";
  if (fatPercentage <= 30) return "Gordura alta. Suculento, mas encolhe mais.";
  return "Gordura muito alta. Risco de encolhimento.";
};

export function BlendSummary({
  ingredients,
  extras,
  burgerCount,
  burgerWeight,
  fatPercentage,
  totalPercentage,
  prepStyle,
}: BlendSummaryProps) {
  const baseWeight = calculateBaseWeight(burgerCount, burgerWeight);
  const extrasWeight = calculateExtrasWeight(extras);
  const dominant = [...ingredients].sort((a, b) => b.percentage - a.percentage)[0];
  const dominantIngredient = dominant ? getIngredientById(dominant.ingredientId) : undefined;
  const dominantCut = dominant ? getCutForIngredient(dominant.ingredientId) : undefined;

  const insights: string[] = [];

  if (totalPercentage !== 100) {
    const diff = Math.abs(totalPercentage - 100);
    insights.push(
      totalPercentage > 100
        ? `Ajuste as porcentagens: excesso de ${diff}%.`
        : `Ajuste as porcentagens: faltam ${diff}%.`,
    );
  }

  if (dominantIngredient) {
    const baseText = dominantCut?.shortDescription ?? dominantIngredient.description;
    insights.push(
      `Base principal: ${dominantIngredient.name} (${dominant?.percentage}%). ${baseText}`,
    );
  }

  insights.push(`Gordura atual: ${fatPercentage}%. ${getFatStatus(fatPercentage)}`);

  if (dominantCut) {
    const prepWarning = getPrepStyleWarnings(dominantCut, prepStyle)[0];
    if (prepWarning) insights.push(prepWarning);
  }

  if (extrasWeight > 0) {
    insights.push(`Extras adicionados: ${formatWeight(extrasWeight)} (nao entram no %).`);
  }

  return (
    <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cheese-gold/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-cheese-gold" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Resumo rapido</h3>
          <p className="text-sm text-muted-foreground">
            Atualiza conforme voce ajusta os ingredientes.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-background p-3 text-xs text-muted-foreground">
        Peso base: <span className="text-foreground font-medium">{formatWeight(baseWeight)}</span>
        {extrasWeight > 0 && (
          <>
            {" "}
            | Extras:{" "}
            <span className="text-foreground font-medium">{formatWeight(extrasWeight)}</span>
          </>
        )}
      </div>

      <ul className="space-y-2 text-sm text-foreground">
        {insights.slice(0, 4).map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-primary/70" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
