const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  getSettings: () => loader?.getSettings(),
  getActions: () => loader?.getLocalActions(),
  getConfig: () => loader?.getConfig(),
  getCommands: () => loader?.getCommands(),
  getEvents: () => loader?.getEvents(),
});

console.log("Say Hello from they other side!! 🎶");
