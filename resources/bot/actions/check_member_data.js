export default {
  name: "Check Member Data",
  section: "Data",

  fields: [
    "member",
    "varName",
    "dataName",
    "comparison",
    "value",
    "iftrue",
    "iftrueVal",
    "iffalse",
    "iffalseVal",
  ],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.member, 10);
    const varName = this.evalMessage(data.varName, cache);
    const member = this.getMember(type, varName, cache);
    let result = false;

    if (member?.guild) {
      const dataName = this.evalMessage(data.dataName, cache);
      const val1 = this.Files.getMemberData(member, dataName);
      const compare = parseInt(data.comparison, 10);
      let val2 = this.evalMessage(data.value, cache);
      if (compare !== 6) val2 = this.eval(val2, cache);
      if (val2 === false) val2 = this.evalMessage(data.value, cache);

      const switcher = [
        (val1, val2) => val1 !== undefined,
        (val1, val2) => val1 == val2,
        (val1, val2) => val1 === val2,
        (val1, val2) => val1 < val2,
        (val1, val2) => val1 > val2,
        (val1, val2) => val1?.includes(val2),
        (val1, val2) => Boolean(val1.match(new RegExp(`^${val2}$`, "i"))),
        (val1, val2) => val1.length > val2,
        (val1, val2) => val1.length < val2,
        (val1, val2) => val1.length === val2,
        (val1, val2) => val1.startsWith(val2),
        (val1, val2) => val1.endsWith(val2),
      ];

      result = switcher[compare](val1, val2) || false;
    }
    this.executeResults(result, data, cache);
  },

  mod() {},
};
