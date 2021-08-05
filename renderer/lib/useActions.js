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
    if ((window._loading || window._actions) && !force) {
      console.log("Not performing expensive read");
      return;
    }

    window._loading = true;

    console.log("Window: ", window._actions);
    console.log("Performing expensive read");

    ipcRenderer?.on("getActions", (_event, actions) => {
      console.log("Received Response");
      window._actions = actions;
      window._loading = false;
      setActions(actions);
    });

    ipcRenderer?.send("getActions");

    return () => {
      ipcRenderer?.removeAllListeners("getActions");
    };
  }, [!!ipcRenderer, actions]);

  return [actions?.filter((a) => a) || [], setActions];
}
