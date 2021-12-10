import Store from 'electron-store';
import { statSync } from 'fs';

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

  store.set('folders', folders);
};

/**
 * @returns {string[]}
 */
export const getFolders = () => {
  let folders = store.get('folders') || [];
  folders = removeInvalidFolders(folders);
  return folders;
};

export const removeInvalidFolders = (folders) => {
  return folders.filter((folder) => {
    try {
      return folder?.length && statSync(folder).isDirectory();
    } catch (e) {
      return false;
    }
  });
};
