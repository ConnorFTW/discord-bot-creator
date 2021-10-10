import { log } from "electron-log";

const SteamUser = require("steam-user");

// Setup client
export const client = new SteamUser({
  picsCacheAll: true,
});

// Init variables
let ownedApps = [];

// Setup listeners
client.on("loggedOn", () => {
  log("Logged in!");
});

client.on("appOwnershipCached", () => {
  ownedApps = client.getOwnedApps();
});

client.on("steamGuard", () => {
  log("Steam Guard");
});

export const ownsApp = (appId) => {
  return ownedApps.includes(appId);
};

export const logOn = (accountName, password) => {
  client.logOn({
    accountName: accountName,
    password: password,
  });
};
