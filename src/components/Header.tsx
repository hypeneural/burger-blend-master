import { motion } from 'framer-motion';
import { ChefHat, Sparkles } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = "Blend Master", subtitle = "Crie seu hambúrguer perfeito" }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-6 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-grill-orange to-cheese-gold flex items-center justify-center shadow-warm"
      >
        <ChefHat className="w-8 h-8 text-primary-foreground" />
      </motion.div>
      <h1 className="font-display text-3xl font-bold text-foreground">
        {title}
      </h1>
      <p className="text-muted-foreground mt-1 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4" />
        {subtitle}
      </p>
    </motion.header>
  );
}
