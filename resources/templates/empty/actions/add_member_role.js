export default {
  name: "Add Member Role",
  section: "Member Control",
  fields: ["member", "varName2", "role", "varName", "reason"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.role);
    const varName = this.evalMessage(data.varName, cache);
    const role = this.getRole(storage, varName, cache);
    const storage2 = parseInt(data.member);
    const varName2 = this.evalMessage(data.varName2, cache);
    const member = this.getMember(storage2, varName2, cache);
    const reason = this.evalMessage(data.reason, cache);
    if (Array.isArray(member)) {
      this.callListFunc(
        member.map((m) => m.roles),
        "add",
        [role, reason]
      ).then(() => this.callNextAction(cache));
    } else if (this.dest(member, "roles", "add")) {
      member.roles
        .add(role, reason)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },
};
