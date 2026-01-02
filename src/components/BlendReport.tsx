import { motion } from 'framer-motion';
import { ChefHat, Flame, Leaf, Save, Share2, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FatIndicator } from '@/components/FatIndicator';
import { IngredientBreakdown } from '@/components/IngredientBreakdown';
import { getIngredientById } from '@/data/ingredients';
import type { BlendIngredient } from '@/data/presets';
import { toast } from '@/hooks/use-toast';

interface BlendReportProps {
  name: string;
  description: string;
  ingredients: BlendIngredient[];
  burgerCount: number;
  burgerWeight: number;
  prepStyle: string;
  prepTips: string[];
  seasonings: string[];
  onBack: () => void;
}

export function BlendReport({
  name,
  description,
  ingredients,
  burgerCount,
  burgerWeight,
  prepStyle,
  prepTips,
  seasonings,
  onBack,
}: BlendReportProps) {
  const totalWeight = burgerCount * burgerWeight;
  
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

  const fatPercentage = calculateFat();

  const handleSave = () => {
    toast({
      title: "Blend salvo!",
      description: "Seu blend foi adicionado aos favoritos.",
    });
  };

  const handleShare = () => {
    const shareText = `${name}\n${description}\n\nIngredientes:\n${ingredients.map(i => {
      const ing = getIngredientById(i.ingredientId);
      return `• ${ing?.name}: ${i.percentage}%`;
    }).join('\n')}\n\nGordura: ${fatPercentage}%`;
    
    if (navigator.share) {
      navigator.share({
        title: name,
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copiado!",
        description: "Receita copiada para a área de transferência.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-grill-orange to-cheese-gold flex items-center justify-center shadow-warm"
        >
          <span className="text-4xl">🍔</span>
        </motion.div>
        <h1 className="font-display text-2xl font-bold text-foreground">{name}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Quantity Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <span className="text-3xl font-display font-bold text-foreground">{burgerCount}</span>
          <p className="text-sm text-muted-foreground">hambúrgueres</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <span className="text-3xl font-display font-bold text-foreground">{burgerWeight}g</span>
          <p className="text-sm text-muted-foreground">cada</p>
        </div>
      </div>

      {/* Fat Indicator */}
      <div className="p-5 rounded-2xl bg-card border border-border">
        <FatIndicator percentage={fatPercentage} />
      </div>

      {/* Ingredients */}
      <IngredientBreakdown ingredients={ingredients} totalWeight={totalWeight} />

      {/* Prep Instructions */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-grill-orange/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-grill-orange" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">Modo de Preparo</h3>
            <p className="text-sm text-muted-foreground">{prepStyle}</p>
          </div>
        </div>
        
        <ul className="space-y-2">
          {prepTips.map((tip, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-3 text-sm text-foreground"
            >
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
                {index + 1}
              </span>
              {tip}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Seasonings */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-meat-red/20 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-meat-red" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">Temperos Sugeridos</h3>
            <p className="text-sm text-muted-foreground">Para realçar o sabor</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {seasonings.map((seasoning, index) => (
            <motion.span
              key={seasoning}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="px-3 py-1.5 rounded-full bg-background text-sm text-foreground border border-border"
            >
              🧂 {seasoning}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1" onClick={handleSave}>
          <Save className="w-4 h-4" />
          Salvar
        </Button>
        <Button variant="warm" className="flex-1" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
      </div>

      <Button variant="ghost" className="w-full" onClick={onBack}>
        ← Voltar e ajustar
      </Button>
    </motion.div>
  );
}
