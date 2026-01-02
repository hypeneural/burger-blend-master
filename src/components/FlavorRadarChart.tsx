import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import type { BlendIngredient } from "@/data/presets";
import type { BlendExtra } from "@/types/blend";
import { calculateFlavorRadarData } from "@/domain/blendEngine";

interface FlavorRadarChartProps {
  ingredients: BlendIngredient[];
  extras: BlendExtra[];
  burgerCount: number;
  burgerWeight: number;
}

export function FlavorRadarChart({
  ingredients,
  extras,
  burgerCount,
  burgerWeight,
}: FlavorRadarChartProps) {
  const data = calculateFlavorRadarData(ingredients, extras, burgerCount, burgerWeight);

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
