export default {
  name: "Store Member Data",
  section: "Data",

  variableStorage(data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName2, "Unknown Type"];
  },

  fields: [
    "member",
    "varName",
    "dataName",
    "defaultVal",
    "storage",
    "varName2",
  ],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const { evalMessage, getMember } = this;
    const data = cache.actions[cache.index];
    const type = parseInt(data.member);
    const varName = evalMessage(data.varName, cache);
    const member = getMember(type, varName, cache);
    if (member?.guild) {
      const dataName = evalMessage(data.dataName, cache);
      const defVal = this.eval(evalMessage(data.defaultVal, cache), cache);
      const result = this.Files.getMemberData(member, dataName, defVal);
      const storage = parseInt(data.storage);
      const varName2 = evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },
};
