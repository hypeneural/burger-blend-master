import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import type { BlendIngredient } from "@/data/presets";
import type { BlendExtra } from "@/types/blend";
import { calculateBaseWeight, calculateExtrasWeight } from "@/lib/blendMath";
import { getIngredientById } from "@/data/ingredients";

interface FlavorRadarChartProps {
  ingredients: BlendIngredient[];
  extras: BlendExtra[];
  burgerCount: number;
  burgerWeight: number;
}

const flavors = ["Salgado", "Doce", "Acido", "Amargo", "Umami", "Picante"] as const;
type FlavorKey = (typeof flavors)[number];

const defaultProfile: Record<FlavorKey, number> = {
  Salgado: 2,
  Doce: 1,
  Acido: 1,
  Amargo: 1,
  Umami: 2,
  Picante: 1,
};

const categoryProfiles: Record<string, Record<FlavorKey, number>> = {
  bovine: { Salgado: 3, Doce: 1, Acido: 1, Amargo: 1, Umami: 4, Picante: 1 },
  pork: { Salgado: 4, Doce: 2, Acido: 1, Amargo: 1, Umami: 3, Picante: 1 },
  vegan: { Salgado: 2, Doce: 2, Acido: 2, Amargo: 1, Umami: 2, Picante: 1 },
  extra: { Salgado: 3, Doce: 1, Acido: 1, Amargo: 1, Umami: 2, Picante: 1 },
};

const ingredientOverrides: Record<string, Partial<Record<FlavorKey, number>>> = {
  bacon: { Salgado: 5, Umami: 4 },
  cogumelo: { Umami: 4, Amargo: 2 },
  picanha: { Umami: 4, Salgado: 3 },
  gordura-bovina: { Umami: 2, Salgado: 2 },
  feijao-preto: { Umami: 3, Doce: 1 },
  lentilha: { Umami: 3, Doce: 1 },
  grao-de-bico: { Doce: 2, Umami: 2 },
  queijo: { Salgado: 4, Umami: 3 },
  tutano: { Umami: 3, Salgado: 2 },
};

const getProfile = (ingredientId: string, category: string) => {
  const base = categoryProfiles[category] ?? defaultProfile;
  const overrides = ingredientOverrides[ingredientId] ?? {};
  return flavors.reduce((acc, flavor) => {
    acc[flavor] = overrides[flavor] ?? base[flavor] ?? defaultProfile[flavor];
    return acc;
  }, {} as Record<FlavorKey, number>);
};

export function FlavorRadarChart({
  ingredients,
  extras,
  burgerCount,
  burgerWeight,
}: FlavorRadarChartProps) {
  const baseWeight = calculateBaseWeight(burgerCount, burgerWeight);
  const extrasWeight = calculateExtrasWeight(extras);
  const totalWeight = baseWeight + extrasWeight;

  const sums = flavors.reduce((acc, flavor) => {
    acc[flavor] = 0;
    return acc;
  }, {} as Record<FlavorKey, number>);

  ingredients.forEach((item) => {
    const ingredient = getIngredientById(item.ingredientId);
    if (!ingredient) return;
    const weight = (item.percentage / 100) * baseWeight;
    const profile = getProfile(item.ingredientId, ingredient.category);
    flavors.forEach((flavor) => {
      sums[flavor] += profile[flavor] * weight;
    });
  });

  extras.forEach((extra) => {
    const ingredient = getIngredientById(extra.ingredientId);
    if (!ingredient) return;
    const profile = getProfile(extra.ingredientId, ingredient.category);
    flavors.forEach((flavor) => {
      sums[flavor] += profile[flavor] * extra.grams;
    });
  });

  const data = flavors.map((flavor) => {
    const avg = totalWeight > 0 ? sums[flavor] / totalWeight : defaultProfile[flavor];
    const value = Math.min(5, Math.max(1, Math.round(avg)));
    return { flavor, value };
  });

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis dataKey="flavor" tick={{ fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} />
          <Radar
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary) / 0.35)"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
