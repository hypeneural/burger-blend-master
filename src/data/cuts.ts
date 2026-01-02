import {
  COST_TIERS,
  CUT_AREAS,
  CUT_FUNCTIONS,
  FAT_TYPES,
  GRIND_PASSES,
  GRIND_SIZES,
  MELTING_PROFILES,
  RECOMMENDED_ROLES,
  REGION_TAGS,
  type CostTier,
  type CutArea,
  type CutFunction,
  type FatType,
  type GrindPass,
  type GrindSize,
  type MeltingProfile,
  type RecommendedRole,
  type RegionTag,
} from "@/data/constants";

export interface Cut {
  id: string;
  namePt: string;
  nameEn: string;
  aliases?: string[];
  regionTags: RegionTag[];
  area: CutArea;
  categoryFunction: CutFunction;
  costTier: CostTier;
  fatPercentRange: { min: number; max: number; default: number };
  caloriesPer100g: number;
  fatType: FatType;
  meltingProfile: MeltingProfile;
  shortDescription: string;
  tips: string;
  tags: string[];
  warnings: string[];
  recommendedRoles: RecommendedRole[];
  grindRecommendation?: {
    size: GrindSize;
    passes: GrindPass;
    note?: string;
  };
  cookingBest?: string[];
}

const {
  STRUCTURE,
  FAT_JUICINESS,
  FLAVOR_TEXTURE,
} = Object.fromEntries(CUT_FUNCTIONS.map((value) => [value, value])) as Record<
  CutFunction,
  CutFunction
>;

const { LOW, MEDIUM, HIGH } = Object.fromEntries(COST_TIERS.map((value) => [value, value])) as Record<
  CostTier,
  CostTier
>;

const { FOREQUARTER, RIB, HINDQUARTER, FAT } = Object.fromEntries(
  CUT_AREAS.map((value) => [value, value]),
) as Record<CutArea, CutArea>;

const { BR, US, AR } = Object.fromEntries(
  REGION_TAGS.map((value) => [value, value]),
) as Record<RegionTag, RegionTag>;

const { HARD, SOFT, MIXED, PURE } = Object.fromEntries(
  FAT_TYPES.map((value) => [value, value]),
) as Record<FatType, FatType>;

const { FAST, MEDIUM: MEDIUM_MELT, SLOW } = Object.fromEntries(
  MELTING_PROFILES.map((value) => [value, value]),
) as Record<MeltingProfile, MeltingProfile>;

const { SINGLE, DOUBLE } = Object.fromEntries(
  GRIND_PASSES.map((value) => [value, value]),
) as Record<GrindPass, GrindPass>;

const { FINE, MEDIUM: MEDIUM_GRIND, COARSE } = Object.fromEntries(
  GRIND_SIZES.map((value) => [value, value]),
) as Record<GrindSize, GrindSize>;

const { base, booster, "fat-source": fatSource, luxury } = Object.fromEntries(
  RECOMMENDED_ROLES.map((value) => [value, value]),
) as Record<RecommendedRole, RecommendedRole>;

