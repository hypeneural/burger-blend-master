import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { BlendCard } from '@/components/BlendCard';
import { QuantityCalculator } from '@/components/QuantityCalculator';
import { FatIndicator } from '@/components/FatIndicator';
import { IngredientSlider } from '@/components/IngredientSlider';
import { IngredientPicker } from '@/components/IngredientPicker';
import { BlendReport } from '@/components/BlendReport';
import { Button } from '@/components/ui/button';
import { presets, type Preset, type BlendIngredient } from '@/data/presets';
import { getIngredientById } from '@/data/ingredients';

type AppStep = 'home' | 'customize' | 'report';

export default function Index() {
  const [step, setStep] = useState<AppStep>('home');
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [ingredients, setIngredients] = useState<BlendIngredient[]>([]);
  const [burgerCount, setBurgerCount] = useState(4);
  const [burgerWeight, setBurgerWeight] = useState(150);
  const [blendName, setBlendName] = useState('Meu Blend');
  const [blendDescription, setBlendDescription] = useState('Blend personalizado');
  const [showPicker, setShowPicker] = useState(false);

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset);
    setIngredients([...preset.ingredients]);
    setBlendName(preset.name);
    setBlendDescription(preset.description);
    setStep('customize');
  };

  const handleCustomBlend = () => {
    setSelectedPreset(null);
    setIngredients([
      { ingredientId: 'acem', percentage: 70 },
      { ingredientId: 'fraldinha', percentage: 30 },
    ]);
    setBlendName('Blend Personalizado');
    setBlendDescription('Criação exclusiva');
    setStep('customize');
  };

  const handleIngredientPercentageChange = (ingredientId: string, newPercentage: number) => {
    setIngredients(prev => {
      const updated = prev.map(i => 
        i.ingredientId === ingredientId ? { ...i, percentage: newPercentage } : i
      );
      
      // Normalize to 100%
      const total = updated.reduce((sum, i) => sum + i.percentage, 0);
      if (total !== 100 && total > 0) {
        const factor = 100 / total;
        return updated.map(i => ({
          ...i,
          percentage: Math.round(i.percentage * factor)
        }));
      }
      return updated;
    });
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    if (ingredients.length <= 1) return;
    
    const remaining = ingredients.filter(i => i.ingredientId !== ingredientId);
    const total = remaining.reduce((sum, i) => sum + i.percentage, 0);
    
    if (total > 0) {
      const factor = 100 / total;
      setIngredients(remaining.map(i => ({
        ...i,
        percentage: Math.round(i.percentage * factor)
      })));
    }
  };

  const handleAddIngredient = (ingredientId: string) => {
    // Add new ingredient with 10% and redistribute
    const newPercentage = 10;
    const remainingPercentage = 100 - newPercentage;
    const factor = remainingPercentage / 100;
    
    setIngredients(prev => [
      ...prev.map(i => ({ ...i, percentage: Math.round(i.percentage * factor) })),
      { ingredientId, percentage: newPercentage }
    ]);
  };

  const calculateFat = () => {
    let totalFat = 0;
    ingredients.forEach((item) => {
      const ingredient = getIngredientById(item.ingredientId);
      if (ingredient) {
        totalFat += (item.percentage / 100) * ingredient.fatPercentage;
      }
    });
    return Math.round(totalFat);
  };

  const totalPercentage = ingredients.reduce((sum, i) => sum + i.percentage, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          {step === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Header />
              
              <div className="space-y-6">
                {/* Presets Section */}
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

                {/* Custom Blend Button */}
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
              key="customize"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pt-6"
            >
              {/* Header */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setStep('home')}>
                  ←
                </Button>
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">{blendName}</h1>
                  <p className="text-sm text-muted-foreground">{blendDescription}</p>
                </div>
              </div>

              {/* Fat Indicator */}
              <div className="p-5 rounded-2xl bg-card border border-border">
                <FatIndicator percentage={calculateFat()} />
              </div>

              {/* Ingredients */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">Ingredientes</h3>
                  <span className={`text-sm ${totalPercentage === 100 ? 'text-vegan-green' : 'text-fat-warning'}`}>
                    {totalPercentage}%
                  </span>
                </div>
                
                <AnimatePresence>
                  {ingredients.map((item) => (
                    <IngredientSlider
                      key={item.ingredientId}
                      ingredientId={item.ingredientId}
                      percentage={item.percentage}
                      onPercentageChange={(v) => handleIngredientPercentageChange(item.ingredientId, v)}
                      onRemove={() => handleRemoveIngredient(item.ingredientId)}
                      showRemove={ingredients.length > 1}
                    />
                  ))}
                </AnimatePresence>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPicker(true)}
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Ingrediente
                </Button>
              </section>

              {/* Calculator */}
              <QuantityCalculator
                burgerCount={burgerCount}
                burgerWeight={burgerWeight}
                onBurgerCountChange={setBurgerCount}
                onBurgerWeightChange={setBurgerWeight}
              />

              {/* Generate Report Button */}
              <Button
                variant="warm"
                size="xl"
                className="w-full"
                onClick={() => setStep('report')}
              >
                Gerar Receita Completa
              </Button>

              {/* Ingredient Picker Modal */}
              <AnimatePresence>
                {showPicker && (
                  <IngredientPicker
                    selectedIds={ingredients.map(i => i.ingredientId)}
                    onSelect={handleAddIngredient}
                    onClose={() => setShowPicker(false)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {step === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pt-6"
            >
              <BlendReport
                name={blendName}
                description={blendDescription}
                ingredients={ingredients}
                burgerCount={burgerCount}
                burgerWeight={burgerWeight}
                prepStyle={selectedPreset?.prepStyle || 'Chapa ou Grelha'}
                prepTips={selectedPreset?.prepTips || [
                  'Misture os ingredientes e moa duas vezes',
                  'Molde sem apertar demais',
                  'Grelhe em fogo alto',
                  'Deixe descansar antes de servir'
                ]}
                seasonings={selectedPreset?.seasonings || ['Sal grosso', 'Pimenta-do-reino']}
                onBack={() => setStep('customize')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
