import { motion } from "framer-motion";
import { Scissors, ShieldCheck } from "lucide-react";
import { getIngredientById, getCutForIngredient } from "@/data/ingredients";
import { formatWeight } from "@/lib/blendMath";
import {
  formatCutFatRange,
  formatCutFunction,
  formatFatType,
  formatGrindRecommendation,
} from "@/lib/cutHelpers";
import type { BlendIngredient } from "@/data/presets";
import type { BlendExtra } from "@/types/blend";

interface ButcherGuideProps {
  ingredients: BlendIngredient[];
  extras: BlendExtra[];
  baseWeight: number;
}

const butcherExtraIds = new Set(["bacon", "tutano"]);

export function ButcherGuide({ ingredients, extras, baseWeight }: ButcherGuideProps) {
  const blendItems = ingredients
    .map((item) => {
      const ingredient = getIngredientById(item.ingredientId);
      if (!ingredient) return null;
      const weight = (item.percentage / 100) * baseWeight;
      const cut = getCutForIngredient(item.ingredientId);
      return { ingredient, weight, cut };
    })
    .filter(Boolean);

  const butcherExtras = extras
    .map((extra) => {
      const ingredient = getIngredientById(extra.ingredientId);
      if (!ingredient) return null;
      const isButcherItem =
        ingredient.category === "bovine" ||
        ingredient.category === "pork" ||
        butcherExtraIds.has(ingredient.id);
      if (!isButcherItem) return null;
      return { ingredient, weight: extra.grams };
    })
    .filter(Boolean);

  const blendSummary = blendItems
    .map((item) => `${formatWeight(item.weight)} ${item.ingredient.name}`)
    .join(" + ");

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-meat-red/20 flex items-center justify-center">
          <Scissors className="w-5 h-5 text-meat-red" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            Pedido ao acougueiro
          </h3>
          <p className="text-sm text-muted-foreground">
            O que pedir para moer e como pedir
          </p>
        </div>
      </div>

      {blendItems.length === 0 ? (
        <div className="rounded-xl bg-background p-3 text-sm text-muted-foreground">
          Sem itens de acougueiro neste blend.
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-background p-3 text-sm text-foreground">
            Peca para moer tudo junto, sem sal e sem tempero. Quantidade base:{" "}
            <span className="font-semibold">{formatWeight(baseWeight)}</span>.
          </div>

          <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
            Resumo rapido: {blendSummary}
          </div>

          <div className="space-y-2">
            {blendItems.map((item, index) => {
              const grind = item.cut ? formatGrindRecommendation(item.cut) : undefined;
              return (
                <motion.div
                  key={item.ingredient.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-xl bg-background p-3 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{item.ingredient.name}</span>
                    <span className="text-sm font-semibold text-primary">
                      {formatWeight(item.weight)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.cut ? (
                      <>
                        Funcao: {formatCutFunction(item.cut)} | Gordura:{" "}
                        {formatCutFatRange(item.cut)} | Tipo: {formatFatType(item.cut)}
                      </>
                    ) : (
                      <>Gordura estimada: {item.ingredient.fatPercentage}%</>
                    )}
                  </div>
                  {grind && <div className="text-xs text-muted-foreground">{grind}</div>}
                  {item.cut?.warnings.length ? (
                    <div className="text-xs text-fat-warning">
                      Alerta: {item.cut.warnings.join(" / ")}
                    </div>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {butcherExtras.length > 0 && (
        <div className="rounded-xl border border-border bg-background p-3 space-y-2 text-sm">
          <p className="font-semibold text-foreground">Extras para misturar na carne</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            {butcherExtras.map((item) => (
              <div key={item.ingredient.id} className="flex items-center justify-between">
                <span>{item.ingredient.name}</span>
                <span className="font-semibold text-foreground">{formatWeight(item.weight)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl bg-background p-3 text-xs text-muted-foreground flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
        Peca para moer a carne bem gelada para evitar smear da gordura. Se levar para casa,
        mantenha refrigerado e molde os discos sem apertar demais.
      </div>
    </div>
  );
}


