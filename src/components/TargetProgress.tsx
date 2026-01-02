import { cn } from "@/lib/utils";

interface TargetProgressProps {
  current: number;
  target: number;
}

export function TargetProgress({ current, target }: TargetProgressProps) {
  const clamped = Math.min(Math.max(current, 0), 50);
  const targetClamped = Math.min(Math.max(target, 0), 50);
  const progress = targetClamped === 0 ? 0 : Math.min((clamped / targetClamped) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Atual: {current}%</span>
        <span>Alvo: {target}%</span>
      </div>
      <div className="h-3 rounded-full bg-secondary overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            current <= target ? "bg-vegan-green" : "bg-cheese-gold",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
