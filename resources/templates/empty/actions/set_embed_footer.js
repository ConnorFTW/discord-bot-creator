export default {
  name: "Set Embed Footer",
  section: "Embed Message",
  fields: ["storage", "varName", "message", "footerIcon"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const embed = this.getVariable(storage, varName, cache);
    if (embed?.setFooter) {
      embed.setFooter(
        this.evalMessage(data.message, cache),
        this.evalMessage(data.footerIcon, cache)
      );
    } else {
      this.displayError(data, cache, "Embed not found");
    }
    this.callNextAction(cache);
  },

  mod: function () {},
};
