import electron from "electron";
import { useEffect, useState } from "react";

const ipcRenderer = electron.ipcRenderer || null;
export default function useSettings({ force } = {}) {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== "undefined" && window.__settings) {
      return window.__settings;
    }

    return null;
  });

  useEffect(() => {
    if (settings && !force) return;
    ipcRenderer?.on("getSettings", (event, settings) => {
      settings = JSON.parse(settings || "{}");
      window._settings = settings;
      setSettings(settings);
    });
    ipcRenderer?.send("getSettings");

    return () => {
      ipcRenderer?.removeAllListeners("getSettings");
    };
  }, [!!ipcRenderer, settings]);

  return [settings, setSettings];
}
