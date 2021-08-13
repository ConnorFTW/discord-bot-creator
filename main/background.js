import { app, dialog, ipcMain, globalShortcut } from "electron";
import serve from "electron-serve";
import { createWindow, createMenu, Loader, Runner } from "./helpers";
import Store from "electron-store";

const isProd = process.env.NODE_ENV === "production";
let loader;
let runner;
let logs = [];

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();
  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    //mainWindow.webContents.openDevTools();
  }

  createMenu(mainWindow);

  // Register shortcuts
  globalShortcut.register("CommandOrControl+S", () => {
    const url = mainWindow.webContents.getURL();

    // Emit save event if we are in dashboard
    if (url.includes("/dashboard")) {
      mainWindow.webContents.send("save");
    }
  });

  ipcMain.on("onBotLog", (log, _log) => {
    if (typeof log !== "string") log = _log;
    console.log({ log });
    if (log) logs.push(log);
    mainWindow.webContents.send("onLogsUpdate", logs);
  });

  ipcMain.on("onBotError", (error) => {
    console.error({
      error,
    });
    mainWindow.webContents.send("onErrorsUpdate", error);
  });
})();

app.on("window-all-closed", () => {
  app.quit();
});

const store = new Store({ lastDirectories: [] });

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

ipcMain.on("getLastDirectories", (event, arg) => {
  const lastDirectories = store.get("lastDirectories") || [];
  event.sender.send("getLastDirectories", lastDirectories);
});

ipcMain.on("chooseDirectory", async (event, folder) => {
  if (typeof folder !== "string") return;
  loader = new Loader({ filePath: folder });
  runner = new Runner({ filePath: folder });
  event.sender.send("chooseDirectory", folder);
});

ipcMain.on("getSettings", async (event, args) => {
  const settings = await loader?.getSettings();
  event.sender.send("getSettings", settings);
});

ipcMain.on("getActions", async (event, args) => {
  let actions = await loader?.getLocalActions();
  event.sender.send("getActions", actions);
});

ipcMain.on("getConfig", async (event, args) => {
  const config = await loader?.getConfig();
  event.sender.send("getConfig", config);
});

ipcMain.on("getCommands", async (event, args) => {
  const commands = await loader?.getCommands();
  event.sender.send("getCommands", commands);
});

ipcMain.on("getEvents", async (event, args) => {
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

ipcMain.on("onBotRun", async (event, args) => {
  try {
    await runner?.run();
    event.sender.send("onBotRun", { success: true });
  } catch (error) {
    event.sender.send("onBotRun", { success: false, error });
  }
});

ipcMain.on("onBotStop", async (event, args) => {
  try {
    await runner?.stop();
    event.sender.send("onBotStop", { success: true });
  } catch (error) {
    event.sender.send("onBotStop", { success: false, error });
  }
});

ipcMain.on("getLogs", (event, args) => {
  ipcMain.emit("onBotLog");
});

ipcMain.on("clearLogs", (event, args) => {
  logs = [];
  event.sender.send("clearLogs", { success: true });
});
