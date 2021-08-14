import { dialog, ipcMain } from "electron";
import { Loader, Runner } from "./index";
import Store from "electron-store";
import { clearLogs } from "./logs";

const store = new Store({ defaults: { lastDirectories: [] } });
let loader;
let runner;

function addDirectory(directory) {
  let directories = store.get("lastDirectories") || [];
  directories = Array.from(new Set(directories.concat(directory)));
  console.log({ directories });
  store.set("lastDirectories", directories);
}

ipcMain.on("directoryDialog", async (event) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory"],
  });
  loader = new Loader({ filePath: filePaths[0] });
  runner = new Runner({ filePath: filePaths[0] });
  addDirectory(filePaths[0]);
  event.sender.send("directoryDialog", filePaths[0]);
});

ipcMain.on("getLastDirectories", (event) => {
  const lastDirectories = store.get("lastDirectories") || [];
  event.sender.send("getLastDirectories", lastDirectories);
});

ipcMain.on("chooseDirectory", async (event, folder) => {
  if (typeof folder !== "string") return;
  loader = new Loader({ filePath: folder });
  runner = new Runner({ filePath: folder });
  event.sender.send("chooseDirectory", folder);
});

ipcMain.on("getSettings", async (event) => {
  const settings = await loader?.getSettings();
  event.sender.send("getSettings", settings);
});

ipcMain.on("getActions", async (event) => {
  let actions = await loader?.getLocalActions();
  event.sender.send("getActions", actions);
});

ipcMain.on("getConfig", async (event) => {
  const config = await loader?.getConfig();
  event.sender.send("getConfig", config);
});

ipcMain.on("getCommands", async (event) => {
  const commands = await loader?.getCommands();
  event.sender.send("getCommands", commands);
});

ipcMain.on("getEvents", async (event) => {
  const events = await loader?.getEvents();
  event.sender.send("getEvents", events);
});

ipcMain.on("saveSettings", async (event, settings) => {
  await loader?.saveSettings(settings);
  event.sender.send("saveSettings", { success: true, settings });
});

ipcMain.on("saveCommands", async (event, commands) => {
  await loader?.saveCommands(commands);
  event.sender.send("saveCommands", { success: true, commands });
});

ipcMain.on("saveEvents", async (event, events) => {
  await loader?.saveEvents(events);
  event.sender.send("saveEvents", { success: true, events });
});

// Runner Events

ipcMain.on("onBotRun", async (event) => {
  try {
    await runner?.run();
    event.sender.send("onBotRun", { success: true });
  } catch (error) {
    event.sender.send("onBotRun", { success: false, error });
  }
});

ipcMain.on("onBotStop", async (event) => {
  try {
    await runner?.stop();
    event.sender.send("onBotStop", { success: true });
  } catch (error) {
    event.sender.send("onBotStop", { success: false, error });
  }
});

ipcMain.on("getLogs", () => {
  ipcMain.emit("onBotLog");
});

ipcMain.on("clearLogs", (event) => {
  clearLogs();
  event.sender.send("clearLogs", { success: true });
});
