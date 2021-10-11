export default {
  name: "Jump to Anchor",
  section: "Other Stuff",
  fields: ["description", "jump_to_anchor", "color"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const id = this.evalMessage(
      cache.actions[cache.index].jump_to_anchor,
      cache
    );
    this.anchorJump(id, cache);
  },
};
