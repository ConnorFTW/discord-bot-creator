import { app, dialog, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow, Loader } from "./helpers";
import Store from "electron-store";

const isProd = process.env.NODE_ENV === "production";
let loader;

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
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

const store = new Store({ lastDirectories: [] });

function addDirectory(directory) {
  const directories = store.get("lastDirectories") || [];
  directories.push(directory);
  store.set("lastDirectories", directories);
}

ipcMain.on("directoryDialog", async (event, arg) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory"],
  });
  loader = new Loader({ filePath: filePaths[0] });
  addDirectory(filePaths[0]);
  event.sender.send("directoryDialog", filePaths[0]);
});

ipcMain.on("getLastDirectory", (event, arg) => {
  const lastDirectories = store.get("lastDirectories") || [];
  event.sender.send("getLastDirectory", lastDirectories[0]);
  loader = new Loader({ filePath: lastDirectories[0] });
});

ipcMain.on("getSettings", async (event, args) => {
  const settings = await loader?.getSettings();

  event.sender.send("getSettings", settings);
});

ipcMain.on("getActions", async (event, args) => {
  const actions = await loader?.getLocalActions();
  event.sender.send("getActions", actions);
});

ipcMain.on("getConfig", async (event, args) => {
  const config = await loader?.getConfig();
  event.sender.send("getConfig", config);
});

ipcMain.on("getCommands", async (event, args) => {
  const commands = await loader?.getCommands();
  console.log(commands);
  event.sender.send("getCommands", commands);
});

ipcMain.on("getEvents", async (event, args) => {
  const events = await loader?.getEvents();
  event.sender.send("getEvents", events);
});
