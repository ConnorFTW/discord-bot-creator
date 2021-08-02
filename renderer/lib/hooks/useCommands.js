import electron from "electron";

import { useEffect, useState } from "react";

const ipcRenderer = electron.ipcRenderer || null;
// Write the same for commands

export default function useCommands({ force } = {}) {
  const [commands, setCommands] = useState(() => {
    if (typeof window !== "undefined" && window.__commands) {
      return window.__commands;
    }

    return null;
  });

  useEffect(() => {
    ipcRenderer?.on("getCommands", (event, commands) => {
      commands = JSON.parse(commands || "[]");
      window._commands = commands;
      setCommands(commands);
    });
    if (commands && !force) return;
    ipcRenderer?.send("getCommands");

    return () => {
      ipcRenderer?.removeAllListeners("getCommands");
    };
  }, [!!ipcRenderer, commands]);

  return [commands?.filter((c) => c), setCommands];
}
