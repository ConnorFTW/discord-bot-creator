const SteamUser = require("steam-user");

// Setup client
const client = new SteamUser({
  picsCacheAll: true,
});

// Init variables
let ownedApps = [];

// Setup listeners
client.on("loggedOn", () => {
  console.log("Logged in!");
});

client.on("appOwnershipCached", () => {
  ownedApps = client.getOwnedApps();
});

client.on("steamGuard", () => {
  console.log("Steam Guard");
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