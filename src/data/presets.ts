export interface BlendIngredient {
  ingredientId: string;
  percentage: number;
}

export interface Preset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  ingredients: BlendIngredient[];
  estimatedFat: number;
  prepStyle: string;
  prepTips: string[];
  seasonings: string[];
  icon: string;
  category: 'classic' | 'premium' | 'smash' | 'vegan' | 'custom';
  color: 'meat' | 'gold' | 'orange' | 'green';
}

export const presets: Preset[] = [
  {
    id: 'classico',
    name: 'Blend Classico',
    subtitle: 'Acem + Fraldinha',
    description:
      'Equilibrio perfeito entre sabor intenso do acem e a maciez da fraldinha. O blend tradicional que nunca decepciona.',
    ingredients: [
      { ingredientId: 'acem', percentage: 70 },
      { ingredientId: 'fraldinha', percentage: 30 },
    ],
    estimatedFat: 16,
    prepStyle: 'Grelha ou Chapa',
    prepTips: [
      'Molde hamburgueres de 150-180g',
      'Grelhe em fogo alto por 4 min cada lado',
      'Deixe descansar 2 min antes de servir',
    ],
    seasonings: ['Sal grosso', 'Pimenta-do-reino', 'Alho em po'],
    icon: '🍔',
    category: 'classic',
    color: 'meat',
  },
  {
    id: 'premium',
    name: 'Blend Premium',
    subtitle: 'Acem + Picanha',
    description:
      'Combinacao nobre com a riqueza da picanha. Sabor intenso e suculencia incomparavel para momentos especiais.',
    ingredients: [
      { ingredientId: 'acem', percentage: 70 },
      { ingredientId: 'picanha', percentage: 30 },
    ],
    estimatedFat: 19,
    prepStyle: 'Churrasqueira',
    prepTips: [
      'Ideal para hamburgueres de 180-220g',
      'Grelhe com a tampa fechada',
      'Aproveite a gordura para sabor defumado',
    ],
    seasonings: ['Sal grosso', 'Paprica defumada', 'Chimichurri'],
    icon: '🥩',
    category: 'premium',
    color: 'gold',
  },
  {
    id: 'smash',
    name: 'Blend Smash',
    subtitle: '70% Magra + 30% Gordura',
    description:
      'Proporcao perfeita para smash burgers. Crosta caramelizada irresistivel com interior ultra-suculento.',
    ingredients: [
      { ingredientId: 'acem', percentage: 70 },
      { ingredientId: 'gordura-bovina', percentage: 30 },
    ],
    estimatedFat: 40,
    prepStyle: 'Chapa Quente',
    prepTips: [
      'Bolas de 80-100g',
      'Pressione com espatula ate ficar fino',
      'Apenas 1-2 min cada lado',
      'Nao mexa ate formar crosta',
    ],
    seasonings: ['Sal na hora', 'Pimenta-do-reino', 'Paprica defumada'],
    icon: '🔥',
    category: 'smash',
    color: 'orange',
  },
  {
    id: 'vegano',
    name: 'Blend Vegano',
    subtitle: 'Feijao + Cogumelos',
    description:
      'Vegetal e aromatico com umami intenso dos cogumelos. Textura surpreendente que agrada ate os carnivoros.',
    ingredients: [
      { ingredientId: 'feijao-preto', percentage: 55 },
      { ingredientId: 'cogumelo', percentage: 45 },
    ],
    estimatedFat: 1,
    prepStyle: 'Chapa com Azeite',
    prepTips: [
      'Molde hamburgueres firmes de 120-150g',
      'Adicione azeite na chapa',
      'Fogo medio, 3-4 min cada lado',
      'Manuseie com cuidado ao virar',
    ],
    seasonings: ['Cominho', 'Coentro em po', 'Paprica picante', 'Alho'],
    icon: '🌱',
    category: 'vegan',
    color: 'green',
  },
];

export const getPresetById = (id: string): Preset | undefined => {
  return presets.find((preset) => preset.id === id);
};
