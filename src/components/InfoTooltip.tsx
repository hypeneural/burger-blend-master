import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  label: string;
  className?: string;
}

export function InfoTooltip({ label, className }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground",
              className,
            )}
            aria-label="Ajuda"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[220px] text-xs">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
