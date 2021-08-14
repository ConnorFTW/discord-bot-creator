export default {
  name: "Find Channel",
  section: "Channel Control",

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName, "Channel"];
  },

  fields: ["info", "find", "storage", "varName"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const server = cache.server;
    if (!this.dest(server, "channels", "cache")) {
      this.callNextAction(cache);
      return;
    }
    const data = cache.actions[cache.index];
    const info = parseInt(data.info);
    const find = this.evalMessage(data.find, cache).toLowerCase();
    const channels = server.channels.cache.filter(
      (c) => c.type !== "voice" && c.type !== "category"
    );
    let result;
    switch (info) {
      case 0:
        result = channels.get(find);
        break;
      case 1:
        result = channels.find((c) => c.name === find);
        break;
      case 2:
        result = channels.find((c) => c.topic === find);
        break;
      case 3:
        result = channels.find((c) => c.position === parseInt(find));
        break;
      case 4:
        result = channels.find((c) => c.parentID === find);
        break;
      default:
        this.displayError(data, cache, `Unknown source field: ${info}`);
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
      this.callNextAction(cache);
    } else {
      this.displayError(data, cache, `Could not find channel: ${find}`);
      this.callNextAction(cache);
    }
  },
};
