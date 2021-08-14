export default {
  name: "Control Member Data",
  section: "Data",

  fields: ["member", "varName", "dataName", "changeType", "value"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.member);
    const varName = this.evalMessage(data.varName, cache);
    const member = this.getMember(type, varName, cache);
    const changeType = data.changeType;
    const value = data.value;

    if (member?.guild) {
      const dataName = this.evalMessage(data.dataName, cache);
      const isAdd = changeType === "1";
      let val = this.evalMessage(value, cache);
      try {
        val = this.eval(val, cache);
      } catch (e) {
        this.displayError(data, cache, e);
      }
      if (val !== undefined) {
        if (isAdd) {
          this.Files.addMemberData(member, dataName, val);
        } else {
          this.Files.setMemberData(member, dataName, val);
        }
      }
    } else {
      member || this.displayError(data, cache, "Member not found.");
    }
    this.callNextAction(cache);
  },
};
