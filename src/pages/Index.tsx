import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Bookmark, Plus, Sparkles } from 'lucide-react';
import { BlendCard } from '@/components/BlendCard';
import { BlendReport } from '@/components/BlendReport';
import { BurgerStack } from '@/components/BurgerStack';
import { BottomNav, type BottomTab } from '@/components/BottomNav';
import { ExtraPicker } from '@/components/ExtraPicker';
import { ExtrasSection } from '@/components/ExtrasSection';
import { FatIndicator } from '@/components/FatIndicator';
import { FatDonutChart } from '@/components/FatDonutChart';
import { FatExplanationDialog } from '@/components/FatExplanationDialog';
import { FlavorRadarChart } from '@/components/FlavorRadarChart';
import { Header } from '@/components/Header';
import { IngredientPicker } from '@/components/IngredientPicker';
import { IngredientSlider } from '@/components/IngredientSlider';
import { QuantityCalculator } from '@/components/QuantityCalculator';
import { SavedBlendCard } from '@/components/SavedBlendCard';
import { SmartAlerts } from '@/components/SmartAlerts';
import { Stepper } from '@/components/Stepper';
import { TargetLock } from '@/components/TargetLock';
import { TargetProgress } from '@/components/TargetProgress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ingredients } from '@/data/ingredients';
import { presets, type BlendIngredient, type Preset } from '@/data/presets';
import { calculateFatPercentage } from '@/lib/blendMath';
import {
  addHistoryEntry,
  addSavedBlend,
  deleteSavedBlend,
  getPreference,
  loadHistory,
  loadSavedBlends,
  setPreference,
} from '@/lib/blendStorage';
import { toast } from '@/hooks/use-toast';
import { useWakeLock } from '@/hooks/use-wake-lock';
import type { BlendExtra, BlendHistoryEntry, SavedBlend } from '@/types/blend';

type AppStep = 'home' | 'customize' | 'report';

const DEFAULT_PREP_STYLE = 'Chapa ou Grelha';
const DEFAULT_PREP_TIPS = [
  'Misture os ingredientes e moa duas vezes',
  'Molde sem apertar demais',
  'Grelhe em fogo alto',
  'Deixe descansar antes de servir',
];
const DEFAULT_SEASONINGS = ['Sal grosso', 'Pimenta-do-reino'];
const formatDate = (value: string) => new Date(value).toLocaleDateString('pt-BR');

const wikiSections = [
  {
    id: 'bovine',
    title: 'Bovinos',
    description: 'Cortes ricos em sabor e textura para blends tradicionais.',
  },
  {
    id: 'pork',
    title: 'Suinos',
    description: 'Suinos trazem doçura e gordura equilibrada para misturas.',
  },
  {
    id: 'vegan',
    title: 'Veganos',
    description: 'Bases vegetais com fibras, textura e umami natural.',
  },
  {
    id: 'extra',
    title: 'Extras',
    description: 'Adicoes aromaticas para ajustar sabor e suculencia.',
  },
] as const;

