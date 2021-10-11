export default {
  name: "Auto Help",
  section: "Other Stuff",

  fields: ["Category", "Description", "Include"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    this.callNextAction(cache);
  },

  mod() {},
};
