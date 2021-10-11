export default {
  name: "Convert List to Text",
  section: "Lists and Loops",
  fields: [
    "list",
    "varName",
    "start",
    "middle",
    "end",
    "storage",
    "varName2",
    "sort",
  ],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.list, 10);
    const varName = this.evalMessage(data.varName, cache);
    let list = this.getList(storage, varName, cache);
    const sort = parseInt(data.sort, 10);
    if (sort === 0) list = list.sort();

    const start = this.evalMessage(data.start, cache).replace("\\n", "\n");
    const middle = this.evalMessage(data.middle, cache).replace("\\n", "\n");
    const end = this.evalMessage(data.end, cache).replace("\\n", "\n");
    let result = "";

    for (let i = 0; i < list.length; i++) {
      result += i === 0 ? start + String(list[i]) + end : start + middle + String(list[i]) + end;
    }

    if (result) {
      const varName2 = this.evalMessage(data.varName2, cache);
      const storage2 = parseInt(data.storage, 10);
      this.storeValue(result, storage2, varName2, cache);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
