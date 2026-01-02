import { Bookmark, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateTotalWeight, formatWeight } from "@/lib/blendMath";
import type { SavedBlend } from "@/types/blend";

interface SavedBlendCardProps {
  blend: SavedBlend;
  onLoad: () => void;
  onDelete: () => void;
}

export function SavedBlendCard({ blend, onLoad, onDelete }: SavedBlendCardProps) {
  const extras = blend.extras ?? [];
  const totalWeight = calculateTotalWeight(blend.burgerCount, blend.burgerWeight, extras);

  return (
    <div className="p-5 rounded-2xl border-2 bg-gradient-to-br from-card to-background border-border shadow-card">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bookmark className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold text-foreground truncate">{blend.name}</h3>
          <p className="text-sm text-muted-foreground">{blend.description}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-muted-foreground">
            <span>
              {blend.burgerCount}x {blend.burgerWeight}g
            </span>
            <span>-</span>
            <span>Total {formatWeight(totalWeight)}</span>
            {extras.length > 0 && (
              <>
                <span>-</span>
                <span>{extras.length} extras</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <Button variant="warm" size="sm" className="flex-1" onClick={onLoad}>
          Abrir
        </Button>
        <Button variant="ghost" size="sm" className="flex-1" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
