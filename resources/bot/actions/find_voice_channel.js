export default {
  name: "Find Voice Channel",
  section: "Channel Control",

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName, "Voice Channel"];
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
    const find = this.evalMessage(data.find, cache);
    const channels = server.channels.cache.filter(
      (c) => c.type === "GUILD_VOICE"
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
        result = channels.find((c) => c.position === parseInt(find));
        break;
      case 3:
        result = channels.find((c) => c.userLimit === parseInt(find));
        break;
      case 4:
        result = channels.find((c) => c.bitrate === parseInt(find) / 1000);
        break;
      case 5:
        result = channels.find((c) => c.parentID === find);
        break;
      default:
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
      this.callNextAction(cache);
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
