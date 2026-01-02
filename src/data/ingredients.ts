export interface Ingredient {
  id: string;
  name: string;
  category: 'bovine' | 'pork' | 'vegan' | 'extra';
  fatPercentage: number;
  description: string;
  icon: string;
  nutrition: {
    protein: number;
    fat: number;
    carbs?: number;
  };
}

export const ingredients: Ingredient[] = [
  // Bovinos
  {
    id: 'acem',
    name: 'Acem',
    category: 'bovine',
    fatPercentage: 18,
    description: 'Sabor intenso, base classica',
    icon: '🥩',
    nutrition: { protein: 18, fat: 18 },
  },
  {
    id: 'fraldinha',
    name: 'Fraldinha',
    category: 'bovine',
    fatPercentage: 12,
    description: 'Macio e suculento',
    icon: '🥩',
    nutrition: { protein: 19, fat: 12 },
  },
  {
    id: 'picanha',
    name: 'Picanha',
    category: 'bovine',
    fatPercentage: 30,
    description: 'Corte premium, rico em gordura',
    icon: '🥩',
    nutrition: { protein: 17, fat: 30 },
  },
  {
    id: 'costela',
    name: 'Costela',
    category: 'bovine',
    fatPercentage: 25,
    description: 'Extremamente suculento',
    icon: '🥩',
    nutrition: { protein: 16, fat: 25 },
  },
  {
    id: 'peito',
    name: 'Peito Bovino',
    category: 'bovine',
    fatPercentage: 35,
    description: 'Alto teor de gordura',
    icon: '🥩',
    nutrition: { protein: 16, fat: 35 },
  },
  {
    id: 'patinho',
    name: 'Patinho',
    category: 'bovine',
    fatPercentage: 8,
    description: 'Magro, ideal para blends lean',
    icon: '🥩',
    nutrition: { protein: 21, fat: 8 },
  },
  {
    id: 'coxao-duro',
    name: 'Coxao duro',
    category: 'bovine',
    fatPercentage: 6,
    description: 'Magro e firme, pede gordura extra',
    icon: '🥩',
    nutrition: { protein: 22, fat: 6 },
  },
  {
    id: 'gordura-bovina',
    name: 'Gordura Bovina',
    category: 'bovine',
    fatPercentage: 90,
    description: 'Para ajuste de gordura',
    icon: '🧈',
    nutrition: { protein: 0, fat: 90 },
  },

  // Suinos
  {
    id: 'pernil',
    name: 'Pernil Suino',
    category: 'pork',
    fatPercentage: 15,
    description: 'Sabor suave e versatil',
    icon: '🐖',
    nutrition: { protein: 19, fat: 15 },
  },
  {
    id: 'panceta',
    name: 'Panceta',
    category: 'pork',
    fatPercentage: 50,
    description: 'Altissimo sabor',
    icon: '🥓',
    nutrition: { protein: 9, fat: 50 },
  },
  {
    id: 'bacon',
    name: 'Bacon',
    category: 'extra',
    fatPercentage: 45,
    description: 'Defumado e irresistivel',
    icon: '🥓',
    nutrition: { protein: 12, fat: 45 },
  },
  {
    id: 'lombo',
    name: 'Lombo Suino',
    category: 'pork',
    fatPercentage: 10,
    description: 'Magro e macio',
    icon: '🐖',
    nutrition: { protein: 20, fat: 10 },
  },

  // Veganos
  {
    id: 'feijao-preto',
    name: 'Feijao Preto',
    category: 'vegan',
    fatPercentage: 1,
    description: 'Base proteica, textura firme',
    icon: '🫘',
    nutrition: { protein: 8.5, fat: 1, carbs: 23 },
  },
  {
    id: 'grao-de-bico',
    name: 'Grao-de-bico',
    category: 'vegan',
    fatPercentage: 3,
    description: 'Cremoso, rico em proteina',
    icon: '🫘',
    nutrition: { protein: 9, fat: 3, carbs: 27 },
  },
  {
    id: 'cogumelo',
    name: 'Cogumelos',
    category: 'vegan',
    fatPercentage: 1,
    description: 'Umami intenso',
    icon: '🍄',
    nutrition: { protein: 3, fat: 1, carbs: 3 },
  },
  {
    id: 'lentilha',
    name: 'Lentilha',
    category: 'vegan',
    fatPercentage: 1,
    description: 'Textura densa',
    icon: '🫘',
    nutrition: { protein: 9, fat: 1, carbs: 20 },
  },
  {
    id: 'beterraba',
    name: 'Beterraba',
    category: 'vegan',
    fatPercentage: 0,
    description: 'Cor vibrante, levemente doce',
    icon: '🥕',
    nutrition: { protein: 1.6, fat: 0, carbs: 10 },
  },

  // Extras
  {
    id: 'queijo',
    name: 'Queijo Ralado',
    category: 'extra',
    fatPercentage: 30,
    description: 'Para juicy lucy',
    icon: '🧀',
    nutrition: { protein: 25, fat: 30, carbs: 2 },
  },
  {
    id: 'tutano',
    name: 'Tutano',
    category: 'extra',
    fatPercentage: 85,
    description: 'Cremosidade extrema',
    icon: '🦴',
    nutrition: { protein: 7, fat: 85 },
  },
];

export const getIngredientById = (id: string): Ingredient | undefined => {
  return ingredients.find((ingredient) => ingredient.id === id);
};

export const getIngredientsByCategory = (category: Ingredient['category']): Ingredient[] => {
  return ingredients.filter((ingredient) => ingredient.category === category);
};
