export default {
  name: "Create Anchor",
  section: "Other Stuff",
  fields: ["anchor_id", "color", "description"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    this.callNextAction(cache);
  },
};
