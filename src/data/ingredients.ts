import { type IngredientCategory } from "@/data/constants";
import { getCutById, type Cut } from "@/data/cuts";

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  fatPercentage: number;
  description: string;
  nutrition: {
    protein: number;
    fat: number;
    carbs?: number;
  };
  cutId?: string;
}

export const ingredients: Ingredient[] = [
  // Bovinos
  {
    id: "acem",
    name: "Acem",
    category: "bovine",
    fatPercentage: 18,
    description: "Equilibrio natural entre carne e gordura",
    nutrition: { protein: 14.5, fat: 18 },
    cutId: "acem",
  },
  {
    id: "paleta",
    name: "Paleta",
    category: "bovine",
    fatPercentage: 10,
    description: "Base economica com textura firme",
    nutrition: { protein: 22.5, fat: 10 },
    cutId: "paleta",
  },
  {
    id: "patinho",
    name: "Patinho",
    category: "bovine",
    fatPercentage: 5,
    description: "Magro e suave para equilibrar blends gordurosos",
    nutrition: { protein: 23.8, fat: 5 },
    cutId: "patinho",
  },
  {
    id: "coxao-mole",
    name: "Coxao Mole",
    category: "bovine",
    fatPercentage: 8,
    description: "Magro e relativamente macio",
    nutrition: { protein: 24.5, fat: 8 },
    cutId: "coxao-mole",
  },
  {
    id: "coxao-duro",
    name: "Coxao Duro",
    category: "bovine",
    fatPercentage: 7,
    description: "Fibra longa e magra, pede gordura extra",
    nutrition: { protein: 24.3, fat: 7 },
    cutId: "coxao-duro",
  },
  {
    id: "alcatra",
    name: "Alcatra",
    category: "bovine",
    fatPercentage: 8,
    description: "Corte macio e de sabor suave",
    nutrition: { protein: 22, fat: 8 },
    cutId: "alcatra",
  },
  {
    id: "fraldinha",
    name: "Fraldinha",
    category: "bovine",
    fatPercentage: 10,
    description: "Sabor marcante e suculencia equilibrada",
    nutrition: { protein: 20, fat: 10 },
    cutId: "fraldinha",
  },
  {
    id: "maminha",
    name: "Maminha",
    category: "bovine",
    fatPercentage: 10,
    description: "Maciez extra com sabor suave",
    nutrition: { protein: 22.5, fat: 10 },
    cutId: "maminha",
  },
  {
    id: "contrafile",
    name: "Contrafile",
    category: "bovine",
    fatPercentage: 12,
    description: "Marmoreio moderado e sabor nobre",
    nutrition: { protein: 23, fat: 12 },
    cutId: "contrafile",
  },
  {
    id: "picanha",
    name: "Picanha",
    category: "bovine",
    fatPercentage: 20,
    description: "Corte nobre com capa de gordura",
    nutrition: { protein: 17.5, fat: 20 },
    cutId: "picanha",
  },
  {
    id: "file-mignon",
    name: "File Mignon",
    category: "bovine",
    fatPercentage: 5,
    description: "Extremamente macio e magro",
    nutrition: { protein: 21.3, fat: 5 },
    cutId: "file-mignon",
  },
  {
    id: "costela",
    name: "Costela",
    category: "bovine",
    fatPercentage: 18,
    description: "Sabor intenso e gordura entremeada",
    nutrition: { protein: 22, fat: 18 },
    cutId: "costela",
  },
  {
    id: "peito",
    name: "Peito",
    category: "bovine",
    fatPercentage: 22,
    description: "Gordura firme para suculencia",
    nutrition: { protein: 18, fat: 22 },
    cutId: "peito",
  },
  {
    id: "cupim",
    name: "Cupim",
    category: "bovine",
    fatPercentage: 25,
    description: "Marmoreio alto e sabor marcante",
    nutrition: { protein: 18.8, fat: 25 },
    cutId: "cupim",
  },
  {
    id: "gordura-bovina",
    name: "Gordura de Peito",
    category: "bovine",
    fatPercentage: 90,
    description: "Gordura pura para ajuste de teor",
    nutrition: { protein: 0, fat: 90 },
    cutId: "gordura-peito",
  },
  {
    id: "musculo",
    name: "Musculo",
    category: "bovine",
    fatPercentage: 5,
    description: "Sabor intenso e rico em colageno",
    nutrition: { protein: 21.3, fat: 5 },
    cutId: "musculo",
  },

  // Suinos
  {
    id: "pernil",
    name: "Pernil Suino",
    category: "pork",
    fatPercentage: 15,
    description: "Sabor suave e versatil",
    nutrition: { protein: 19, fat: 15 },
  },
  {
    id: "panceta",
    name: "Panceta",
    category: "pork",
    fatPercentage: 50,
    description: "Altissimo sabor",
    nutrition: { protein: 9, fat: 50 },
  },
  {
    id: "bacon",
    name: "Bacon",
    category: "extra",
    fatPercentage: 45,
    description: "Defumado e irresistivel",
    nutrition: { protein: 12, fat: 45 },
  },
  {
    id: "lombo",
    name: "Lombo Suino",
    category: "pork",
    fatPercentage: 10,
    description: "Magro e macio",
    nutrition: { protein: 20, fat: 10 },
  },

  // Veganos
  {
    id: "feijao-preto",
    name: "Feijao Preto",
    category: "vegan",
    fatPercentage: 1,
    description: "Base proteica, textura firme",
    nutrition: { protein: 8.5, fat: 1, carbs: 23 },
  },
  {
    id: "grao-de-bico",
    name: "Grao-de-bico",
    category: "vegan",
    fatPercentage: 3,
    description: "Cremoso, rico em proteina",
    nutrition: { protein: 9, fat: 3, carbs: 27 },
  },
  {
    id: "cogumelo",
    name: "Cogumelos",
    category: "vegan",
    fatPercentage: 1,
    description: "Umami intenso",
    nutrition: { protein: 3, fat: 1, carbs: 3 },
  },
  {
    id: "lentilha",
    name: "Lentilha",
    category: "vegan",
    fatPercentage: 1,
    description: "Textura densa",
    nutrition: { protein: 9, fat: 1, carbs: 20 },
  },
  {
    id: "beterraba",
    name: "Beterraba",
    category: "vegan",
    fatPercentage: 0,
    description: "Cor vibrante, levemente doce",
    nutrition: { protein: 1.6, fat: 0, carbs: 10 },
  },

  // Extras
  {
    id: "queijo",
    name: "Queijo Ralado",
    category: "extra",
    fatPercentage: 30,
    description: "Para juicy lucy",
    nutrition: { protein: 25, fat: 30, carbs: 2 },
  },
  {
    id: "tutano",
    name: "Tutano",
    category: "extra",
    fatPercentage: 85,
    description: "Cremosidade extrema",
    nutrition: { protein: 7, fat: 85 },
  },
];

export const getIngredientById = (id: string): Ingredient | undefined => {
  return ingredients.find((ingredient) => ingredient.id === id);
};

export const getIngredientsByCategory = (category: Ingredient["category"]): Ingredient[] => {
  return ingredients.filter((ingredient) => ingredient.category === category);
};

export const getCutForIngredient = (ingredientId: string): Cut | undefined => {
  const ingredient = getIngredientById(ingredientId);
  if (!ingredient?.cutId) return undefined;
  return getCutById(ingredient.cutId);
};
