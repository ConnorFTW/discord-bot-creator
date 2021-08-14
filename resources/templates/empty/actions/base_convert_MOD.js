export default {
  name: "Base Convert MOD",
  displayName: "Base Convert",
  section: "Other Stuff",

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, "Number"];
  },

  fields: ["num", "basef", "baset", "storage", "varName"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const num = this.evalMessage(data.num, cache);
    const basef = parseInt(data.basef, 10);
    const baset = parseInt(data.baset, 10);
    let result;
    if (basef > 1 && basef <= 36 && baset > 1 && baset <= 36) {
      const base = parseInt(num, basef, 10);
      if (!Number.isNaN(base)) {
        result = base.toString(baset).toUpperCase();
      } else {
        console.log(`Invalid input, ${num} not Base-${basef}`);
      }
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },
};
