import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { CacheStatusCard } from "@/components/CacheStatusCard";
import { ConnectionBanner } from "@/components/ConnectionBanner";
import { GrillTab } from "@/components/tabs/GrillTab";
import { LabTab } from "@/components/tabs/LabTab";
import { ToolsTab } from "@/components/tabs/ToolsTab";
import { WikiTab } from "@/components/tabs/WikiTab";
import { getCatalogStatus, loadCatalog, seedCatalogIfNeeded } from "@/lib/contentStorage";
import {
  getPreference,
  loadHistory,
  loadSavedBlends,
  setPreference,
} from "@/lib/blendStorage";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { useBlendStore } from "@/store/useBlendStore";

export default function Index() {
  const {
    activeTab,
    wakeLockEnabled,
    lowDataMode,
    setActiveTab,
    setSavedBlends,
    setHistoryEntries,
    setTargetFat,
    setRoundingStep,
    setFatSourceId,
    setWakeLockEnabled,
    setLowDataMode,
    setAlertThresholds,
    setCmvTarget,
    setPriceOverrides,
    setCatalog,
  } = useBlendStore((state) => ({
    activeTab: state.activeTab,
    wakeLockEnabled: state.wakeLockEnabled,
    lowDataMode: state.lowDataMode,
    setActiveTab: state.setActiveTab,
    setSavedBlends: state.setSavedBlends,
    setHistoryEntries: state.setHistoryEntries,
    setTargetFat: state.setTargetFat,
    setRoundingStep: state.setRoundingStep,
    setFatSourceId: state.setFatSourceId,
    setWakeLockEnabled: state.setWakeLockEnabled,
    setLowDataMode: state.setLowDataMode,
    setAlertThresholds: state.setAlertThresholds,
    setCmvTarget: state.setCmvTarget,
    setPriceOverrides: state.setPriceOverrides,
    setCatalog: state.setCatalog,
  }));

  const { isOnline, isLowData, effectiveType } = useNetworkStatus();
  const effectiveLowData = useMemo(() => {
    if (!isOnline) return true;
    if (lowDataMode === "on") return true;
    if (lowDataMode === "off") return false;
    return isLowData;
  }, [isLowData, isOnline, lowDataMode]);
  const shouldAnimate = !effectiveLowData;
  const showCharts = !effectiveLowData;
  const [cacheStatus, setCacheStatus] = useState<{
    isReady: boolean;
    lastUpdated: string | null;
    categories: string[];
    remainingCategories: string[];
    hasServiceWorker: boolean;
  }>({
    isReady: false,
    lastUpdated: null,
    categories: [],
    remainingCategories: [],
    hasServiceWorker: false,
  });

  useWakeLock(wakeLockEnabled);

  useEffect(() => {
    if (lowDataMode !== "auto" || !isLowData) return;
    setLowDataMode("on");
    setPreference("lowDataMode", "on");
  }, [isLowData, lowDataMode, setLowDataMode]);

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
        prefLowData,
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
        getPreference("lowDataMode"),
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
      if (typeof prefLowData === "string") {
        const allowed = ["auto", "on", "off"];
        if (allowed.includes(prefLowData)) {
          setLowDataMode(prefLowData as typeof lowDataMode);
        }
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
    setLowDataMode,
  ]);

  const refreshCacheStatus = useCallback(async () => {
    const status = await getCatalogStatus();
    let hasServiceWorker = false;
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        hasServiceWorker = Boolean(registration?.active);
      } catch {
        hasServiceWorker = false;
      }
    }
    setCacheStatus({ ...status, hasServiceWorker });
  }, []);

  useEffect(() => {
    refreshCacheStatus();
  }, [refreshCacheStatus]);

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
      if (!isActive) return;
      await refreshCacheStatus();
    };
    loadCatalogData();
    return () => {
      isActive = false;
    };
  }, [refreshCacheStatus, setCatalog]);

  useEffect(() => {
    refreshCacheStatus();
  }, [activeTab, isOnline, refreshCacheStatus]);

  useEffect(() => {
    const handler = () => refreshCacheStatus();
    window.addEventListener("catalog-updated", handler);
    return () => {
      window.removeEventListener("catalog-updated", handler);
    };
  }, [refreshCacheStatus]);

  return (
    <MotionConfig reducedMotion={effectiveLowData ? "always" : "user"}>
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 pb-36">
          <ConnectionBanner
            isOnline={isOnline}
            isLowData={effectiveLowData}
            effectiveType={effectiveType}
            lowDataMode={lowDataMode}
          />
          <CacheStatusCard
            isReady={cacheStatus.isReady}
            lastUpdated={cacheStatus.lastUpdated}
            categories={cacheStatus.categories}
            remainingCategories={cacheStatus.remainingCategories}
            hasServiceWorker={cacheStatus.hasServiceWorker}
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
