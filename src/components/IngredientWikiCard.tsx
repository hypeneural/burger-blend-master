import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IngredientIcon } from '@/components/IngredientIcon';
import { getCutForIngredient, type Ingredient } from '@/data/ingredients';
import { getSeasoningById } from '@/data/seasonings';
import {
  formatCalories,
  formatCollagenLevel,
  formatCostTier,
  formatCutFatRange,
  formatCutFunction,
  formatCutRoles,
  formatFatType,
  formatGrindRecommendation,
  formatMaillardPotential,
  formatMeltingProfile,
  formatOxidationRate,
  getCutDynamicTips,
} from '@/lib/cutHelpers';

interface IngredientWikiCardProps {
  ingredient: Ingredient;
}

export function IngredientWikiCard({ ingredient }: IngredientWikiCardProps) {
  const cut = getCutForIngredient(ingredient.id);
  const [expanded, setExpanded] = useState(false);
  const formatSeasonings = (values?: string[]) => {
    if (!values || values.length === 0) return undefined;
    return values
      .slice(0, 4)
      .map((value) => getSeasoningById(value)?.name ?? value)
      .join(', ');
  };
  const formatSimpleList = (values?: string[]) => {
    if (!values || values.length === 0) return undefined;
    return values.slice(0, 3).join(', ');
  };

  return (
    <motion.div layout className="p-4 rounded-xl bg-card border border-border space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
            <IngredientIcon category={ingredient.category} className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{ingredient.name}</h3>
            <p className="text-xs text-muted-foreground leading-snug">{ingredient.description}</p>
          </div>
        </div>
        <span className="text-sm font-semibold text-primary self-start sm:self-auto">
          {ingredient.fatPercentage}%
        </span>
      </div>
      {cut?.bestUseBadge && (
        <span className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-[11px] text-primary">
          {cut.bestUseBadge}
        </span>
      )}

      <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
        {cut ? (
          <>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-muted px-2 py-1">Colageno {formatCollagenLevel(cut)}</span>
              <span className="rounded-full bg-muted px-2 py-1">Oxidacao {formatOxidationRate(cut)}</span>
              <span className="rounded-full bg-muted px-2 py-1">
                Maillard {formatMaillardPotential(cut)}
              </span>
            </div>
            <p>
              Funcao no blend: <span className="text-foreground">{formatCutFunction(cut)}</span>
            </p>
            <p>
              Gordura estimada: <span className="text-foreground">{formatCutFatRange(cut)}</span>
            </p>
            {cut.bestSpices && (
              <p>
                Temperos: <span className="text-foreground">{formatSeasonings(cut.bestSpices)}</span>
              </p>
            )}
          </>
        ) : (
          <p>Perfil nutricional basico por 100g.</p>
        )}
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="text-primary text-xs mt-2"
        >
          {expanded ? 'Mostrar menos' : 'Ler mais'}
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1 pt-2 overflow-hidden"
            >
              {cut ? (
                <>
                  <p>
                    Calorias: <span className="text-foreground">{formatCalories(cut)}</span>
                  </p>
                  <p>
                    Gordura:{' '}
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
                  {cut.flavorTags.length > 0 && (
                    <p>
                      Sabor:{' '}
                      <span className="text-foreground">{formatSimpleList(cut.flavorTags)}</span>
                    </p>
                  )}
                  {cut.bestCheeses && (
                    <p>
                      Queijo: <span className="text-foreground">{formatSimpleList(cut.bestCheeses)}</span>
                    </p>
                  )}
                  {cut.bestBuns && (
                    <p>
                      Pao: <span className="text-foreground">{formatSimpleList(cut.bestBuns)}</span>
                    </p>
                  )}
                  {formatGrindRecommendation(cut) && <p>{formatGrindRecommendation(cut)}</p>}
                  {getCutDynamicTips(cut)
                    .slice(0, 2)
                    .map((tip) => (
                      <p key={tip} className="text-foreground">
                        {tip}
                      </p>
                    ))}
                  {cut.warnings.length > 0 && (
                    <p className="text-fat-warning">Alerta: {cut.warnings.join(' / ')}</p>
                  )}
                </>
              ) : (
                <>
                  <p>
                    Proteina: <span className="text-foreground">{ingredient.nutrition.protein}g</span>
                  </p>
                  <p>
                    Gordura: <span className="text-foreground">{ingredient.nutrition.fat}g</span>
                  </p>
                  {ingredient.nutrition.carbs !== undefined && (
                    <p>
                      Carbo: <span className="text-foreground">{ingredient.nutrition.carbs}g</span>
                    </p>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
