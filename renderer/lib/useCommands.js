import electron from "electron";

import { useEffect, useState } from "react";

const ipcRenderer = electron.ipcRenderer || null;
// Write the same for commands

export default function useCommands({ force } = {}) {
  const [commands, _setCommands] = useState(() => {
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
      if (typeof commands === "string") {
        commands = JSON.parse(commands || "[]");
      }
      window._commands = commands;
      _setCommands(commands);
    });

    ipcRenderer?.send("getCommands");
  }, [typeof window]);

  const setCommands = (commands) => {
    console.log("Trying to save commands");
    ipcRenderer?.send("saveCommands", commands);
    ipcRenderer?.once("saveCommands", (event, response) => {
      if (!response.success) return console.error("Failed to save");
      let commands = response.commands;
      window._commands = commands || [];
      _setCommands(commands);
      console.log("Success", commands);
    });
  };

  return [commands?.filter((c) => c), setCommands];
}
