export default {
  name: "Send Message to Console",
  section: "Other Stuff",

  fields: ["tosend", "color"],

  /** @this {import("../utils/Actions.js").default} */
  async action(cache) {
    const Mods = this.getMods();
    const chalk = await Mods.require("chalk");
    const data = cache.actions[cache.index];
    const send = this.evalMessage(data.tosend, cache);

    const color = this.evalMessage(data.color, cache);
    console.log(chalk.hex(color)(send));
    this.callNextAction(cache);
  },

  mod(DBM) {
    DBM.Actions["Send Message to Console (Logs)"] =
      DBM.Actions["Send Message to Console"];
  },
};
