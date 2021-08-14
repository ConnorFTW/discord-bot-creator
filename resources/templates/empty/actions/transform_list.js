export default {
  name: "Transform List",
  section: "Lists and Loops",
  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName2, "List"];
  },
  fields: ["list", "varName", "transform", "null", "storage", "varName2"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.list);
    const varName = this.evalMessage(data.varName, cache);
    const list = this.getList(storage, varName, cache);

    let result = [];
    const code = this.evalMessage(data.transform, cache);
    const nullVal = this.evalMessage(data.null, cache);
    let defaultVal;

    try {
      defaultVal = eval(nullVal);
    } catch (e) {
      this.displayError(data, cache, e);
      defaultVal = "";
    }

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      try {
        const val = eval(code);
        if (val) {
          result.push(val);
        } else if (defaultVal) {
          result.push(defaultVal);
        }
      } catch (e) {
        this.displayError(data, cache, e);
        if (defaultVal) {
          result.push(defaultVal);
        }
      }
    }

    if (result) {
      const varName2 = this.evalMessage(data.varName2, cache);
      const storage2 = parseInt(data.storage);
      this.storeValue(result, storage2, varName2, cache);
    }

    this.callNextAction(cache);
  },

  mod: function () {},
};
