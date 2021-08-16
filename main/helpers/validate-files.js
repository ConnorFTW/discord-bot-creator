import fs from "fs";
import path from "path";

/**
 * @param {string[]} pathFragments
 * @returns {boolean}
 */
export const readFile = (pathFragments, fileType = "json") => {
  let file = path.join(...pathFragments);

  try {
    let content = fs.readFileSync(file);

    if (fileType === "json") {
      content = JSON.parse(content);
    }

    return content;
  } catch {
    return false;
  }
};

export const validateSettingsFile = (rootFolder) => {
  let settings = readFile([rootFolder, "data", "settings.json"]);
  return !!(settings?.token || settings?.clientId);
};

export const validatePlayersFile = (rootFolder) => {
  let players = readFile([rootFolder, "data", "players.json"]);
  return !!Object.keys(players).length;
};

export const validateServersFile = (rootFolder) => {
  let servers = readFile([rootFolder, "data", "servers.json"]);
  return !!Object.keys(servers).length;
};

export const validateCommandsFile = (rootFolder) => {
  let commands = readFile([rootFolder, "data", "commands.json"]);
  return !!Object.keys(commands).length;
}

export const validateEventsFile = (rootFolder) => {
  let events = readFile([rootFolder, "data", "events.json"]);
  return !!Object.keys(events).length;
}

export const validatePackageFile = (rootFolder) => { 
  let packageFile = readFile([rootFolder, "package.json"]);
  return !!packageFile;
};

export const validate