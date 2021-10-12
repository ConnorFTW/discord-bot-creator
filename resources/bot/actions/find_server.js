export default {
  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName, "Server"];
  },
  fields: ["serverInfo", "find", "storage", "varName"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const bot = this.getDBM().Bot.bot;
    const servers = bot.guilds.cache;
    const data = cache.actions[cache.index];
    const info = parseInt(data.serverInfo);
    const find = this.evalMessage(data.find, cache);
    let result;
    switch (info) {
      case 0:
        result = servers.get(find);
        break;
      case 1:
        result = servers.find((s) => s.name === find);
        break;
      case 2:
        result = servers.find((s) => s.nameAcronym === find);
        break;
      case 3:
        result = servers.find((s) => s.memberCount === parseInt(find));
        break;
      case 4:
        result = servers.find((s) => s.region === find);
        break;
      case 5:
        result = servers.find((s) => s.ownerID === find);
        break;
      case 6:
        result = servers.find((s) => s.verificationLevel === find);
        break;
      case 7:
        result = servers.find((s) => s.available === (find === "true"));
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
};
