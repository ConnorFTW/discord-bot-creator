export default {
  name: "Send Stats to BFD",
  section: "Other Stuff",
  fields: ["BFDToken", "ClientID", "info"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const token = this.evalMessage(data.BFDToken, cache);
    const clientid = this.evalMessage(data.ClientID, cache);
    const Mods = this.getMods();
    const BFD = Mods.require("bfd-api");
    const bfd = new BFD(token);
    bfd.postCount(this.getDBM().Bot.bot.guilds.cache.size, clientid);
    this.callNextAction(cache);
  },
};
