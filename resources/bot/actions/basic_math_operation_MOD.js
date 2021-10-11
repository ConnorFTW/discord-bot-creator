export default {
  name: "Basic Math Operation",
  section: "Other Stuff",
  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, "Number"];
  },

  fields: ["FirstNumber", "info", "SecondNumber", "storage", "varName"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const FN = parseFloat(
      this.evalMessage(data.FirstNumber, cache).replace(/,/g, "")
    );
    const SN = parseFloat(
      this.evalMessage(data.SecondNumber, cache).replace(/,/g, "")
    );
    const info = parseInt(data.info, 10);

    let result;
    switch (info) {
      case 0:
        result = FN + SN;
        break;
      case 1:
        result = FN - SN;
        break;
      case 2:
        result = FN * SN;
        break;
      case 3:
        result = FN / SN;
        break;
      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },
};
