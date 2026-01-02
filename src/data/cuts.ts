export type RegionTag = 'BR' | 'US' | 'AR';
export type CategoryFunction = 'STRUCTURE' | 'FAT_JUICINESS' | 'FLAVOR_TEXTURE';
export type RecommendedRole = 'base' | 'booster' | 'fat-source' | 'luxury';
export type CostRelative = '$' | '$$' | '$$$' | '$$$$';
export type GrindSize = 'fine' | 'medium' | 'coarse';
export type GrindPass = 'single' | 'double';

export interface Cut {
  id: string;
  namePt: string;
  nameEn: string;
  regionTags: RegionTag[];
  categoryFunction: CategoryFunction;
  fatPercentRange: { min: number; max: number; default: number };
  collagenLevel: number;
  myoglobinLevel: number;
  textureTags: string[];
  flavorNotes: string[];
  costRelative: CostRelative;
  recommendedRoles: RecommendedRole[];
  warnings: string[];
  whyBlend: string;
  grindRecommendation: {
    size: GrindSize;
    passes: GrindPass;
    note?: string;
  };
  cookingBest: string[];
}

export const cuts: Cut[] = [
  {
    id: 'acem',
    namePt: 'Acem',
    nameEn: 'Chuck',
    regionTags: ['BR', 'US'],
    categoryFunction: 'STRUCTURE',
    fatPercentRange: { min: 15, max: 20, default: 18 },
    collagenLevel: 4,
    myoglobinLevel: 4,
    textureTags: ['rustica', 'fibra firme'],
    flavorNotes: ['ferroso', 'umami'],
    costRelative: '$',
    recommendedRoles: ['base'],
    warnings: [],
    whyBlend: 'Base padrao-ouro com colageno que segura sucos.',
    grindRecommendation: { size: 'medium', passes: 'double' },
    cookingBest: ['chapa', 'grelha', 'smash'],
  },
  {
    id: 'peito',
    namePt: 'Peito',
    nameEn: 'Brisket',
    regionTags: ['BR', 'US'],
    categoryFunction: 'FAT_JUICINESS',
    fatPercentRange: { min: 20, max: 30, default: 26 },
    collagenLevel: 4,
    myoglobinLevel: 3,
    textureTags: ['firme', 'marmoreio'],
    flavorNotes: ['lacteo', 'intenso'],
    costRelative: '$$',
    recommendedRoles: ['booster', 'fat-source'],
    warnings: ['Gordura firme exige calor alto para derreter bem.'],
    whyBlend: 'Gordura firme que lubrifica sem escorrer toda.',
    grindRecommendation: { size: 'medium', passes: 'single' },
    cookingBest: ['chapa', 'grelha'],
  },
  {
    id: 'costela',
    namePt: 'Costela',
    nameEn: 'Short Rib',
    regionTags: ['BR', 'US'],
    categoryFunction: 'FLAVOR_TEXTURE',
    fatPercentRange: { min: 25, max: 35, default: 30 },
    collagenLevel: 3,
    myoglobinLevel: 4,
    textureTags: ['marmoreio', 'macia'],
    flavorNotes: ['doce', 'umami'],
    costRelative: '$$$',
    recommendedRoles: ['booster', 'luxury'],
    warnings: ['Corte premium, use em porcentagem menor.'],
    whyBlend: 'Aumenta umami doce e complexidade do sabor.',
    grindRecommendation: { size: 'coarse', passes: 'single' },
    cookingBest: ['grelha', 'chapa'],
  },
  {
    id: 'fraldinha',
    namePt: 'Fraldinha',
    nameEn: 'Flank',
    regionTags: ['BR', 'US', 'AR'],
    categoryFunction: 'FLAVOR_TEXTURE',
    fatPercentRange: { min: 10, max: 15, default: 12 },
    collagenLevel: 2,
    myoglobinLevel: 4,
    textureTags: ['rustica', 'steak bite'],
    flavorNotes: ['ferroso', 'intenso'],
    costRelative: '$$',
    recommendedRoles: ['booster'],
    warnings: ['Precisa de gordura extra para nao ressecar.'],
    whyBlend: 'Entrega textura rustica e sabor ferroso.',
    grindRecommendation: { size: 'coarse', passes: 'single' },
    cookingBest: ['grelha', 'chapa'],
  },
  {
    id: 'coxao-duro',
    namePt: 'Coxao duro',
    nameEn: 'Silverside',
    regionTags: ['BR', 'US'],
    categoryFunction: 'STRUCTURE',
    fatPercentRange: { min: 5, max: 10, default: 7 },
    collagenLevel: 2,
    myoglobinLevel: 3,
    textureTags: ['firme', 'magro'],
    flavorNotes: ['neutro'],
    costRelative: '$',
    recommendedRoles: ['base'],
    warnings: ['Acima de 40% sem gordura extra tende a ressecar.'],
    whyBlend: 'Baixo custo e volume, pede compensacao de gordura.',
    grindRecommendation: { size: 'medium', passes: 'double', note: 'Misture com gordura antes de moer.' },
    cookingBest: ['smash', 'chapa'],
  },
  {
    id: 'alcatra',
    namePt: 'Alcatra',
    nameEn: 'Top Sirloin',
    regionTags: ['BR', 'US'],
    categoryFunction: 'STRUCTURE',
    fatPercentRange: { min: 10, max: 15, default: 12 },
    collagenLevel: 2,
    myoglobinLevel: 3,
    textureTags: ['macia', 'leve'],
    flavorNotes: ['mineral', 'suave'],
    costRelative: '$$',
    recommendedRoles: ['base', 'booster'],
    warnings: [],
    whyBlend: 'Base leve para blends mais delicados.',
    grindRecommendation: { size: 'medium', passes: 'single' },
    cookingBest: ['chapa', 'grelha'],
  },
  {
    id: 'picanha',
    namePt: 'Picanha',
    nameEn: 'Rump Cap',
    regionTags: ['BR', 'US', 'AR'],
    categoryFunction: 'FLAVOR_TEXTURE',
    fatPercentRange: { min: 15, max: 18, default: 16 },
    collagenLevel: 1,
    myoglobinLevel: 3,
    textureTags: ['macia'],
    flavorNotes: ['adocicado', 'lacteo'],
    costRelative: '$$$$',
    recommendedRoles: ['luxury', 'booster'],
    warnings: ['Uso como marketing: custo alto para pouco ganho real.'],
    whyBlend: 'Agrega status e gordura da capa quando usada junto.',
    grindRecommendation: { size: 'medium', passes: 'single' },
    cookingBest: ['grelha', 'churrasqueira'],
  },
  {
    id: 'pescoco',
    namePt: 'Pescoco',
    nameEn: 'Neck',
    regionTags: ['BR', 'US'],
    categoryFunction: 'FLAVOR_TEXTURE',
    fatPercentRange: { min: 10, max: 15, default: 12 },
    collagenLevel: 3,
    myoglobinLevel: 4,
    textureTags: ['rustica', 'fibra firme'],
    flavorNotes: ['forte', 'umami'],
    costRelative: '$',
    recommendedRoles: ['booster'],
    warnings: ['Sabor forte, use com parcimonia.'],
    whyBlend: 'Sabor rustico com bom custo-beneficio.',
    grindRecommendation: { size: 'coarse', passes: 'single' },
    cookingBest: ['grelha', 'chapa'],
  },
];

export const getCutById = (id: string): Cut | undefined => cuts.find((cut) => cut.id === id);
