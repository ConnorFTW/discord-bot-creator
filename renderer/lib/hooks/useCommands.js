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
    if (commands) {
      window._commands = commands;
    }
  }, [commands]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window._commands || (window._commands && !force)) return;

    ipcRenderer?.once("getCommands", (event, commands) => {
      commands = JSON.parse(commands || "[]");
      window._commands = commands;
      setCommands(commands);
    });

    ipcRenderer?.send("getCommands");
  }, [typeof window]);

  return [commands?.filter((c) => c), setCommands];
}
