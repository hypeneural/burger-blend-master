import { Beef, Leaf, PiggyBank, Sparkles } from 'lucide-react';
import type { IngredientCategory } from '@/data/constants';
import { cn } from '@/lib/utils';

const iconMap: Record<IngredientCategory, typeof Beef> = {
  bovine: Beef,
  pork: PiggyBank,
  vegan: Leaf,
  extra: Sparkles,
};

const colorMap: Record<IngredientCategory, string> = {
  bovine: 'text-meat-red',
  pork: 'text-grill-orange',
  vegan: 'text-vegan-green',
  extra: 'text-cheese-gold',
};

interface IngredientIconProps {
  category: IngredientCategory;
  className?: string;
}

export function IngredientIcon({ category, className }: IngredientIconProps) {
  const Icon = iconMap[category] ?? Sparkles;
  return <Icon className={cn('h-5 w-5', colorMap[category], className)} />;
}
