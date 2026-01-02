import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Plus, Sparkles } from "lucide-react";
import { BlendCard } from "@/components/BlendCard";
import { BlendSummary } from "@/components/BlendSummary";
import { CostSimulator } from "@/components/CostSimulator";
import { ExtraPicker } from "@/components/ExtraPicker";
import { ExtrasSection } from "@/components/ExtrasSection";
import { FatIndicator } from "@/components/FatIndicator";
import { FatExplanationDialog } from "@/components/FatExplanationDialog";
import { Header } from "@/components/Header";
import { IngredientPicker } from "@/components/IngredientPicker";
import { IngredientSlider } from "@/components/IngredientSlider";
import { QuantityCalculator } from "@/components/QuantityCalculator";
import { ReverseBlendCalculator } from "@/components/ReverseBlendCalculator";
import { SmartAlerts } from "@/components/SmartAlerts";
import { Stepper } from "@/components/Stepper";
import { TargetLock } from "@/components/TargetLock";
import { TargetProgress } from "@/components/TargetProgress";
import { InfoTooltip } from "@/components/InfoTooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BURGER_STYLES, GRIND_PASSES, GRIND_SIZES } from "@/data/constants";
import { calculateBaseWeight, calculateFatPercentage, formatWeight } from "@/lib/blendMath";
import {
  addHistoryEntry,
  addSavedBlend,
  loadHistory,
  loadSavedBlends,
  setPreference,
} from "@/lib/blendStorage";
import { toast } from "@/hooks/use-toast";
import { useBlendStore } from "@/store/useBlendStore";

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

interface LabTabProps {
  shouldAnimate: boolean;
  showCharts: boolean;
}

