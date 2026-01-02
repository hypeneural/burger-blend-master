import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";

interface FatDonutChartProps {
  fatPercentage: number;
}

const zoneData = [
  { name: "Seco", value: 15, color: "hsl(var(--muted-foreground) / 0.35)" },
  { name: "Ideal", value: 10, color: "hsl(var(--vegan-green) / 0.35)" },
  { name: "Alto", value: 5, color: "hsl(var(--cheese-gold) / 0.35)" },
  { name: "Excesso", value: 70, color: "hsl(var(--fat-danger) / 0.25)" },
];

const getStatusColor = (fatPercentage: number) => {
  if (fatPercentage < 15) return "hsl(var(--muted-foreground))";
  if (fatPercentage <= 25) return "hsl(var(--vegan-green))";
  if (fatPercentage <= 30) return "hsl(var(--cheese-gold))";
  return "hsl(var(--fat-danger))";
};

const getStatusLabel = (fatPercentage: number) => {
  if (fatPercentage < 15) return "Seco";
  if (fatPercentage <= 25) return "Ideal";
  if (fatPercentage <= 30) return "Alto";
  return "Excesso";
};

export function FatDonutChart({ fatPercentage }: FatDonutChartProps) {
  const fat = Math.min(Math.max(fatPercentage, 0), 100);
  const data = [
    { name: "Gordura", value: fat },
    { name: "Magro", value: Math.max(0, 100 - fat) },
  ];
  const fatColor = getStatusColor(fat);

  return (
    <div className="relative h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={zoneData}
            dataKey="value"
            outerRadius={78}
            innerRadius={66}
            stroke="transparent"
          >
            {zoneData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={62}
            innerRadius={34}
            stroke="transparent"
          >
            <Cell fill={fatColor} />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-display font-bold text-foreground">{fat}%</span>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {getStatusLabel(fat)}
        </span>
      </div>
    </div>
  );
}
