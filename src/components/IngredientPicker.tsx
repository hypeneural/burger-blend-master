import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { IngredientIcon } from '@/components/IngredientIcon';
import { Button } from '@/components/ui/button';
import { INGREDIENT_CATEGORIES, type IngredientCategory } from '@/data/constants';
import { getCutForIngredient, type Ingredient } from '@/data/ingredients';
import { getSeasoningById } from '@/data/seasonings';
import { getCatalogStatus, loadCatalog, precacheCatalogCategories } from '@/lib/contentStorage';
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
  getPrepStyleWarnings,
} from '@/lib/cutHelpers';
import { cn } from '@/lib/utils';
import { useBlendStore } from '@/store/useBlendStore';

interface IngredientPickerProps {
  ingredients: Ingredient[];
  selectedIds: string[];
  onSelect: (ingredientId: string) => void;
  onClose: () => void;
  prepStyle?: string;
}

const categories = INGREDIENT_CATEGORIES.filter((category) => category !== 'extra') as IngredientCategory[];

const categoryLabels: Record<IngredientCategory, { name: string }> = {
  bovine: { name: 'Bovinos' },
  pork: { name: 'Suinos' },
  vegan: { name: 'Veganos' },
  extra: { name: 'Extras' },
};

export function IngredientPicker({
  ingredients,
  selectedIds,
  onSelect,
  onClose,
  prepStyle,
}: IngredientPickerProps) {
  const { setCatalog } = useBlendStore((state) => ({
    setCatalog: state.setCatalog,
  }));
  const [activeCategory, setActiveCategory] = useState<IngredientCategory>('bovine');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [cachedCategories, setCachedCategories] = useState<string[]>([]);

  const filteredIngredients = ingredients.filter((ingredient) => ingredient.category === activeCategory);
  const visibleIngredients = filteredIngredients.slice(0, visibleCount);
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

  const toggleExpanded = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  useEffect(() => {
    setVisibleCount(8);
    setExpandedId(null);
  }, [activeCategory]);

  useEffect(() => {
    getCatalogStatus().then((status) => setCachedCategories(status.categories));
  }, []);

  const handlePrefetchCategory = async () => {
    await precacheCatalogCategories([activeCategory]);
    const refreshed = await loadCatalog();
    setCatalog({
      catalogCuts: refreshed.cuts,
      catalogIngredients: refreshed.ingredients,
      catalogPresets: refreshed.presets,
    });
    const status = await getCatalogStatus();
    setCachedCategories(status.categories);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-h-[80vh] bg-background rounded-t-3xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">Adicionar Ingrediente</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex gap-2 p-4 overflow-x-auto border-b border-border">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="whitespace-nowrap gap-2"
            >
              <IngredientIcon category={category} className="h-4 w-4" />
              {categoryLabels[category].name}
            </Button>
          ))}
        </div>

        <div className="p-4 space-y-2 max-h-[50vh] overflow-y-auto">
          <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <span>
              {cachedCategories.includes(activeCategory)
                ? 'Disponivel offline'
                : 'Toque para baixar esta categoria'}
            </span>
            {!cachedCategories.includes(activeCategory) && (
              <Button variant="secondary" size="sm" onClick={handlePrefetchCategory}>
                Baixar agora
              </Button>
            )}
          </div>
          {visibleIngredients.map((ingredient) => {
            const isSelected = selectedIds.includes(ingredient.id);
            const cut = getCutForIngredient(ingredient.id);
            const isExpanded = expandedId === ingredient.id;
            return (
              <motion.div
                key={ingredient.id}
                layout
                className={cn(
                  'w-full p-4 rounded-xl border-2 flex flex-col gap-3 text-left transition-all',
                  isSelected
                    ? 'bg-muted border-muted opacity-50 cursor-not-allowed'
                    : 'bg-card border-border hover:border-primary hover:shadow-warm',
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted">
                    <IngredientIcon category={ingredient.category} className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-medium text-foreground">{ingredient.name}</h4>
                        <p className="text-sm text-muted-foreground">{ingredient.description}</p>
                      </div>
                      {isSelected ? (
                        <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">
                          Ja adicionado
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            onSelect(ingredient.id);
                            onClose();
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                      <span className="rounded-full bg-muted px-2 py-1">
                        {ingredient.fatPercentage}% gordura
                      </span>
                      {cut?.bestUseBadge && (
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                          {cut.bestUseBadge}
                        </span>
                      )}
                      {cut && (
                        <>
                          <span className="rounded-full bg-muted px-2 py-1">
                            Colageno {formatCollagenLevel(cut)}
                          </span>
                          <span className="rounded-full bg-muted px-2 py-1">
                            Oxidacao {formatOxidationRate(cut)}
                          </span>
                          <span className="rounded-full bg-muted px-2 py-1">
                            Maillard {formatMaillardPotential(cut)}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(ingredient.id)}
                        className="px-0 text-xs text-primary hover:text-primary"
                      >
                        {isExpanded ? 'Mostrar menos' : 'Ler mais'}
                      </Button>
                      {cut && getPrepStyleWarnings(cut, prepStyle).length > 0 && (
                        <span className="text-xs text-fat-warning">
                          {getPrepStyleWarnings(cut, prepStyle)[0]}
                        </span>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-1 text-xs text-muted-foreground overflow-hidden"
                        >
                          {cut ? (
                            <>
                              <p>
                                Funcao: <span className="text-foreground">{formatCutFunction(cut)}</span>
                              </p>
                              <p>
                                Gordura estimada:{' '}
                                <span className="text-foreground">{formatCutFatRange(cut)}</span>
                              </p>
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
                              {cut.bestSpices && (
                                <p>
                                  Temperos:{' '}
                                  <span className="text-foreground">{formatSeasonings(cut.bestSpices)}</span>
                                </p>
                              )}
                              {cut.bestCheeses && (
                                <p>
                                  Queijo:{' '}
                                  <span className="text-foreground">{formatSimpleList(cut.bestCheeses)}</span>
                                </p>
                              )}
                              {cut.bestBuns && (
                                <p>
                                  Pao: <span className="text-foreground">{formatSimpleList(cut.bestBuns)}</span>
                                </p>
                              )}
                              {formatGrindRecommendation(cut) && (
                                <p className="text-muted-foreground">{formatGrindRecommendation(cut)}</p>
                              )}
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
                </div>
              </motion.div>
            );
          })}
          {filteredIngredients.length > visibleCount && (
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setVisibleCount((prev) => prev + 8)}
            >
              Carregar mais ingredientes
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