export function LabTab({ shouldAnimate, showCharts }: LabTabProps) {
  const {
    catalogIngredients,
    catalogPresets,
    step,
    ingredients: ingredientsState,
    extras,
    burgerCount,
    burgerWeight,
    blendName,
    blendDescription,
    burgerStyle,
    grindSize,
    grindPass,
    prepStyle,
    prepTips,
    seasonings,
    showPicker,
    showExtrasPicker,
    targetFat,
    cmvTarget,
    roundingStep,
    fatSourceId,
    alertThresholds,
    priceOverrides,
    setStep,
    setBlendName,
    setBlendDescription,
    setBurgerCount,
    setBurgerWeight,
    setBurgerStyle,
    setGrindSize,
    setGrindPass,
    setSeasonings,
    setPrepStyle,
    setShowPicker,
    setShowExtrasPicker,
    setTargetFat,
    setCmvTarget,
    setRoundingStep,
    setFatSourceId,
    setIngredients,
    setSavedBlends,
    setHistoryEntries,
    applyPreset,
    startCustomBlend,
    updateIngredientPercentage,
    updateIngredientPercentageRaw,
    removeIngredient,
    removeIngredientRaw,
    addIngredient,
    addIngredientRaw,
    addExtra,
    updateExtra,
    removeExtra,
    applyTargetSuggestion,
    normalizeIngredients,
  } = useBlendStore((state) => ({
    catalogIngredients: state.catalogIngredients,
    catalogPresets: state.catalogPresets,
    step: state.step,
    ingredients: state.ingredients,
    extras: state.extras,
    burgerCount: state.burgerCount,
    burgerWeight: state.burgerWeight,
    blendName: state.blendName,
    blendDescription: state.blendDescription,
    burgerStyle: state.burgerStyle,
    grindSize: state.grindSize,
    grindPass: state.grindPass,
    prepStyle: state.prepStyle,
    prepTips: state.prepTips,
    seasonings: state.seasonings,
    showPicker: state.showPicker,
    showExtrasPicker: state.showExtrasPicker,
    targetFat: state.targetFat,
    cmvTarget: state.cmvTarget,
    roundingStep: state.roundingStep,
    fatSourceId: state.fatSourceId,
    alertThresholds: state.alertThresholds,
    priceOverrides: state.priceOverrides,
    setStep: state.setStep,
    setBlendName: state.setBlendName,
    setBlendDescription: state.setBlendDescription,
    setBurgerCount: state.setBurgerCount,
    setBurgerWeight: state.setBurgerWeight,
    setBurgerStyle: state.setBurgerStyle,
    setGrindSize: state.setGrindSize,
    setGrindPass: state.setGrindPass,
    setSeasonings: state.setSeasonings,
    setPrepStyle: state.setPrepStyle,
    setShowPicker: state.setShowPicker,
    setShowExtrasPicker: state.setShowExtrasPicker,
    setTargetFat: state.setTargetFat,
    setCmvTarget: state.setCmvTarget,
    setRoundingStep: state.setRoundingStep,
    setFatSourceId: state.setFatSourceId,
    setIngredients: state.setIngredients,
    setSavedBlends: state.setSavedBlends,
    setHistoryEntries: state.setHistoryEntries,
    applyPreset: state.applyPreset,
    startCustomBlend: state.startCustomBlend,
    updateIngredientPercentage: state.updateIngredientPercentage,
    updateIngredientPercentageRaw: state.updateIngredientPercentageRaw,
    removeIngredient: state.removeIngredient,
    removeIngredientRaw: state.removeIngredientRaw,
    addIngredient: state.addIngredient,
    addIngredientRaw: state.addIngredientRaw,
    addExtra: state.addExtra,
    updateExtra: state.updateExtra,
    removeExtra: state.removeExtra,
    applyTargetSuggestion: state.applyTargetSuggestion,
    normalizeIngredients: state.normalizeIngredients,
  }));

  const [inputMode, setInputMode] = useState<"percentage" | "grams">("percentage");

  const prepOptions = [
    { value: "Chapa", label: "Chapa" },
    { value: "Frigideira", label: "Frigideira" },
    { value: "Grelha", label: "Grelha" },
    { value: "Churrasqueira", label: "Churrasqueira" },
    { value: "Smash", label: "Smash" },
    { value: "Airfryer", label: "Airfryer" },
  ];

  const burgerStyleOptions = BURGER_STYLES.map((style) => ({
    value: style,
    label: style,
  }));

  const grindSizeOptions = [
    { value: GRIND_SIZES[0], label: "Fina (3mm)" },
    { value: GRIND_SIZES[1], label: "Media (5mm)" },
    { value: GRIND_SIZES[2], label: "Grossa (8mm)" },
  ];

  const grindPassOptions = [
    { value: GRIND_PASSES[0], label: "Simples" },
    { value: GRIND_PASSES[1], label: "Dupla" },
  ];

  const baseWeight = useMemo(
    () => calculateBaseWeight(burgerCount, burgerWeight),
    [burgerCount, burgerWeight],
  );

  const fatPercentage = useMemo(
    () => calculateFatPercentage(ingredientsState, extras, burgerCount, burgerWeight),
    [ingredientsState, extras, burgerCount, burgerWeight],
  );

  const totalPercentage = useMemo(
    () => ingredientsState.reduce((sum, item) => sum + item.percentage, 0),
    [ingredientsState],
  );

  const currentBlendWeight = useMemo(
    () => (baseWeight * totalPercentage) / 100,
    [baseWeight, totalPercentage],
  );

  const extraIngredients = useMemo(
    () => catalogIngredients.filter((ingredient) => ingredient.category === "extra"),
    [catalogIngredients],
  );

  const handleAdjustTotal = () => {
    if (burgerCount <= 0) return;
    const nextWeight = Math.max(1, Math.round(currentBlendWeight / burgerCount / 5) * 5);
    setBurgerWeight(nextWeight);
  };

  const handlePresetSelect = (preset: (typeof catalogPresets)[number]) => {
    applyPreset(preset);
  };

  const handleCustomBlend = () => {
    startCustomBlend();
  };

  const handleSaveBlend = async () => {
    const saved = await addSavedBlend({
      name: blendName,
      description: blendDescription,
      ingredients: ingredientsState,
      extras,
      burgerCount,
      burgerWeight,
      burgerStyle,
      grindSize,
      grindPass,
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

  const handleTargetChange = (value: number) => {
    setTargetFat(value);
    setPreference("targetFat", value);
  };

  const handleRoundingChange = (value: number) => {
    setRoundingStep(value);
    setPreference("roundingStep", value);
  };

  const handleCmvTargetChange = (value: number) => {
    const clamped = Math.min(60, Math.max(20, value));
    setCmvTarget(clamped);
    setPreference("cmvTarget", clamped);
  };

  const handleFatSourceChange = (value: string) => {
    setFatSourceId(value);
    setPreference("fatSourceId", value);
  };

  const handleApplyTargetSuggestion = (ingredientId: string, grams: number) => {
    applyTargetSuggestion(ingredientId, grams);
  };

  const handleIngredientChange = (ingredientId: string, value: number) => {
    if (inputMode === "grams") {
      updateIngredientPercentageRaw(ingredientId, value);
      return;
    }
    updateIngredientPercentage(ingredientId, value);
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    if (inputMode === "grams") {
      removeIngredientRaw(ingredientId);
      return;
    }
    removeIngredient(ingredientId);
  };

  const handleAddIngredient = (ingredientId: string) => {
    if (inputMode === "grams") {
      addIngredientRaw(ingredientId);
      return;
    }
    addIngredient(ingredientId);
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

  useEffect(() => {
    if (step !== "customize") return;
    if (typeof navigator === "undefined" || !navigator.onLine) return;
    import("@/components/BlendReport");
  }, [step]);

  return (
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

              <Button variant="warm" size="xl" className="w-full" onClick={handleCustomBlend}>
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

            <BlendSummary
              ingredients={ingredientsState}
              extras={extras}
              burgerCount={burgerCount}
              burgerWeight={burgerWeight}
              fatPercentage={fatPercentage}
              totalPercentage={totalPercentage}
              prepStyle={prepStyle}
            />

            <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Visualizacao de gordura
                  </h3>
                  <InfoTooltip label="Comparacao entre gordura e carne magra. Use para ajustar o alvo." />
                </div>
                <span className="text-xs text-muted-foreground">Gordura x Magro</span>
              </div>
              {showCharts ? (
                <Suspense fallback={chartFallback}>
                  <FatDonutChart fatPercentage={fatPercentage} animate={shouldAnimate} />
                </Suspense>
              ) : (
                <div className="rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground">
                  Modo economia de dados ativo. Graficos ocultos.
                </div>
              )}
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

            <ReverseBlendCalculator
              ingredients={catalogIngredients}
              baseWeight={baseWeight}
              onApply={(next) => {
                setIngredients(
                  next.map((item) => ({
                    ingredientId: item.ingredientId,
                    percentage: item.percentage,
                  })),
                );
              }}
            />

            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">Estilo do burger</h3>
                  <InfoTooltip label="Define textura final e influencia moagem e preparo." />
                </div>
                <span className="text-xs text-muted-foreground">Perfil de cocao</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {burgerStyleOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={burgerStyle === option.value ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setBurgerStyle(option.value)}
                    className="rounded-full"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Escolha o estilo que melhor representa a experiencia desejada.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">Moagem</h3>
                  <InfoTooltip label="Moagem define textura. Fina para smash, grossa para burger alto." />
                </div>
                <span className="text-xs text-muted-foreground">Granulometria</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Tamanho do disco</p>
                <div className="flex flex-wrap gap-2">
                  {grindSizeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={grindSize === option.value ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setGrindSize(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Passadas</p>
                <div className="flex flex-wrap gap-2">
                  {grindPassOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={grindPass === option.value ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setGrindPass(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">Equipamento de cocao</h3>
                  <InfoTooltip label="Afeta alertas de gordura e sugestoes de preparo." />
                </div>
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
              burgerStyle={burgerStyle}
              thresholds={alertThresholds}
            />

            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Modo de ajuste</span>
                  <InfoTooltip label="Porcentagem mantem o total em 100%. Gramas ajusta pelo peso base do blend." />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={inputMode === "percentage" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => {
                      setInputMode("percentage");
                      normalizeIngredients();
                    }}
                  >
                    Percentual
                  </Button>
                  <Button
                    variant={inputMode === "grams" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setInputMode("grams")}
                  >
                    Gramas
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Base: {baseWeight >= 1000 ? `${(baseWeight / 1000).toFixed(2)}kg` : `${baseWeight}g`}
                </div>
              </div>
              {inputMode === "grams" && (
                <div className="rounded-xl bg-background p-3 text-xs text-muted-foreground space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Total atual</span>
                    <span
                      className={
                        totalPercentage === 100 ? "text-vegan-green" : "text-fat-warning"
                      }
                    >
                      {formatWeight(currentBlendWeight)}{" "}
                      {totalPercentage === 100
                        ? "(ok)"
                        : `(${totalPercentage > 100 ? "+" : "-"}${formatWeight(
                            Math.abs(currentBlendWeight - baseWeight),
                          )})`}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default" size="sm" onClick={normalizeIngredients}>
                      Normalizar para 100%
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleAdjustTotal}
                      disabled={currentBlendWeight <= 0}
                    >
                      Ajustar total base
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Normalizar redistribui os percentuais. Ajustar total recalcula o peso por burger.
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Blend da carne
                    </h3>
                    <InfoTooltip label="Aqui entra apenas a carne base. O total precisa fechar 100%." />
                  </div>
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
                    onPercentageChange={(value) => handleIngredientChange(item.ingredientId, value)}
                    onRemove={() => handleRemoveIngredient(item.ingredientId)}
                    showRemove={ingredientsState.length > 1}
                    prepStyle={prepStyle}
                    inputMode={inputMode}
                    baseWeight={baseWeight}
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
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">Roda de sabores</h3>
                  <InfoTooltip label="Equilibrio de salgado, umami, doce e picante conforme ingredientes." />
                </div>
                <span className="text-xs text-muted-foreground">Salgado ao picante</span>
              </div>
              {showCharts ? (
                <Suspense fallback={chartFallback}>
                  <FlavorRadarChart
                    ingredients={ingredientsState}
                    extras={extras}
                    burgerCount={burgerCount}
                    burgerWeight={burgerWeight}
                    animate={shouldAnimate}
                  />
                </Suspense>
              ) : (
                <div className="rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground">
                  Modo economia de dados ativo. Graficos ocultos.
                </div>
              )}
            </div>

            <QuantityCalculator
              burgerCount={burgerCount}
              burgerWeight={burgerWeight}
              onBurgerCountChange={setBurgerCount}
              onBurgerWeightChange={setBurgerWeight}
            />

            <CostSimulator
              ingredients={ingredientsState}
              extras={extras}
              burgerCount={burgerCount}
              burgerWeight={burgerWeight}
              cmvTarget={cmvTarget}
              priceOverrides={priceOverrides}
              onCmvTargetChange={handleCmvTargetChange}
            />

            <AnimatePresence>
              {showPicker && (
                <IngredientPicker
                  ingredients={catalogIngredients}
                  selectedIds={ingredientsState.map((item) => item.ingredientId)}
                  onSelect={handleAddIngredient}
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
                burgerStyle={burgerStyle}
                grindSize={grindSize}
                grindPass={grindPass}
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

      {step === "customize" && (
        <div className="fixed left-0 right-0 bottom-24 z-40">
          <div className="max-w-md mx-auto px-4">
            <div className="rounded-2xl bg-background/95 border border-border shadow-card p-2 backdrop-blur">
              <Button variant="warm" size="xl" className="w-full" onClick={() => setStep("report")}>
                Gerar Receita Completa
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
