import { motion } from 'framer-motion';
import { Minus, Plus, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuantityCalculatorProps {
  burgerCount: number;
  burgerWeight: number;
  onBurgerCountChange: (count: number) => void;
  onBurgerWeightChange: (weight: number) => void;
}

const weightOptions = [80, 100, 120, 150, 180, 220];

export function QuantityCalculator({
  burgerCount,
  burgerWeight,
  onBurgerCountChange,
  onBurgerWeightChange,
}: QuantityCalculatorProps) {
  const totalWeight = burgerCount * burgerWeight;

  return (
    <div className="space-y-6 p-5 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Scale className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Calculadora</h3>
          <p className="text-sm text-muted-foreground">Defina a quantidade desejada</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Quantidade de Hamburgueres</label>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onBurgerCountChange(Math.max(1, burgerCount - 1))}
            disabled={burgerCount <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <motion.span
            key={burgerCount}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-4xl font-display font-bold text-foreground min-w-[4rem] text-center"
          >
            {burgerCount}
          </motion.span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onBurgerCountChange(Math.min(50, burgerCount + 1))}
            disabled={burgerCount >= 50}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Peso por Hamburguer (gramas)</label>
        <div className="grid grid-cols-3 gap-2">
          {weightOptions.map((weight) => (
            <Button
              key={weight}
              variant={burgerWeight === weight ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onBurgerWeightChange(weight)}
              className={cn('h-12 text-lg font-medium', burgerWeight === weight && 'shadow-warm')}
            >
              {weight}g
            </Button>
          ))}
        </div>
      </div>

      <motion.div
        key={totalWeight}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="p-4 rounded-xl bg-primary/10 border border-primary/20"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Peso Total Necessario</span>
          <span className="text-2xl font-display font-bold text-primary">
            {totalWeight >= 1000 ? `${(totalWeight / 1000).toFixed(1)}kg` : `${totalWeight}g`}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
