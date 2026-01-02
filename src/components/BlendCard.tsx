import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Preset } from '@/data/presets';
import { cn } from '@/lib/utils';

interface BlendCardProps {
  preset: Preset;
  onClick: () => void;
  index: number;
}

const colorVariants = {
  meat: 'from-meat-red/20 to-meat-brown/20 border-meat-red/30 hover:border-meat-red',
  gold: 'from-cheese-gold/20 to-grill-orange/20 border-cheese-gold/30 hover:border-cheese-gold',
  orange: 'from-grill-orange/20 to-cheese-gold/20 border-grill-orange/30 hover:border-grill-orange',
  green: 'from-vegan-green/20 to-vegan-green/10 border-vegan-green/30 hover:border-vegan-green',
};

const iconBgVariants = {
  meat: 'bg-meat-red/20',
  gold: 'bg-cheese-gold/20',
  orange: 'bg-grill-orange/20',
  green: 'bg-vegan-green/20',
};

export function BlendCard({ preset, onClick, index }: BlendCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'w-full p-5 rounded-2xl border-2 bg-gradient-to-br transition-all duration-300',
        'hover:shadow-card hover:scale-[1.02] active:scale-[0.98]',
        'text-left group',
        colorVariants[preset.color]
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center text-3xl',
          iconBgVariants[preset.color]
        )}>
          {preset.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-foreground truncate">
              {preset.name}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {preset.subtitle}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs px-2 py-1 rounded-full bg-card text-muted-foreground">
              {preset.estimatedFat}% gordura
            </span>
            <span className="text-xs text-muted-foreground">
              {preset.prepStyle}
            </span>
          </div>
        </div>
        
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
      </div>
    </motion.button>
  );
}