export default function Index() {
  const [activeTab, setActiveTab] = useState<BottomTab>('lab');
  const [step, setStep] = useState<AppStep>('home');
  const [ingredientsState, setIngredients] = useState<BlendIngredient[]>([]);
  const [extras, setExtras] = useState<BlendExtra[]>([]);
  const [burgerCount, setBurgerCount] = useState(4);
  const [burgerWeight, setBurgerWeight] = useState(150);
  const [blendName, setBlendName] = useState('Meu Blend');
  const [blendDescription, setBlendDescription] = useState('Blend personalizado');
  const [prepStyle, setPrepStyle] = useState(DEFAULT_PREP_STYLE);
  const [prepTips, setPrepTips] = useState(DEFAULT_PREP_TIPS);
  const [seasonings, setSeasonings] = useState(DEFAULT_SEASONINGS);
  const [showPicker, setShowPicker] = useState(false);
  const [showExtrasPicker, setShowExtrasPicker] = useState(false);
  const [savedBlends, setSavedBlends] = useState<SavedBlend[]>([]);
  const [historyEntries, setHistoryEntries] = useState<BlendHistoryEntry[]>([]);
  const [targetFat, setTargetFat] = useState(22);
  const [roundingStep, setRoundingStep] = useState(10);
  const [fatSourceId, setFatSourceId] = useState('gordura-bovina');
  const [wakeLockEnabled, setWakeLockEnabled] = useState(false);
  const wakeLockSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;

  useWakeLock(wakeLockEnabled);

  useEffect(() => {
    let isActive = true;
    const loadData = async () => {
      const [blends, history, prefTarget, prefStep, prefSource, prefWake] = await Promise.all([
        loadSavedBlends(),
        loadHistory(10),
        getPreference('targetFat'),
        getPreference('roundingStep'),
        getPreference('fatSourceId'),
        getPreference('wakeLockEnabled'),
      ]);
      if (!isActive) return;
      setSavedBlends(blends);
      setHistoryEntries(history);
      if (typeof prefTarget === 'number') setTargetFat(prefTarget);
      if (typeof prefStep === 'number') setRoundingStep(prefStep);
      if (typeof prefSource === 'string') setFatSourceId(prefSource);
      if (typeof prefWake === 'boolean') setWakeLockEnabled(prefWake);
    };
    loadData();
    return () => {
      isActive = false;
    };
  }, []);

  const fatPercentage = useMemo(
    () => calculateFatPercentage(ingredientsState, extras, burgerCount, burgerWeight),
    [ingredientsState, extras, burgerCount, burgerWeight],
  );

  const totalPercentage = useMemo(
    () => ingredientsState.reduce((sum, item) => sum + item.percentage, 0),
    [ingredientsState],
  );

  const handlePresetSelect = (preset: Preset) => {
    setIngredients([...preset.ingredients]);
    setExtras([]);
    setBlendName(preset.name);
    setBlendDescription(preset.description);
    setPrepStyle(preset.prepStyle);
    setPrepTips(preset.prepTips);
    setSeasonings(preset.seasonings);
    setStep('customize');
    setActiveTab('lab');
  };

  const handleCustomBlend = () => {
    setIngredients([
      { ingredientId: 'acem', percentage: 70 },
      { ingredientId: 'fraldinha', percentage: 30 },
    ]);
    setExtras([]);
    setBlendName('Blend Personalizado');
    setBlendDescription('Criacao exclusiva');
    setPrepStyle(DEFAULT_PREP_STYLE);
    setPrepTips(DEFAULT_PREP_TIPS);
    setSeasonings(DEFAULT_SEASONINGS);
    setStep('customize');
    setActiveTab('lab');
  };

  const handleLoadSavedBlend = (blend: SavedBlend) => {
    setIngredients(blend.ingredients);
    setExtras(blend.extras ?? []);
    setBurgerCount(blend.burgerCount);
    setBurgerWeight(blend.burgerWeight);
    setBlendName(blend.name);
    setBlendDescription(blend.description);
    setPrepStyle(blend.prepStyle || DEFAULT_PREP_STYLE);
    setPrepTips(blend.prepTips?.length ? blend.prepTips : DEFAULT_PREP_TIPS);
    setSeasonings(blend.seasonings?.length ? blend.seasonings : DEFAULT_SEASONINGS);
    setStep('customize');
    setActiveTab('lab');
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
      title: 'Blend salvo!',
      description: 'Seu blend foi adicionado aos favoritos.',
    });
  };

  const handleDeleteBlend = async (blend: SavedBlend) => {
    if (!window.confirm('Excluir blend salvo?')) return;
    await deleteSavedBlend(blend.id);
    const blends = await loadSavedBlends();
    setSavedBlends(blends);
    toast({
      title: 'Blend removido',
      description: 'O blend foi removido da sua lista.',
    });
  };

  const handleIngredientPercentageChange = (ingredientId: string, newPercentage: number) => {
    setIngredients((prev) => {
      const updated = prev.map((item) =>
        item.ingredientId === ingredientId ? { ...item, percentage: newPercentage } : item,
      );

      const total = updated.reduce((sum, item) => sum + item.percentage, 0);
      if (total !== 100 && total > 0) {
        const factor = 100 / total;
        return updated.map((item) => ({
          ...item,
          percentage: Math.round(item.percentage * factor),
        }));
      }
      return updated;
    });
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    if (ingredientsState.length <= 1) return;

    const remaining = ingredientsState.filter((item) => item.ingredientId !== ingredientId);
    const total = remaining.reduce((sum, item) => sum + item.percentage, 0);

    if (total > 0) {
      const factor = 100 / total;
      setIngredients(
        remaining.map((item) => ({
          ...item,
          percentage: Math.round(item.percentage * factor),
        })),
      );
    }
  };

  const handleAddIngredient = (ingredientId: string) => {
    const newPercentage = 10;
    const remainingPercentage = 100 - newPercentage;
    const factor = remainingPercentage / 100;

    setIngredients((prev) => [
      ...prev.map((item) => ({ ...item, percentage: Math.round(item.percentage * factor) })),
      { ingredientId, percentage: newPercentage },
    ]);
  };

  const handleAddExtra = (ingredientId: string) => {
    setExtras((prev) => {
      if (prev.some((extra) => extra.ingredientId === ingredientId)) return prev;
      return [...prev, { ingredientId, grams: 50 }];
    });
  };

  const handleExtraChange = (ingredientId: string, grams: number) => {
    const clamped = Math.min(300, Math.max(0, grams));
    setExtras((prev) =>
      prev.map((extra) => (extra.ingredientId === ingredientId ? { ...extra, grams: clamped } : extra)),
    );
  };

  const handleRemoveExtra = (ingredientId: string) => {
    setExtras((prev) => prev.filter((extra) => extra.ingredientId !== ingredientId));
  };

  const handleTargetChange = (value: number) => {
    setTargetFat(value);
    setPreference('targetFat', value);
  };

  const handleRoundingChange = (value: number) => {
    setRoundingStep(value);
    setPreference('roundingStep', value);
  };

  const handleFatSourceChange = (value: string) => {
    setFatSourceId(value);
    setPreference('fatSourceId', value);
  };

  const handleApplyTargetSuggestion = (ingredientId: string, grams: number) => {
    setExtras((prev) => {
      const existing = prev.find((extra) => extra.ingredientId === ingredientId);
      if (existing) {
        return prev.map((extra) =>
          extra.ingredientId === ingredientId ? { ...extra, grams } : extra,
        );
      }
      return [...prev, { ingredientId, grams }];
    });
  };

  const groupedIngredients = useMemo(() => {
    return wikiSections.map((section) => ({
      ...section,
      items: ingredients.filter((ingredient) => ingredient.category === section.id),
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'lab' && (
            <motion.section
              key="lab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <Stepper current={step} onStepChange={setStep} />

              <AnimatePresence mode="wait">
                {step === 'home' && (
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
                          {presets.map((preset, index) => (
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

                {step === 'customize' && (
                  <motion.div
                    key="lab-customize"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 pt-6"
                  >
                    <div className="flex items-start gap-3">
                      <Button variant="ghost" size="icon" onClick={() => setStep('home')}>
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
                      <FatDonutChart fatPercentage={fatPercentage} />
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

                    <SmartAlerts
                      ingredients={ingredientsState}
                      fatPercentage={fatPercentage}
                      prepStyle={prepStyle}
                    />

                    <section className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold text-foreground">Ingredientes</h3>
                        <span
                          className={`text-sm ${totalPercentage === 100 ? 'text-vegan-green' : 'text-fat-warning'}`}
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
                              handleIngredientPercentageChange(item.ingredientId, value)
                            }
                            onRemove={() => handleRemoveIngredient(item.ingredientId)}
                            showRemove={ingredientsState.length > 1}
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
                      onChange={handleExtraChange}
                      onRemove={handleRemoveExtra}
                    />

                    <BurgerStack extras={extras} />

                    <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          Roda de sabores
                        </h3>
                        <span className="text-xs text-muted-foreground">Salgado ao picante</span>
                      </div>
                      <FlavorRadarChart
                        ingredients={ingredientsState}
                        extras={extras}
                        burgerCount={burgerCount}
                        burgerWeight={burgerWeight}
                      />
                    </div>

                    <QuantityCalculator
                      burgerCount={burgerCount}
                      burgerWeight={burgerWeight}
                      onBurgerCountChange={setBurgerCount}
                      onBurgerWeightChange={setBurgerWeight}
                    />

                    <Button
                      variant="warm"
                      size="xl"
                      className="w-full"
                      onClick={() => setStep('report')}
                    >
                      Gerar Receita Completa
                    </Button>

                    <AnimatePresence>
                      {showPicker && (
                        <IngredientPicker
                          selectedIds={ingredientsState.map((item) => item.ingredientId)}
                          onSelect={handleAddIngredient}
                          onClose={() => setShowPicker(false)}
                        />
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {showExtrasPicker && (
                        <ExtraPicker
                          selectedIds={extras.map((extra) => extra.ingredientId)}
                          onSelect={handleAddExtra}
                          onClose={() => setShowExtrasPicker(false)}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {step === 'report' && (
                  <motion.div
                    key="lab-report"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="pt-6"
                  >
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
                      onBack={() => setStep('customize')}
                      onSave={handleSaveBlend}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}

          {activeTab === 'wiki' && (
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
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-card border border-border flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h3 className="font-medium text-foreground">{item.name}</h3>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-primary">{item.fatPercentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.section>
          )}

          {activeTab === 'grill' && (
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
                            {entry.snapshot.burgerCount}x {entry.snapshot.burgerWeight}g • {entry.snapshot.fatPercentage}% gordura
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

          {activeTab === 'tools' && (
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
                <Button variant="warm" className="w-full" disabled>
                  Ativar (em breve)
                </Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
