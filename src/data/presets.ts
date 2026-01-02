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
    name: 'Blend Clássico',
    subtitle: 'Acém + Fraldinha',
    description: 'Equilíbrio perfeito entre sabor intenso do acém e a maciez da fraldinha. O blend tradicional que nunca decepciona.',
    ingredients: [
      { ingredientId: 'acem', percentage: 70 },
      { ingredientId: 'fraldinha', percentage: 30 },
    ],
    estimatedFat: 22,
    prepStyle: 'Grelha ou Chapa',
    prepTips: [
      'Molde hambúrgueres de 150-180g',
      'Grelhe em fogo alto por 4 min cada lado',
      'Deixe descansar 2 min antes de servir',
    ],
    seasonings: ['Sal grosso', 'Pimenta-do-reino', 'Alho em pó'],
    icon: '🍔',
    category: 'classic',
    color: 'meat',
  },
  {
    id: 'premium',
    name: 'Blend Premium',
    subtitle: 'Acém + Picanha',
    description: 'Combinação nobre com a riqueza da picanha. Sabor intenso e suculência incomparável para momentos especiais.',
    ingredients: [
      { ingredientId: 'acem', percentage: 70 },
      { ingredientId: 'picanha', percentage: 30 },
    ],
    estimatedFat: 28,
    prepStyle: 'Churrasqueira',
    prepTips: [
      'Ideal para hambúrgueres de 180-220g',
      'Grelhe com a tampa fechada',
      'Aproveite a gordura para sabor defumado',
    ],
    seasonings: ['Sal grosso', 'Páprica defumada', 'Chimichurri'],
    icon: '👑',
    category: 'premium',
    color: 'gold',
  },
  {
    id: 'smash',
    name: 'Blend Smash',
    subtitle: '70% Magra + 30% Gordura',
    description: 'Proporção perfeita para smash burgers. Crosta caramelizada irresistível com interior ultra-suculento.',
    ingredients: [
      { ingredientId: 'acem', percentage: 70 },
      { ingredientId: 'gordura-bovina', percentage: 30 },
    ],
    estimatedFat: 30,
    prepStyle: 'Chapa Quente',
    prepTips: [
      'Bolas de 80-100g',
      'Pressione com espátula até ficar fino',
      'Apenas 1-2 min cada lado',
      'Não mexa até formar crosta',
    ],
    seasonings: ['Sal na hora', 'Pimenta-do-reino', 'Páprica defumada'],
    icon: '🔥',
    category: 'smash',
    color: 'orange',
  },
  {
    id: 'vegano',
    name: 'Blend Vegano',
    subtitle: 'Feijão + Cogumelos',
    description: 'Vegetal e aromático com umami intenso dos cogumelos. Textura surpreendente que agrada até os carnívoros.',
    ingredients: [
      { ingredientId: 'feijao-preto', percentage: 55 },
      { ingredientId: 'cogumelo', percentage: 45 },
    ],
    estimatedFat: 5,
    prepStyle: 'Chapa com Azeite',
    prepTips: [
      'Molde hambúrgueres firmes de 120-150g',
      'Adicione azeite na chapa',
      'Fogo médio, 3-4 min cada lado',
      'Manuseie com cuidado ao virar',
    ],
    seasonings: ['Cominho', 'Coentro em pó', 'Páprica picante', 'Alho'],
    icon: '🌱',
    category: 'vegan',
    color: 'green',
  },
];

export const getPresetById = (id: string): Preset | undefined => {
  return presets.find(p => p.id === id);
};
