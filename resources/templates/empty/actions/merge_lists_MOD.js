export default {
  name: "Merge Lists",
  section: "Lists and Loops",

  variableStorage(data, varType) {
    if (parseInt(data.storage3, 10) !== varType) return;
    return [data.varName3, "Unknown Type"];
  },

  fields: [
    "storage",
    "varName",
    "storage2",
    "varName2",
    "varName3",
    "storage3",
  ],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];

    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    const list = this.getList(storage, varName, cache);

    const varName2 = this.evalMessage(data.varName2, cache);
    const storage2 = parseInt(data.storage2, 10);
    const list2 = this.getList(storage2, varName2, cache);

    const result = list.concat(list2);

    if (result) {
      const varName3 = this.evalMessage(data.varName3, cache);
      const storage3 = parseInt(data.storage3, 10);
      this.storeValue(result, storage3, varName3, cache);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
