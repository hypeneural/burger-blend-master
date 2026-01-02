import { useState } from "react";
import { Reorder } from "framer-motion";

interface StackLayer {
  id: string;
  label: string;
}

const defaultLayers: StackLayer[] = [
  { id: "molho-base", label: "Molho base" },
  { id: "queijo", label: "Queijo" },
  { id: "topping-quente", label: "Topping quente" },
  { id: "topping-frio", label: "Topping frio" },
];

const layerColors = [
  "bg-cheese-gold/60",
  "bg-grill-orange/60",
  "bg-meat-red/50",
  "bg-vegan-green/50",
];

export function BurgerStack() {
  const [layers, setLayers] = useState(defaultLayers);

  return (
    <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Montagem do lanche</h3>
          <p className="text-xs text-muted-foreground">
            Camadas do sanduiche. Nao altera o blend da carne.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">Arraste para reordenar</span>
      </div>

      <div className="space-y-1">
        <div className="h-6 rounded-full bg-[hsl(var(--cheese-gold))] text-xs text-primary-foreground flex items-center justify-center">
          Pao superior
        </div>

        <Reorder.Group axis="y" values={layers} onReorder={setLayers} className="space-y-1">
          {layers.map((layer, index) => {
            const color = layerColors[index % layerColors.length];
            return (
              <Reorder.Item
                key={layer.id}
                value={layer}
                className={`h-8 rounded-full ${color} text-xs text-foreground flex items-center justify-between px-3 shadow-sm`}
              >
                <span>{layer.label}</span>
                <span className="text-[11px] text-muted-foreground">arraste</span>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>

        <div className="h-10 rounded-full bg-[hsl(var(--meat-brown))] text-xs text-primary-foreground flex items-center justify-center">
          Blend base
        </div>
        <div className="h-6 rounded-full bg-[hsl(var(--cheese-gold))] text-xs text-primary-foreground flex items-center justify-center">
          Pao inferior
        </div>
      </div>
    </div>
  );
}
