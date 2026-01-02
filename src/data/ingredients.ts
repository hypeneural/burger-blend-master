export interface Ingredient {
  id: string;
  name: string;
  category: 'bovine' | 'pork' | 'vegan' | 'extra';
  fatPercentage: number;
  description: string;
  icon: string;
}

export const ingredients: Ingredient[] = [
  // Bovinos
  { id: 'acem', name: 'Acém', category: 'bovine', fatPercentage: 18, description: 'Sabor intenso, base clássica', icon: '🥩' },
  { id: 'fraldinha', name: 'Fraldinha', category: 'bovine', fatPercentage: 12, description: 'Macio e suculento', icon: '🥩' },
  { id: 'picanha', name: 'Picanha', category: 'bovine', fatPercentage: 30, description: 'Corte premium, rico em gordura', icon: '🥩' },
  { id: 'costela', name: 'Costela', category: 'bovine', fatPercentage: 25, description: 'Extremamente suculento', icon: '🥩' },
  { id: 'peito', name: 'Peito Bovino', category: 'bovine', fatPercentage: 35, description: 'Alto teor de gordura', icon: '🥩' },
  { id: 'patinho', name: 'Patinho', category: 'bovine', fatPercentage: 8, description: 'Magro, ideal para blends lean', icon: '🥩' },
  { id: 'gordura-bovina', name: 'Gordura Bovina', category: 'bovine', fatPercentage: 90, description: 'Para ajuste de gordura', icon: '🧈' },
  
  // Suínos
  { id: 'pernil', name: 'Pernil Suíno', category: 'pork', fatPercentage: 15, description: 'Sabor suave e versátil', icon: '🐷' },
  { id: 'panceta', name: 'Panceta', category: 'pork', fatPercentage: 50, description: 'Altíssimo sabor', icon: '🥓' },
  { id: 'bacon', name: 'Bacon', category: 'pork', fatPercentage: 45, description: 'Defumado e irresistível', icon: '🥓' },
  { id: 'lombo', name: 'Lombo Suíno', category: 'pork', fatPercentage: 10, description: 'Magro e macio', icon: '🐷' },
  
  // Veganos
  { id: 'feijao-preto', name: 'Feijão Preto', category: 'vegan', fatPercentage: 1, description: 'Base proteica, textura firme', icon: '🫘' },
  { id: 'grao-de-bico', name: 'Grão-de-bico', category: 'vegan', fatPercentage: 3, description: 'Cremoso, rico em proteína', icon: '🫘' },
  { id: 'cogumelo', name: 'Cogumelos', category: 'vegan', fatPercentage: 1, description: 'Umami intenso', icon: '🍄' },
  { id: 'lentilha', name: 'Lentilha', category: 'vegan', fatPercentage: 1, description: 'Textura densa', icon: '🫘' },
  { id: 'beterraba', name: 'Beterraba', category: 'vegan', fatPercentage: 0, description: 'Cor vibrante, levemente doce', icon: '🥕' },
  
  // Extras
  { id: 'queijo', name: 'Queijo Ralado', category: 'extra', fatPercentage: 30, description: 'Para juicy lucy', icon: '🧀' },
  { id: 'tutano', name: 'Tutano', category: 'extra', fatPercentage: 85, description: 'Cremosidade extrema', icon: '🦴' },
];

export const getIngredientById = (id: string): Ingredient | undefined => {
  return ingredients.find(i => i.id === id);
};

export const getIngredientsByCategory = (category: Ingredient['category']): Ingredient[] => {
  return ingredients.filter(i => i.category === category);
};
