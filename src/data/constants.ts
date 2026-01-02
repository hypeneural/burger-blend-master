export const INGREDIENT_CATEGORIES = ['bovine', 'pork', 'vegan', 'extra'] as const;
export type IngredientCategory = (typeof INGREDIENT_CATEGORIES)[number];

export const REGION_TAGS = ['BR', 'US', 'AR'] as const;
export type RegionTag = (typeof REGION_TAGS)[number];

export const CUT_AREAS = ['FOREQUARTER', 'RIB', 'HINDQUARTER', 'FAT'] as const;
export type CutArea = (typeof CUT_AREAS)[number];

export const CUT_FUNCTIONS = ['STRUCTURE', 'FAT_JUICINESS', 'FLAVOR_TEXTURE'] as const;
export type CutFunction = (typeof CUT_FUNCTIONS)[number];

export const COST_TIERS = ['LOW', 'MEDIUM', 'HIGH', 'PREMIUM'] as const;
export type CostTier = (typeof COST_TIERS)[number];

export const FAT_TYPES = ['HARD', 'SOFT', 'MIXED', 'PURE'] as const;
export type FatType = (typeof FAT_TYPES)[number];

export const MELTING_PROFILES = ['FAST', 'MEDIUM', 'SLOW'] as const;
export type MeltingProfile = (typeof MELTING_PROFILES)[number];

export const GRIND_SIZES = ['FINE', 'MEDIUM', 'COARSE'] as const;
export type GrindSize = (typeof GRIND_SIZES)[number];

export const GRIND_PASSES = ['SINGLE', 'DOUBLE'] as const;
export type GrindPass = (typeof GRIND_PASSES)[number];

export const RECOMMENDED_ROLES = ['base', 'booster', 'fat-source', 'luxury'] as const;
export type RecommendedRole = (typeof RECOMMENDED_ROLES)[number];