export const cuts: Cut[] = [
  {
    id: "acem",
    namePt: "Acem",
    nameEn: "Chuck",
    regionTags: [BR, US],
    area: FOREQUARTER,
    categoryFunction: STRUCTURE,
    costTier: LOW,
    fatPercentRange: { min: 18, max: 18, default: 18 },
    caloriesPer100g: 220,
    fatType: MIXED,
    meltingProfile: MEDIUM_MELT,
    shortDescription: "Equilibrio natural entre carne e gordura. A base mais comum de blends.",
    tips: "Use de 50% a 100% no blend como base. Ideal para iniciantes.",
    tags: ["estrutura", "equilibrado", "versatil"],
    warnings: [],
    recommendedRoles: [base],
    grindRecommendation: { size: MEDIUM_GRIND, passes: SINGLE },
    cookingBest: ["chapa", "grelha"],
  },
  {
    id: "paleta",
    namePt: "Paleta",
    nameEn: "Shoulder Clod",
    regionTags: [BR, US],
    area: FOREQUARTER,
    categoryFunction: STRUCTURE,
    costTier: LOW,
    fatPercentRange: { min: 10, max: 10, default: 10 },
    caloriesPer100g: 180,
    fatType: MIXED,
    meltingProfile: MEDIUM_MELT,
    shortDescription:
      "Corte dianteiro com sabor moderado e textura firme. Base economica para blends.",
    tips: "Pode compor 30% a 70% do blend como base. Ideal para reduzir custo mantendo boa estrutura.",
    tags: ["estrutura", "economico", "textura firme"],
    warnings: [],
    recommendedRoles: [base],
    grindRecommendation: { size: MEDIUM_GRIND, passes: SINGLE },
    cookingBest: ["chapa", "grelha"],
  },
  {
    id: "patinho",
    namePt: "Patinho",
    nameEn: "Knuckle",
    regionTags: [BR, US],
    area: HINDQUARTER,
    categoryFunction: STRUCTURE,
    costTier: LOW,
    fatPercentRange: { min: 5, max: 5, default: 5 },
    caloriesPer100g: 140,
    fatType: MIXED,
    meltingProfile: MEDIUM_MELT,
    shortDescription: "Corte traseiro magro e suave. Equilibra blends gordurosos com textura firme.",
    tips:
      "Use ~20% a 50% no blend para reduzir gordura sem perder consistencia. Evite usar 100% patinho para o hamburguer nao ficar seco.",
    tags: ["estrutura", "magro", "suave"],
    warnings: ["Nao use 100% patinho sem gordura extra."],
    recommendedRoles: [base],
    grindRecommendation: { size: MEDIUM_GRIND, passes: SINGLE },
    cookingBest: ["chapa", "grelha"],
  },
  {
    id: "coxao-mole",
    namePt: "Coxao Mole",
    nameEn: "Topside",
    aliases: ["Inside Round"],
    regionTags: [BR, US],
    area: HINDQUARTER,
    categoryFunction: STRUCTURE,
    costTier: LOW,
    fatPercentRange: { min: 8, max: 8, default: 8 },
    caloriesPer100g: 170,
    fatType: MIXED,
    meltingProfile: MEDIUM_MELT,
    shortDescription:
      "Corte traseiro magro e relativamente macio. Acrescenta estrutura sem muita gordura.",
    tips: "Substitui o patinho como parte magra. Utilize ~20% a 40% no blend.",
    tags: ["estrutura", "magro", "macio"],
    warnings: ["Use gordura extra para evitar ressecamento."],
    recommendedRoles: [base],
    grindRecommendation: { size: MEDIUM_GRIND, passes: SINGLE },
    cookingBest: ["chapa", "grelha"],
  },
  {
    id: "coxao-duro",
    namePt: "Coxao Duro",
    nameEn: "Outside Round",
    aliases: ["Silverside"],
    regionTags: [BR, US],
    area: HINDQUARTER,
    categoryFunction: STRUCTURE,
    costTier: LOW,
    fatPercentRange: { min: 7, max: 7, default: 7 },
    caloriesPer100g: 160,
    fatType: MIXED,
    meltingProfile: MEDIUM_MELT,
    shortDescription:
      "Corte traseiro muito magro e de fibra longa. Tende a secar se usado sozinho.",
    tips: "Use ate ~30% no blend combinado a cortes gordurosos. Adicione gordura extra.",
    tags: ["estrutura", "economico", "marcado"],
    warnings: ["Acima de 30% precisa de gordura extra."],
    recommendedRoles: [base],
    grindRecommendation: { size: MEDIUM_GRIND, passes: DOUBLE, note: "Moagem dupla ajuda na maciez." },
    cookingBest: ["chapa", "smash"],
  },
  {
    id: "alcatra",
    namePt: "Alcatra",
    nameEn: "Top Sirloin",
    regionTags: [BR, US],
    area: HINDQUARTER,
    categoryFunction: STRUCTURE,
    costTier: MEDIUM,
    fatPercentRange: { min: 8, max: 8, default: 8 },
    caloriesPer100g: 160,
    fatType: MIXED,
    meltingProfile: MEDIUM_MELT,
    shortDescription:
      "Corte nobre e macio com gordura moderada. Melhora a maciez do blend.",
    tips: "Use 50% a 80% no blend como base macia. Combine com cortes mais gordurosos.",
    tags: ["estrutura", "macio", "suave"],
    warnings: [],
    recommendedRoles: [base, booster],
    grindRecommendation: { size: MEDIUM_GRIND, passes: SINGLE },
    cookingBest: ["chapa", "grelha"],
  },
  {
    id: "fraldinha",
    namePt: "Fraldinha",
    nameEn: "Flank Steak",
    regionTags: [BR, US, AR],
    area: HINDQUARTER,
    categoryFunction: FLAVOR_TEXTURE,
    costTier: MEDIUM,
    fatPercentRange: { min: 10, max: 10, default: 10 },
    caloriesPer100g: 170,
    fatType: SOFT,
    meltingProfile: FAST,
    shortDescription:
      "Corte do vazio macio e de sabor marcante. Gordura moderada equilibra sabor.",
    tips: "Use 20% a 50% do blend para adicionar sabor marcante. Combine com cortes mais magros.",
    tags: ["sabor", "macio", "marcado"],
    warnings: ["Pode oxidar rapido, moa e use em seguida."],
    recommendedRoles: [booster],
    grindRecommendation: { size: COARSE, passes: SINGLE },
    cookingBest: ["chapa", "grelha"],
  },
  {
    id: "maminha",
    namePt: "Maminha",
    nameEn: "Tri-Tip",
    regionTags: [BR, US],
    area: HINDQUARTER,
    categoryFunction: FLAVOR_TEXTURE,
    costTier: MEDIUM,
    fatPercentRange: { min: 10, max: 10, default: 10 },
    caloriesPer100g: 180,
    fatType: MIXED,
    meltingProfile: MEDIUM_MELT,
    shortDescription:
      "Corte macio com capa de gordura moderada e sabor suave. Adiciona maciez ao blend.",
    tips: "Use 20% a 40% no blend para dar maciez sem sabor excessivo.",
    tags: ["sabor", "macio", "suave"],
    warnings: [],
    recommendedRoles: [booster],
    grindRecommendation: { size: MEDIUM_GRIND, passes: SINGLE },
    cookingBest: ["chapa", "grelha"],
  },
  {
    id: "contrafile",
    namePt: "Contrafile",
    nameEn: "Striploin",
    regionTags: [BR, US],
    area: HINDQUARTER,
    categoryFunction: FLAVOR_TEXTURE,
    costTier: HIGH,
    fatPercentRange: { min: 12, max: 12, default: 12 },
    caloriesPer100g: 200,
    fatType: MIXED,
    meltingProfile: MEDIUM_MELT,
    shortDescription:
      "Corte longo do lombo com marmoreio moderado e capa de gordura. Muito saboroso.",
    tips: "Por ser caro, use ~20% a 30% no blend para dar sabor de carne nobre.",
    tags: ["sabor", "marcado", "gourmet"],
    warnings: [],
    recommendedRoles: [booster, luxury],
    grindRecommendation: { size: MEDIUM_GRIND, passes: SINGLE },
    cookingBest: ["grelha", "chapa"],
  },
  {
    id: "picanha",
    namePt: "Picanha",
    nameEn: "Sirloin Cap",
    regionTags: [BR, US, AR],
    area: HINDQUARTER,
    categoryFunction: FLAVOR_TEXTURE,
    costTier: HIGH,
    fatPercentRange: { min: 20, max: 20, default: 20 },
    caloriesPer100g: 250,
    fatType: MIXED,
    meltingProfile: MEDIUM_MELT,
    shortDescription:
      "Corte nobre famoso pela capa de gordura. Fornece sabor intenso e suculencia elevada.",
    tips: "Use moderadamente (~20% a 30%). Combine com cortes magros na base.",
    tags: ["sabor", "marcado", "gourmet"],
    warnings: ["Use com moderacao por custo alto."],
    recommendedRoles: [booster, luxury],
    grindRecommendation: { size: MEDIUM_GRIND, passes: SINGLE },
    cookingBest: ["churrasqueira", "grelha"],
  },
  {
    id: "file-mignon",
    namePt: "File Mignon",
    nameEn: "Tenderloin",
    regionTags: [BR, US],
    area: HINDQUARTER,
    categoryFunction: FLAVOR_TEXTURE,
    costTier: HIGH,
    fatPercentRange: { min: 5, max: 5, default: 5 },
    caloriesPer100g: 130,
    fatType: MIXED,
    meltingProfile: MEDIUM_MELT,
    shortDescription:
      "Corte extremamente macio e magro, de sabor suave. Requer gordura de outros cortes.",
    tips: "Combine com cortes gordurosos. Use ate ~30% no blend.",
    tags: ["gourmet", "macio", "suave"],
    warnings: ["Magro: precisa de gordura extra."],
    recommendedRoles: [booster, luxury],
    grindRecommendation: { size: MEDIUM_GRIND, passes: SINGLE },
    cookingBest: ["chapa"],
  },
  {
    id: "costela",
    namePt: "Costela",
    nameEn: "Short Ribs",
    regionTags: [BR, US],
    area: RIB,
    categoryFunction: FLAVOR_TEXTURE,
    costTier: LOW,
    fatPercentRange: { min: 18, max: 18, default: 18 },
    caloriesPer100g: 250,
    fatType: SOFT,
    meltingProfile: FAST,
    shortDescription:
      "Carne de costela com muito sabor e gordura entremeada. Deixa o burger suculento.",
    tips: "Use 20% a 50% no blend. Moa bem a costela para obter textura uniforme.",
    tags: ["sabor", "marcado", "suculento"],
    warnings: ["Exige limpeza de cartilagens e ossos."],
    recommendedRoles: [booster],
    grindRecommendation: { size: COARSE, passes: SINGLE },
    cookingBest: ["chapa", "smash"],
  },
  {
    id: "peito",
    namePt: "Peito",
    nameEn: "Brisket",
    regionTags: [BR, US],
    area: FOREQUARTER,
    categoryFunction: FAT_JUICINESS,
    costTier: LOW,
    fatPercentRange: { min: 22, max: 22, default: 22 },
    caloriesPer100g: 270,
    fatType: HARD,
    meltingProfile: SLOW,
    shortDescription:
      "Corte do peito com alto teor de gordura intramuscular. Contribui muita suculencia.",
    tips: "Use 20% a 30% no blend para adicionar gordura. Combine com cortes magros.",
    tags: ["gordura", "suculento", "economico"],
    warnings: ["Gordura alta, use com moderacao."],
    recommendedRoles: [fatSource],
    grindRecommendation: { size: MEDIUM_GRIND, passes: DOUBLE },
    cookingBest: ["chapa", "grelha"],
  },
  {
    id: "cupim",
    namePt: "Cupim",
    nameEn: "Hump Steak",
    regionTags: [BR, US],
    area: FOREQUARTER,
    categoryFunction: FAT_JUICINESS,
    costTier: LOW,
    fatPercentRange: { min: 25, max: 25, default: 25 },
    caloriesPer100g: 300,
    fatType: MIXED,
    meltingProfile: MEDIUM_MELT,
    shortDescription:
      "Corte com altissimo marmoreio. Sabor acentuado e gordura abundante.",
    tips: "Use em pequenas proporcoes (~10% a 20%) devido a gordura elevada.",
    tags: ["gordura", "marcado", "suculento"],
    warnings: ["Uso alto deixa o blend pesado."],
    recommendedRoles: [fatSource, booster],
    grindRecommendation: { size: MEDIUM_GRIND, passes: SINGLE },
    cookingBest: ["chapa", "grelha"],
  },
  {
    id: "gordura-peito",
    namePt: "Gordura de Peito",
    nameEn: "Brisket Fat",
    regionTags: [BR, US],
    area: FAT,
    categoryFunction: FAT_JUICINESS,
    costTier: LOW,
    fatPercentRange: { min: 90, max: 90, default: 90 },
    caloriesPer100g: 800,
    fatType: PURE,
    meltingProfile: SLOW,
    shortDescription:
      "Gordura bovina pura para aumentar o teor de gordura de blends magros.",
    tips: "Adicione 5% a 15% no blend para atingir cerca de 20% de gordura total.",
    tags: ["gordura", "suculento", "economico"],
    warnings: ["Misture bem para evitar blocos de gordura."],
    recommendedRoles: [fatSource],
    grindRecommendation: { size: FINE, passes: SINGLE, note: "Moer semi-congelado." },
    cookingBest: ["chapa", "grelha"],
  },
  {
    id: "musculo",
    namePt: "Musculo",
    nameEn: "Shank",
    regionTags: [BR, US],
    area: FOREQUARTER,
    categoryFunction: FLAVOR_TEXTURE,
    costTier: LOW,
    fatPercentRange: { min: 5, max: 5, default: 5 },
    caloriesPer100g: 130,
    fatType: MIXED,
    meltingProfile: MEDIUM_MELT,
    shortDescription:
      "Carne da perna muito magra e rica em colageno. Sabor bovino intenso.",
    tips: "Use baixa proporcao (~10%) para intensificar sabor. Moa duas vezes para liberar colageno.",
    tags: ["sabor", "economico", "marcado"],
    warnings: ["Excesso deixa textura borrachuda."],
    recommendedRoles: [booster],
    grindRecommendation: { size: FINE, passes: DOUBLE },
    cookingBest: ["chapa", "grelha"],
  },
];

export const getCutById = (id: string): Cut | undefined => cuts.find((cut) => cut.id === id);

export const getCutFunctionLabel = (value: CutFunction) => value;

export const getCostTierLabel = (value: CostTier) => value;

export const getAreaLabel = (value: CutArea) => value;
