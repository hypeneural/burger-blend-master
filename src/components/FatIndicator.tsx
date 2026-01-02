import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FatIndicatorProps {
  percentage: number;
  className?: string;
}

export function FatIndicator({ percentage, className }: FatIndicatorProps) {
  const getStatus = () => {
    if (percentage < 15) {
      return {
        status: 'low',
        color: 'text-muted-foreground',
        bg: 'bg-muted',
        label: 'Baixa',
        description: 'Pode ficar seco',
      };
    }
    if (percentage <= 25) {
      return {
        status: 'ideal',
        color: 'text-vegan-green',
        bg: 'bg-vegan-green/20',
        label: 'Ideal',
        description: 'Perfeito equilibrio',
      };
    }
    if (percentage <= 30) {
      return {
        status: 'good',
        color: 'text-cheese-gold',
        bg: 'bg-cheese-gold/20',
        label: 'Alta',
        description: 'Muito suculento',
      };
    }
    return {
      status: 'warning',
      color: 'text-fat-danger',
      bg: 'bg-fat-danger/20',
      label: 'Excessiva',
      description: 'Pode encolher muito',
    };
  };

  const { status, color, bg, label, description } = getStatus();
  const clampedPercentage = Math.min(percentage, 50);
  const barWidth = (clampedPercentage / 50) * 100;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className={cn('w-5 h-5', color)} />
          <span className="font-medium text-foreground">Teor de Gordura</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            key={percentage}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn('text-2xl font-display font-bold', color)}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>

      <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-[30%] border-r border-background/20" />
          <div className="w-[20%] border-r border-background/20 bg-vegan-green/10" />
          <div className="w-[10%] border-r border-background/20 bg-cheese-gold/10" />
          <div className="flex-1 bg-fat-danger/10" />
        </div>

        <motion.div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full',
            status === 'ideal'
              ? 'bg-vegan-green'
              : status === 'good'
              ? 'bg-cheese-gold'
              : status === 'warning'
              ? 'bg-fat-danger'
              : 'bg-muted-foreground',
          )}
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>0%</span>
        <span className="text-vegan-green">15-25% ideal</span>
        <span>50%</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={cn('flex items-center gap-2 p-3 rounded-lg', bg)}
        >
          {status === 'warning' ? (
            <AlertTriangle className={cn('w-4 h-4', color)} />
          ) : status === 'ideal' ? (
            <Check className={cn('w-4 h-4', color)} />
          ) : (
            <Flame className={cn('w-4 h-4', color)} />
          )}
          <div>
            <span className={cn('font-medium text-sm', color)}>{label}</span>
            <span className="text-muted-foreground text-sm ml-2">- {description}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
