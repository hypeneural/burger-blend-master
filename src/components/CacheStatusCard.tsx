import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CacheStatusCardProps {
  isReady: boolean;
  lastUpdated: string | null;
  categories: string[];
  remainingCategories: string[];
  hasServiceWorker: boolean;
}

const categoryLabels: Record<string, string> = {
  bovine: "Bovinos",
  pork: "Suinos",
  vegan: "Veganos",
  extra: "Extras",
};

const formatDate = (value: string | null) => {
  if (!value) return "Nao sincronizado";
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function CacheStatusCard({
  isReady,
  lastUpdated,
  categories,
  remainingCategories,
  hasServiceWorker,
}: CacheStatusCardProps) {
  const readyLabel = isReady && hasServiceWorker ? "Offline pronto" : "Sincronizando cache";
  const Icon = isReady && hasServiceWorker ? CheckCircle2 : Loader2;
  const badgeStyle =
    isReady && hasServiceWorker
      ? "bg-vegan-green/10 text-vegan-green border-vegan-green/30"
      : "bg-amber-50 text-amber-900 border-amber-200";

  return (
    <div className="mb-4 rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "h-9 w-9 rounded-xl border flex items-center justify-center",
            badgeStyle,
          )}
        >
          <Icon className={cn("h-4 w-4", !isReady && "animate-spin")} />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-foreground">{readyLabel}</p>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(lastUpdated)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full border border-border px-2 py-0.5">
              {hasServiceWorker ? "PWA ativo" : "Cache local"}
            </span>
            {categories.length > 0 && (
              <span className="rounded-full border border-border px-2 py-0.5">
                Offline: {categories.map((item) => categoryLabels[item] ?? item).join(", ")}
              </span>
            )}
            {remainingCategories.length > 0 && (
              <span className="rounded-full border border-border px-2 py-0.5 text-amber-800">
                Pendentes:{" "}
                {remainingCategories.map((item) => categoryLabels[item] ?? item).join(", ")}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Quando estiver pronto, Wiki, Presets e Relatorio ficam disponiveis mesmo sem rede.
          </p>
        </div>
      </div>
    </div>
  );
}
