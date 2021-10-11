export default {
  name: "Change Server",
  section: "Server Control",
  fields: ["server", "varName"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.server);
    const varName = this.evalMessage(data.varName, cache);
    const server = this.getServer(type, varName, cache);
    if (server) {
      cache.server = server;
    }
    this.callNextAction(cache);
  },
};
