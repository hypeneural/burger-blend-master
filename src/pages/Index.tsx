import { Suspense, lazy, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Bookmark, Plus, Sparkles } from "lucide-react";
import { BlendCard } from "@/components/BlendCard";
import { BottomNav } from "@/components/BottomNav";
import { ExtraPicker } from "@/components/ExtraPicker";
import { ExtrasSection } from "@/components/ExtrasSection";
import { FatIndicator } from "@/components/FatIndicator";
import { FatExplanationDialog } from "@/components/FatExplanationDialog";
import { Header } from "@/components/Header";
import { IngredientWikiCard } from "@/components/IngredientWikiCard";
import { IngredientPicker } from "@/components/IngredientPicker";
import { IngredientSlider } from "@/components/IngredientSlider";
import { QuantityCalculator } from "@/components/QuantityCalculator";
import { SavedBlendCard } from "@/components/SavedBlendCard";
import { SmartAlerts } from "@/components/SmartAlerts";
import { Stepper } from "@/components/Stepper";
import { TargetLock } from "@/components/TargetLock";
import { TargetProgress } from "@/components/TargetProgress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { calculateFatPercentage } from "@/lib/blendMath";
import {
  addHistoryEntry,
  addSavedBlend,
  deleteSavedBlend,
  getPreference,
  loadHistory,
  loadSavedBlends,
  setPreference,
} from "@/lib/blendStorage";
import { loadCatalog, seedCatalogIfNeeded } from "@/lib/contentStorage";
import { toast } from "@/hooks/use-toast";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { useBlendStore } from "@/store/useBlendStore";
import type { SavedBlend } from "@/types/blend";

const BlendReport = lazy(() =>
  import("@/components/BlendReport").then((module) => ({ default: module.BlendReport })),
);
const BurgerStack = lazy(() =>
  import("@/components/BurgerStack").then((module) => ({ default: module.BurgerStack })),
);
const FatDonutChart = lazy(() =>
  import("@/components/FatDonutChart").then((module) => ({ default: module.FatDonutChart })),
);
const FlavorRadarChart = lazy(() =>
  import("@/components/FlavorRadarChart").then((module) => ({ default: module.FlavorRadarChart })),
);

const formatDate = (value: string) => new Date(value).toLocaleDateString("pt-BR");

const wikiSections = [
  {
    id: "bovine",
    title: "Bovinos",
    description: "Cortes ricos em sabor e textura para blends tradicionais.",
  },
  {
    id: "pork",
    title: "Suinos",
    description: "Suinos trazem docura e gordura equilibrada para misturas.",
  },
  {
    id: "vegan",
    title: "Veganos",
    description: "Bases vegetais com fibras, textura e umami natural.",
  },
  {
    id: "extra",
    title: "Extras",
    description: "Adicoes aromaticas para ajustar sabor e suculencia.",
  },
] as const;

