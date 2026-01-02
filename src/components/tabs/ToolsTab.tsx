import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { InfoTooltip } from "@/components/InfoTooltip";
import { PriceEditor } from "@/components/PriceEditor";
import { useBlendStore } from "@/store/useBlendStore";
import { setPreference } from "@/lib/blendStorage";

export function ToolsTab() {
  const wakeLockSupported = typeof navigator !== "undefined" && "wakeLock" in navigator;
  const {
    wakeLockEnabled,
    alertThresholds,
    priceOverrides,
    catalogIngredients,
    setWakeLockEnabled,
    setAlertThresholds,
    setPriceOverrides,
  } = useBlendStore((state) => ({
    wakeLockEnabled: state.wakeLockEnabled,
    alertThresholds: state.alertThresholds,
    priceOverrides: state.priceOverrides,
    catalogIngredients: state.catalogIngredients,
    setWakeLockEnabled: state.setWakeLockEnabled,
    setAlertThresholds: state.setAlertThresholds,
    setPriceOverrides: state.setPriceOverrides,
  }));

  const handleWakeLockToggle = (value: boolean) => {
    setWakeLockEnabled(value);
    setPreference("wakeLockEnabled", value);
  };

  const handleAlertThresholdChange = (
    key: keyof typeof alertThresholds,
    value: number,
    min: number,
    max: number,
  ) => {
    const clamped = Math.min(max, Math.max(min, value));
    const next = { ...alertThresholds, [key]: clamped };
    setAlertThresholds(next);
    setPreference("alertThresholds", next);
  };

  const handlePriceOverridesChange = (next: Record<string, number>) => {
    setPriceOverrides(next);
    setPreference("priceOverrides", next);
  };

  return (
    <motion.section
      key="tools"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 pt-6"
    >
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-foreground">Ferramentas</h1>
        <p className="text-sm text-muted-foreground">
          Cronometros, conversores e modo de preparo em breve.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">Cooking Mode</h2>
        <p className="text-sm text-muted-foreground">
          Ative para manter a tela ligada durante o preparo.
        </p>
        <div className="flex items-center justify-between rounded-xl bg-background p-3">
          <div>
            <p className="text-sm font-medium text-foreground">Tela sempre ativa</p>
            <p className="text-xs text-muted-foreground">
              {wakeLockSupported ? "Evita que a tela apague." : "Nao suportado neste navegador."}
            </p>
          </div>
          <Switch
            checked={wakeLockEnabled}
            onCheckedChange={handleWakeLockToggle}
            disabled={!wakeLockSupported}
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Calibrar alertas</h2>
            <p className="text-sm text-muted-foreground">
              Ajuste os limites conforme seu resultado real.
            </p>
          </div>
          <InfoTooltip label="Se o burger ficou seco, aumente o minimo. Se ficou oleoso, reduza o maximo." />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Smash minimo (%)</p>
              <p className="text-xs text-muted-foreground">Aumente se o smash ficou seco.</p>
            </div>
            <Input
              type="number"
              min={18}
              max={28}
              value={alertThresholds.smashMinFat}
              onChange={(event) =>
                handleAlertThresholdChange(
                  "smashMinFat",
                  Number(event.target.value),
                  18,
                  28,
                )
              }
              className="w-20 text-center"
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Airfryer maximo (%)</p>
              <p className="text-xs text-muted-foreground">Reduza se houver muita fumaca.</p>
            </div>
            <Input
              type="number"
              min={16}
              max={26}
              value={alertThresholds.airfryerMaxFat}
              onChange={(event) =>
                handleAlertThresholdChange(
                  "airfryerMaxFat",
                  Number(event.target.value),
                  16,
                  26,
                )
              }
              className="w-20 text-center"
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Fit maximo (%)</p>
              <p className="text-xs text-muted-foreground">Ajuste para manter leveza.</p>
            </div>
            <Input
              type="number"
              min={12}
              max={20}
              value={alertThresholds.fitMaxFat}
              onChange={(event) =>
                handleAlertThresholdChange("fitMaxFat", Number(event.target.value), 12, 20)
              }
              className="w-20 text-center"
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Alto minimo (%)</p>
              <p className="text-xs text-muted-foreground">Aumente se o miolo ficou seco.</p>
            </div>
            <Input
              type="number"
              min={16}
              max={24}
              value={alertThresholds.tallMinFat}
              onChange={(event) =>
                handleAlertThresholdChange("tallMinFat", Number(event.target.value), 16, 24)
              }
              className="w-20 text-center"
            />
          </div>
        </div>
      </div>

      <PriceEditor
        ingredients={catalogIngredients}
        priceOverrides={priceOverrides}
        onChange={handlePriceOverridesChange}
      />
    </motion.section>
  );
}
