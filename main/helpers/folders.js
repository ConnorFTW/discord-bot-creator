import Store from "electron-store";

const store = new Store({ defaults: { lastDirectories: [] } });

/**
 * @param {string} folder
 */
export const addFolder = (folder) => {
  if (!folder) return;

  let folders = getFolders();
  folders.push(folder);
  folders = Array.from(new Set(folders));
  folders = folders.filter((f) => f);

  store.set("folders", folders);
};

/**
 * @returns {string[]}
 */
export const getFolders = () => {
  return store.get("folders") || [];
};
