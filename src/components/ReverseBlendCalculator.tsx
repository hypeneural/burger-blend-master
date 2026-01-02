import { useEffect, useMemo, useState } from "react";
import { InfoTooltip } from "@/components/InfoTooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Ingredient } from "@/data/ingredients";
import { getIngredientById } from "@/data/ingredients";
import { formatWeight } from "@/lib/blendMath";

interface ReverseBlendCalculatorProps {
  ingredients: Ingredient[];
  baseWeight: number;
  onApply: (next: { ingredientId: string; percentage: number }[]) => void;
}

export function ReverseBlendCalculator({
  ingredients,
  baseWeight,
  onApply,
}: ReverseBlendCalculatorProps) {
  const candidates = useMemo(
    () => ingredients.filter((item) => item.category !== "extra" && item.category !== "vegan"),
    [ingredients],
  );

  const [firstId, setFirstId] = useState(candidates[0]?.id ?? "");
  const [secondId, setSecondId] = useState(candidates[1]?.id ?? "");
  const [targetFat, setTargetFat] = useState(22);

  const first = getIngredientById(firstId);
  const second = getIngredientById(secondId);

  useEffect(() => {
    if (!candidates.length) return;
    if (!firstId || !candidates.some((item) => item.id === firstId)) {
      setFirstId(candidates[0].id);
    }
    if (!secondId || !candidates.some((item) => item.id === secondId)) {
      setSecondId(candidates[1]?.id ?? candidates[0].id);
    }
  }, [candidates, firstId, secondId]);

  const calculation = useMemo(() => {
    if (!first || !second || !baseWeight) {
      return { status: "invalid", message: "Selecione dois cortes validos." };
    }
    if (first.id === second.id) {
      return { status: "invalid", message: "Escolha dois cortes diferentes." };
    }

    const fatA = first.fatPercentage / 100;
    const fatB = second.fatPercentage / 100;
    if (fatA === fatB) {
      return {
        status: "invalid",
        message: "Os cortes tem a mesma gordura. Use um corte mais magro e outro mais gordo.",
      };
    }

    const target = targetFat / 100;
    const minFat = Math.min(fatA, fatB);
    const maxFat = Math.max(fatA, fatB);
    if (target < minFat || target > maxFat) {
      return {
        status: "invalid",
        message: `Meta fora do alcance (${minFat * 100}% - ${maxFat * 100}%).`,
      };
    }

    const weightA = baseWeight * ((target - fatB) / (fatA - fatB));
    const weightB = baseWeight - weightA;
    const percentA = (weightA / baseWeight) * 100;
    const percentB = 100 - percentA;

    return {
      status: "ok",
      weightA,
      weightB,
      percentA,
      percentB,
      message: `Para chegar em ${targetFat}% de gordura, misture ${first.name} com ${second.name}.`,
    };
  }, [first, second, targetFat, baseWeight]);

  const handleApply = () => {
    if (calculation.status !== "ok" || !first || !second) return;
    onApply([
      { ingredientId: first.id, percentage: Number(calculation.percentA.toFixed(1)) },
      { ingredientId: second.id, percentage: Number(calculation.percentB.toFixed(1)) },
    ]);
  };

  return (
    <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground">
            Proporcao reversa
          </h3>
          <InfoTooltip label="Defina a gordura alvo e dois cortes. O app calcula os pesos ideais." />
        </div>
        <span className="text-xs text-muted-foreground">2 cortes</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Corte 1</span>
          <Select value={firstId} onValueChange={setFirstId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {candidates.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name} ({item.fatPercentage}%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Corte 2</span>
          <Select value={secondId} onValueChange={setSecondId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {candidates.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name} ({item.fatPercentage}%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 p-3">
        <div>
          <p className="text-sm font-medium text-foreground">Gordura alvo (%)</p>
          <p className="text-xs text-muted-foreground">
            Base atual: {formatWeight(baseWeight)}
          </p>
        </div>
        <Input
          type="number"
          min={5}
          max={40}
          value={targetFat}
          onChange={(event) => setTargetFat(Number(event.target.value))}
          className="w-20 text-center"
        />
      </div>

      <div
        className={`rounded-xl p-3 text-sm ${
          calculation.status === "ok"
            ? "bg-background text-foreground"
            : "bg-amber-50 text-amber-900"
        }`}
      >
        {calculation.message}
        {calculation.status === "ok" && first && second && (
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>{first.name}</span>
              <span>
                {formatWeight(calculation.weightA)} ({calculation.percentA.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>{second.name}</span>
              <span>
                {formatWeight(calculation.weightB)} ({calculation.percentB.toFixed(1)}%)
              </span>
            </div>
          </div>
        )}
      </div>

      <Button variant="warm" className="w-full" onClick={handleApply} disabled={calculation.status !== "ok"}>
        Aplicar ao blend
      </Button>
    </div>
  );
}
