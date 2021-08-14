export default {
  name: "Get List Length",

  section: "Lists and Loops",

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName2, "Number"];
  },

  fields: ["list", "varName", "storage", "varName2"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.list);
    const varName = this.evalMessage(data.varName, cache);
    const list = this.getList(storage, varName, cache);

    if (list && list.length) {
      const varName2 = this.evalMessage(data.varName2, cache);
      const storage2 = parseInt(data.storage);
      this.storeValue(list.length, storage2, varName2, cache);
    }

    this.callNextAction(cache);
  },

  mod: function () {},
};
