import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SelectionTip } from "@/data/selectionTips";

interface SelectionTipCardProps {
  label?: string;
  tip?: SelectionTip;
}

export function SelectionTipCard({ label = "Dica rapida", tip }: SelectionTipCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (!tip) return null;

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold text-foreground">{tip.title}</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="text-xs text-primary"
          aria-expanded={expanded}
        >
          {expanded ? "Mostrar menos" : "Ler mais"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">{tip.definition}</p>
      <p className="text-xs text-muted-foreground">
        Impacto: <span className="text-foreground">{tip.impact}</span>
      </p>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {tip.recommended && (
              <p className="text-xs text-muted-foreground">
                Recomendado: <span className="text-foreground">{tip.recommended}</span>
              </p>
            )}
            {tip.tips && tip.tips.length > 0 && (
              <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                {tip.tips.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {tip.caution && <p className="text-xs text-fat-warning">Cuidado: {tip.caution}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
