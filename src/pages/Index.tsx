import { useEffect } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { ConnectionBanner } from "@/components/ConnectionBanner";
import { GrillTab } from "@/components/tabs/GrillTab";
import { LabTab } from "@/components/tabs/LabTab";
import { ToolsTab } from "@/components/tabs/ToolsTab";
import { WikiTab } from "@/components/tabs/WikiTab";
import { loadCatalog, seedCatalogIfNeeded } from "@/lib/contentStorage";
import {
  getPreference,
  loadHistory,
  loadSavedBlends,
} from "@/lib/blendStorage";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { useBlendStore } from "@/store/useBlendStore";

export default function Index() {
  const {
    activeTab,
    wakeLockEnabled,
    setActiveTab,
    setSavedBlends,
    setHistoryEntries,
    setTargetFat,
    setRoundingStep,
    setFatSourceId,
    setWakeLockEnabled,
    setAlertThresholds,
    setCmvTarget,
    setPriceOverrides,
    setCatalog,
  } = useBlendStore((state) => ({
    activeTab: state.activeTab,
    wakeLockEnabled: state.wakeLockEnabled,
    setActiveTab: state.setActiveTab,
    setSavedBlends: state.setSavedBlends,
    setHistoryEntries: state.setHistoryEntries,
    setTargetFat: state.setTargetFat,
    setRoundingStep: state.setRoundingStep,
    setFatSourceId: state.setFatSourceId,
    setWakeLockEnabled: state.setWakeLockEnabled,
    setAlertThresholds: state.setAlertThresholds,
    setCmvTarget: state.setCmvTarget,
    setPriceOverrides: state.setPriceOverrides,
    setCatalog: state.setCatalog,
  }));

  const { isOnline, isLowData, effectiveType } = useNetworkStatus();
  const shouldAnimate = !isLowData;
  const showCharts = !isLowData;

  useWakeLock(wakeLockEnabled);

  useEffect(() => {
    let isActive = true;
    const loadData = async () => {
      const [
        blends,
        history,
        prefTarget,
        prefStep,
        prefSource,
        prefWake,
        prefAlerts,
        prefCmv,
        prefPrices,
      ] = await Promise.all([
        loadSavedBlends(),
        loadHistory(10),
        getPreference("targetFat"),
        getPreference("roundingStep"),
        getPreference("fatSourceId"),
        getPreference("wakeLockEnabled"),
        getPreference("alertThresholds"),
        getPreference("cmvTarget"),
        getPreference("priceOverrides"),
      ]);
      if (!isActive) return;
      setSavedBlends(blends);
      setHistoryEntries(history);
      if (typeof prefTarget === "number") setTargetFat(prefTarget);
      if (typeof prefStep === "number") setRoundingStep(prefStep);
      if (typeof prefSource === "string") setFatSourceId(prefSource);
      if (typeof prefWake === "boolean") setWakeLockEnabled(prefWake);
      if (typeof prefCmv === "number") setCmvTarget(prefCmv);
      if (prefPrices && typeof prefPrices === "object") {
        setPriceOverrides(prefPrices as Record<string, number>);
      }
      if (prefAlerts && typeof prefAlerts === "object") {
        setAlertThresholds(prefAlerts as Record<string, number>);
      }
    };
    loadData();
    return () => {
      isActive = false;
    };
  }, [
    setAlertThresholds,
    setCmvTarget,
    setFatSourceId,
    setHistoryEntries,
    setPriceOverrides,
    setRoundingStep,
    setSavedBlends,
    setTargetFat,
    setWakeLockEnabled,
  ]);

  useEffect(() => {
    let isActive = true;
    const loadCatalogData = async () => {
      const cached = await loadCatalog();
      if (!isActive) return;
      setCatalog({
        catalogCuts: cached.cuts,
        catalogIngredients: cached.ingredients,
        catalogPresets: cached.presets,
      });
      const didSeed = await seedCatalogIfNeeded();
      if (!didSeed || !isActive) return;
      const refreshed = await loadCatalog();
      if (!isActive) return;
      setCatalog({
        catalogCuts: refreshed.cuts,
        catalogIngredients: refreshed.ingredients,
        catalogPresets: refreshed.presets,
      });
    };
    loadCatalogData();
    return () => {
      isActive = false;
    };
  }, [setCatalog]);

  return (
    <MotionConfig reducedMotion={isLowData ? "always" : "user"}>
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 pb-36">
          <ConnectionBanner
            isOnline={isOnline}
            isLowData={isLowData}
            effectiveType={effectiveType}
          />
          <AnimatePresence mode="wait">
            {activeTab === "lab" && (
              <LabTab shouldAnimate={shouldAnimate} showCharts={showCharts} />
            )}
            {activeTab === "wiki" && <WikiTab />}
            {activeTab === "grill" && <GrillTab />}
            {activeTab === "tools" && <ToolsTab />}
          </AnimatePresence>
        </div>

        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </div>
    </MotionConfig>
  );
}
