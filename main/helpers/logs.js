import Store from "electron-store";

const store = new Store({ defaults: { logs: [] } });

/**
 * @param {string} log
 * @returns {undefined}
 */
export const addLog = (log) => {
  store.set("logs", store.get("logs").concat(log));
};

/**
 * @returns {string[]}
 */
export const getLogs = () => {
  return store.get("logs");
};

/**
 * @returns {undefined}
 */
export const clearLogs = () => {
  store.set("logs", []);
};
