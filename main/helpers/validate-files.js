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
export const validateFile = (externalFolder, fileName) => {
  let file = readFile([externalFolder, fileName]);

  switch (fileName) {
    case "./data/settings.json":
      return !!(file?.token || file?.clientId);
    case "./data/players.json":
      return !!Object.keys(file).length;
    case "./data/servers.json":
      return !!Object.keys(file).length;
    case "./data/globals.json":
      return !!Object.keys(file).length;
    case "./data/commands.json":
      return !!Object.keys(file).length;
    case "./data/events.json":
      return !!Object.keys(file).length;
    case "./package.json":
      return !!file;
    default:
      return false;
  }
};
