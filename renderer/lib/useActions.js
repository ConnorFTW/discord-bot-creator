import electron from "electron";

import { useEffect, useState } from "react";

const ipcRenderer = electron.ipcRenderer || null;

export default function useActions({ force } = {}) {
  const [actions, setActions] = useState(() => {
    if (typeof window !== "undefined" && window.__actions) {
      return window.__actions;
    }

    return null;
  });

  useEffect(() => {
    ipcRenderer?.on("getActions", (_event, actions) => {
      window._actions = actions;
      setActions(actions);
    });
    if (actions && !force) return;
    ipcRenderer?.send("getActions");

    return () => {
      ipcRenderer?.removeAllListeners("getActions");
    };
  }, [!!ipcRenderer, actions]);

  return [actions?.filter((a) => a) || [], setActions];
}
