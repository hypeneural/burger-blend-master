import { useState } from "react";
import { Signal, WifiOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConnectionBannerProps {
  isOnline: boolean;
  isLowData: boolean;
  effectiveType?: string | null;
  lowDataMode?: "auto" | "on" | "off";
}

export function ConnectionBanner({
  isOnline,
  isLowData,
  effectiveType,
  lowDataMode = "auto",
}: ConnectionBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (isOnline && !isLowData) return null;
  if (dismissed && isOnline) return null;

  const isOffline = !isOnline;
  const isSlow = effectiveType === "slow-2g" || effectiveType === "2g";
  const isForced = lowDataMode === "on" && isOnline && !isSlow;
  const Icon = isOffline ? WifiOff : Signal;
  const title = isOffline
    ? "Modo offline ativo"
    : isForced
      ? "Economia de dados ativada"
      : "Conexao lenta detectada";
  const description = isOffline
    ? "Usando dados salvos no aparelho."
    : isForced
      ? "Animacoes e graficos reduzidos por preferencia salva."
      : `Animacoes reduzidas para economizar dados${effectiveType ? ` (${effectiveType})` : ""}.`;

  return (
    <div
      className={cn(
        "mb-4 rounded-2xl border px-4 py-3 flex items-start gap-3",
        isOffline
          ? "bg-fat-danger/10 border-fat-danger/30 text-fat-danger"
          : "bg-amber-50 border-amber-200 text-amber-900",
      )}
    >
      <div className="mt-0.5">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 text-sm">
        <p className="font-semibold">{title}</p>
        <p className="text-xs">{description}</p>
      </div>
      {!isOffline && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDismissed(true)}
          className="h-7 w-7 text-amber-900"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
