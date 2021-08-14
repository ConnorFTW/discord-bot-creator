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
