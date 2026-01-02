import { useEffect, useState } from "react";

type ConnectionInfo = {
  isOnline: boolean;
  isLowData: boolean;
  effectiveType: string | null;
  saveData: boolean;
};

const getConnection = () => {
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string; saveData?: boolean; addEventListener?: Function; removeEventListener?: Function };
    mozConnection?: { effectiveType?: string; saveData?: boolean; addEventListener?: Function; removeEventListener?: Function };
    webkitConnection?: { effectiveType?: string; saveData?: boolean; addEventListener?: Function; removeEventListener?: Function };
  };
  return nav.connection || nav.mozConnection || nav.webkitConnection;
};

const buildStatus = (): ConnectionInfo => {
  if (typeof navigator === "undefined") {
    return {
      isOnline: true,
      isLowData: false,
      effectiveType: null,
      saveData: false,
    };
  }

  const connection = getConnection();
  const effectiveType = connection?.effectiveType ?? null;
  const saveData = Boolean(connection?.saveData);
  const isLowData = saveData || effectiveType === "slow-2g" || effectiveType === "2g";

  return {
    isOnline: navigator.onLine,
    isLowData,
    effectiveType,
    saveData,
  };
};

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<ConnectionInfo>(() => buildStatus());

  useEffect(() => {
    const update = () => setStatus(buildStatus());
    const connection = getConnection();

    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    connection?.addEventListener?.("change", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      connection?.removeEventListener?.("change", update);
    };
  }, []);

  return status;
};
