import { getCutForIngredient, type Ingredient } from "@/data/ingredients";
import {
  formatCalories,
  formatCostTier,
  formatCutFatRange,
  formatCutFunction,
  formatCutRoles,
  formatFatType,
  formatGrindRecommendation,
  formatMeltingProfile,
} from "@/lib/cutHelpers";

interface IngredientWikiCardProps {
  ingredient: Ingredient;
}

export function IngredientWikiCard({ ingredient }: IngredientWikiCardProps) {
  const cut = getCutForIngredient(ingredient.id);

  return (
    <div className="p-4 rounded-xl bg-card border border-border space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{ingredient.icon}</span>
          <div>
            <h3 className="font-medium text-foreground">{ingredient.name}</h3>
            <p className="text-xs text-muted-foreground">{ingredient.description}</p>
          </div>
        </div>
        <span className="text-sm font-semibold text-primary">{ingredient.fatPercentage}%</span>
      </div>

      {cut && (
        <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
          <p>
            Funcao no blend: <span className="text-foreground">{formatCutFunction(cut)}</span>
          </p>
          <p>
            Gordura estimada: <span className="text-foreground">{formatCutFatRange(cut)}</span>
          </p>
          <p>
            Calorias: <span className="text-foreground">{formatCalories(cut)}</span>
          </p>
          <p>
            Gordura:{" "}
            <span className="text-foreground">
              {formatFatType(cut)} ({formatMeltingProfile(cut)})
            </span>
          </p>
          <p>
            Por que entra: <span className="text-foreground">{cut.shortDescription}</span>
          </p>
          <p>
            Dicas: <span className="text-foreground">{cut.tips}</span>
          </p>
          <p>
            Nome EN: <span className="text-foreground">{cut.nameEn}</span>
          </p>
          <p>
            Custo: <span className="text-foreground">{formatCostTier(cut)}</span>
          </p>
          <p>
            Recomendado: <span className="text-foreground">{formatCutRoles(cut)}</span>
          </p>
          {formatGrindRecommendation(cut) && <p>{formatGrindRecommendation(cut)}</p>}
          {cut.warnings.length > 0 && (
            <p className="text-fat-warning">Alerta: {cut.warnings.join(' / ')}</p>
          )}
        </div>
      )}
    </div>
  );
}