export default function Index() {
  const {
    catalogIngredients,
    catalogPresets,
    activeTab,
    step,
    ingredients: ingredientsState,
    extras,
    burgerCount,
    burgerWeight,
    blendName,
    blendDescription,
    prepStyle,
    prepTips,
    seasonings,
    showPicker,
    showExtrasPicker,
    savedBlends,
    historyEntries,
    targetFat,
    roundingStep,
    fatSourceId,
    wakeLockEnabled,
    setActiveTab,
    setStep,
    setBlendName,
    setBlendDescription,
    setBurgerCount,
    setBurgerWeight,
    setSeasonings,
    setPrepStyle,
    setShowPicker,
    setShowExtrasPicker,
    setTargetFat,
    setRoundingStep,
    setFatSourceId,
    setWakeLockEnabled,
    setSavedBlends,
    setHistoryEntries,
    setCatalog,
    applyPreset,
    startCustomBlend,
    loadSavedBlend,
    updateIngredientPercentage,
    removeIngredient,
    addIngredient,
    addExtra,
    updateExtra,
    removeExtra,
    applyTargetSuggestion,
  } = useBlendStore();

  const wakeLockSupported = typeof navigator !== "undefined" && "wakeLock" in navigator;

  const prepOptions = [
    { value: "Chapa", label: "Chapa" },
    { value: "Frigideira", label: "Frigideira" },
    { value: "Grelha", label: "Grelha" },
    { value: "Churrasqueira", label: "Churrasqueira" },
    { value: "Smash", label: "Smash" },
  ];

  useWakeLock(wakeLockEnabled);

  useEffect(() => {
    let isActive = true;
    const loadData = async () => {
      const [blends, history, prefTarget, prefStep, prefSource, prefWake] = await Promise.all([
        loadSavedBlends(),
        loadHistory(10),
        getPreference("targetFat"),
        getPreference("roundingStep"),
        getPreference("fatSourceId"),
        getPreference("wakeLockEnabled"),
      ]);
      if (!isActive) return;
      setSavedBlends(blends);
      setHistoryEntries(history);
      if (typeof prefTarget === "number") setTargetFat(prefTarget);
      if (typeof prefStep === "number") setRoundingStep(prefStep);
      if (typeof prefSource === "string") setFatSourceId(prefSource);
      if (typeof prefWake === "boolean") setWakeLockEnabled(prefWake);
    };
    loadData();
    return () => {
      isActive = false;
    };
  }, [
    setFatSourceId,
    setHistoryEntries,
    setRoundingStep,
    setSavedBlends,
    setTargetFat,
    setWakeLockEnabled,
  ]);

  useEffect(() => {
    let isActive = true;
    const loadCatalogData = async () => {
      await seedCatalogIfNeeded();
      const catalog = await loadCatalog();
      if (!isActive) return;
      setCatalog({
        catalogCuts: catalog.cuts,
        catalogIngredients: catalog.ingredients,
        catalogPresets: catalog.presets,
      });
    };
    loadCatalogData();
    return () => {
      isActive = false;
    };
  }, [setCatalog]);

  const fatPercentage = useMemo(
    () => calculateFatPercentage(ingredientsState, extras, burgerCount, burgerWeight),
    [ingredientsState, extras, burgerCount, burgerWeight],
  );

  const totalPercentage = useMemo(
    () => ingredientsState.reduce((sum, item) => sum + item.percentage, 0),
    [ingredientsState],
  );

  const groupedIngredients = useMemo(() => {
    return wikiSections.map((section) => ({
      ...section,
      items: catalogIngredients.filter((ingredient) => ingredient.category === section.id),
    }));
  }, [catalogIngredients]);

  const extraIngredients = useMemo(
    () => catalogIngredients.filter((ingredient) => ingredient.category === "extra"),
    [catalogIngredients],
  );

  const handlePresetSelect = (preset: (typeof catalogPresets)[number]) => {
    applyPreset(preset);
  };

  const handleCustomBlend = () => {
    startCustomBlend();
  };

  const handleLoadSavedBlend = (blend: SavedBlend) => {
    loadSavedBlend(blend);
  };

  const handleSaveBlend = async () => {
    const saved = await addSavedBlend({
      name: blendName,
      description: blendDescription,
      ingredients: ingredientsState,
      extras,
      burgerCount,
      burgerWeight,
      prepStyle,
      prepTips,
      seasonings,
    });

    await addHistoryEntry({
      blendId: saved.id,
      name: saved.name,
      snapshot: {
        ingredients: ingredientsState,
        extras,
        burgerCount,
        burgerWeight,
        fatPercentage,
      },
    });

    const [blends, history] = await Promise.all([loadSavedBlends(), loadHistory(10)]);
    setSavedBlends(blends);
    setHistoryEntries(history);
    toast({
      title: "Blend salvo!",
      description: "Seu blend foi adicionado aos favoritos.",
    });
  };

  const handleDeleteBlend = async (blend: SavedBlend) => {
    if (!window.confirm("Excluir blend salvo?")) return;
    await deleteSavedBlend(blend.id);
    const blends = await loadSavedBlends();
    setSavedBlends(blends);
    toast({
      title: "Blend removido",
      description: "O blend foi removido da sua lista.",
    });
  };

  const handleTargetChange = (value: number) => {
    setTargetFat(value);
    setPreference("targetFat", value);
  };

  const handleRoundingChange = (value: number) => {
    setRoundingStep(value);
    setPreference("roundingStep", value);
  };

  const handleFatSourceChange = (value: string) => {
    setFatSourceId(value);
    setPreference("fatSourceId", value);
  };

  const handleApplyTargetSuggestion = (ingredientId: string, grams: number) => {
    applyTargetSuggestion(ingredientId, grams);
  };

  const handleWakeLockToggle = (value: boolean) => {
    setWakeLockEnabled(value);
    setPreference("wakeLockEnabled", value);
  };

  const chartFallback = <div className="h-48 rounded-2xl bg-muted/40 animate-pulse" />;
  const stackFallback = (
    <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
      Montando o stack visual...
    </div>
  );
  const reportFallback = (
    <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
      Gerando receita completa...
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pb-36">
        <AnimatePresence mode="wait">
          {activeTab === "lab" && (
            <motion.section
              key="lab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <Stepper current={step} onStepChange={setStep} />

              <AnimatePresence mode="wait">
                {step === "home" && (
                  <motion.div
                    key="lab-home"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="pt-4"
                  >
                    <Header />

                    <div className="space-y-6">
                      <section>
                        <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-cheese-gold" />
                          Blends Prontos
                        </h2>
                        <div className="space-y-3">
                          {catalogPresets.map((preset, index) => (
                            <BlendCard
                              key={preset.id}
                              preset={preset}
                              onClick={() => handlePresetSelect(preset)}
                              index={index}
                            />
                          ))}
                        </div>
                      </section>

                      <Button
                        variant="warm"
                        size="xl"
                        className="w-full"
                        onClick={handleCustomBlend}
                      >
                        <Plus className="w-5 h-5" />
                        Criar Blend Personalizado
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === "customize" && (
                  <motion.div
                    key="lab-customize"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 pt-6"
                  >
                    <div className="flex items-start gap-3">
                      <Button variant="ghost" size="icon" onClick={() => setStep("home")}>
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                      <div className="flex-1 space-y-3">
                        <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                          <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wide text-muted-foreground">
                              Nome do blend
                            </label>
                            <Input
                              value={blendName}
                              onChange={(event) => setBlendName(event.target.value)}
                              className="text-lg font-semibold"
                              placeholder="Nome do seu blend"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wide text-muted-foreground">
                              Descricao (opcional)
                            </label>
                            <Textarea
                              value={blendDescription}
                              onChange={(event) => setBlendDescription(event.target.value)}
                              rows={2}
                              className="resize-none"
                              placeholder="Ex: Blend para chapa, sabor intenso"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                      <FatIndicator percentage={fatPercentage} />
                      <FatExplanationDialog
                        ingredients={ingredientsState}
                        extras={extras}
                        burgerCount={burgerCount}
                        burgerWeight={burgerWeight}
                      />
                    </div>

                    <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          Visualizacao de gordura
                        </h3>
                        <span className="text-xs text-muted-foreground">Gordura x Magro</span>
                      </div>
                      <Suspense fallback={chartFallback}>
                        <FatDonutChart fatPercentage={fatPercentage} />
                      </Suspense>
                      <TargetProgress current={fatPercentage} target={targetFat} />
                    </div>

                    <TargetLock
                      ingredients={ingredientsState}
                      extras={extras}
                      burgerCount={burgerCount}
                      burgerWeight={burgerWeight}
                      target={targetFat}
                      roundingStep={roundingStep}
                      fatSourceId={fatSourceId}
                      onTargetChange={handleTargetChange}
                      onRoundingStepChange={handleRoundingChange}
                      onFatSourceChange={handleFatSourceChange}
                      onApplySuggestion={handleApplyTargetSuggestion}
                    />

                    <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          Equipamento de cocao
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Afeta alertas e recomendacoes de gordura.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {prepOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={prepStyle === option.value ? "default" : "secondary"}
                            size="sm"
                            onClick={() => setPrepStyle(option.value)}
                            className="rounded-full"
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <SmartAlerts
                      ingredients={ingredientsState}
                      fatPercentage={fatPercentage}
                      prepStyle={prepStyle}
                    />

                    <section className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display text-lg font-semibold text-foreground">
                            Blend da carne
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Somente carnes e base do blend. Deve somar 100%.
                          </p>
                        </div>
                        <span
                          className={`text-sm ${totalPercentage === 100 ? "text-vegan-green" : "text-fat-warning"}`}
                        >
                          {totalPercentage}%
                        </span>
                      </div>

                      <AnimatePresence>
                        {ingredientsState.map((item) => (
                        <IngredientSlider
                          key={item.ingredientId}
                          ingredientId={item.ingredientId}
                          percentage={item.percentage}
                          onPercentageChange={(value) =>
                            updateIngredientPercentage(item.ingredientId, value)
                          }
                          onRemove={() => removeIngredient(item.ingredientId)}
                          showRemove={ingredientsState.length > 1}
                          prepStyle={prepStyle}
                        />
                      ))}
                      </AnimatePresence>

                      <Button variant="outline" className="w-full" onClick={() => setShowPicker(true)}>
                        <Plus className="w-4 h-4" />
                        Adicionar Ingrediente
                      </Button>
                    </section>

                    <ExtrasSection
                      extras={extras}
                      onAddClick={() => setShowExtrasPicker(true)}
                      onChange={updateExtra}
                      onRemove={removeExtra}
                    />

                    <Suspense fallback={stackFallback}>
                      <BurgerStack />
                    </Suspense>

                    <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          Roda de sabores
                        </h3>
                        <span className="text-xs text-muted-foreground">Salgado ao picante</span>
                      </div>
                      <Suspense fallback={chartFallback}>
                        <FlavorRadarChart
                          ingredients={ingredientsState}
                          extras={extras}
                          burgerCount={burgerCount}
                          burgerWeight={burgerWeight}
                        />
                      </Suspense>
                    </div>

                    <QuantityCalculator
                      burgerCount={burgerCount}
                      burgerWeight={burgerWeight}
                      onBurgerCountChange={setBurgerCount}
                      onBurgerWeightChange={setBurgerWeight}
                    />

                    <AnimatePresence>
                      {showPicker && (
                        <IngredientPicker
                          ingredients={catalogIngredients}
                          selectedIds={ingredientsState.map((item) => item.ingredientId)}
                          onSelect={addIngredient}
                          onClose={() => setShowPicker(false)}
                          prepStyle={prepStyle}
                        />
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {showExtrasPicker && (
                        <ExtraPicker
                          ingredients={extraIngredients}
                          selectedIds={extras.map((extra) => extra.ingredientId)}
                          onSelect={addExtra}
                          onClose={() => setShowExtrasPicker(false)}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {step === "report" && (
                  <motion.div
                    key="lab-report"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="pt-6"
                  >
                    <Suspense fallback={reportFallback}>
                      <BlendReport
                        name={blendName}
                        description={blendDescription}
                        ingredients={ingredientsState}
                        extras={extras}
                        burgerCount={burgerCount}
                        burgerWeight={burgerWeight}
                        prepStyle={prepStyle}
                        prepTips={prepTips}
                        seasonings={seasonings}
                        onBack={() => setStep("customize")}
                        onSave={handleSaveBlend}
                        onSeasoningsChange={setSeasonings}
                      />
                    </Suspense>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}

          {activeTab === "wiki" && (
            <motion.section
              key="wiki"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 pt-6"
            >
              <div className="space-y-2">
                <h1 className="font-display text-2xl font-bold text-foreground">WikiMeat</h1>
                <p className="text-sm text-muted-foreground">
                  Guia rapido de ingredientes, perfis de sabor e gordura.
                </p>
              </div>

              {groupedIngredients.map((section) => (
                <div key={section.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-lg font-semibold text-foreground">
                        {section.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {section.items.length} itens
                    </span>
                  </div>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <IngredientWikiCard key={item.id} ingredient={item} />
                    ))}
                  </div>
                </div>
              ))}
            </motion.section>
          )}

          {activeTab === "grill" && (
            <motion.section
              key="grill"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 pt-6"
            >
              <div className="space-y-2">
                <h1 className="font-display text-2xl font-bold text-foreground">Minha Grelha</h1>
                <p className="text-sm text-muted-foreground">
                  Seus blends favoritos, historico e conquistas.
                </p>
              </div>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-primary" />
                    Blends salvos
                  </h2>
                  <Button variant="secondary" size="sm" onClick={handleCustomBlend}>
                    Novo blend
                  </Button>
                </div>

                {savedBlends.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Voce ainda nao salvou nenhum blend.
                    </p>
                    <Button variant="warm" className="w-full" onClick={handleCustomBlend}>
                      Criar meu primeiro blend
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedBlends.map((blend) => (
                      <SavedBlendCard
                        key={blend.id}
                        blend={blend}
                        onLoad={() => handleLoadSavedBlend(blend)}
                        onDelete={() => handleDeleteBlend(blend)}
                      />
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-lg font-semibold text-foreground">Historico</h2>
                {historyEntries.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-card border border-border text-sm text-muted-foreground">
                    Nenhum preparo registrado ainda.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {historyEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-foreground">{entry.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.snapshot.burgerCount}x {entry.snapshot.burgerWeight}g - {entry.snapshot.fatPercentage}% gordura
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </motion.section>
          )}

          {activeTab === "tools" && (
            <motion.section
              key="tools"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 pt-6"
            >
              <div className="space-y-2">
                <h1 className="font-display text-2xl font-bold text-foreground">Ferramentas</h1>
                <p className="text-sm text-muted-foreground">
                  Cronometros, conversores e modo de preparo em breve.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                <h2 className="font-display text-lg font-semibold text-foreground">Cooking Mode</h2>
                <p className="text-sm text-muted-foreground">
                  Ative para manter a tela ligada durante o preparo.
                </p>
                <div className="flex items-center justify-between rounded-xl bg-background p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Tela sempre ativa</p>
                    <p className="text-xs text-muted-foreground">
                      {wakeLockSupported ? "Evita que a tela apague." : "Nao suportado neste navegador."}
                    </p>
                  </div>
                  <Switch
                    checked={wakeLockEnabled}
                    onCheckedChange={handleWakeLockToggle}
                    disabled={!wakeLockSupported}
                  />
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {activeTab === "lab" && step === "customize" && (
        <div className="fixed left-0 right-0 bottom-24 z-40">
          <div className="max-w-md mx-auto px-4">
            <div className="rounded-2xl bg-background/95 border border-border shadow-card p-2 backdrop-blur">
              <Button
                variant="warm"
                size="xl"
                className="w-full"
                onClick={() => setStep("report")}
              >
                Gerar Receita Completa
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
