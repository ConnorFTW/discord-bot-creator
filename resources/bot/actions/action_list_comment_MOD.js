export default {
  name: "Comment",
  section: "Other Stuff",
  fields: ["comment", "color"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    this.callNextAction(cache);
  },
};
