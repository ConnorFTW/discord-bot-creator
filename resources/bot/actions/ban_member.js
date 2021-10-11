export default {
  name: "Ban Member",
  section: "Member Control",
  fields: ["member", "varName", "reason", "guild", "varName2", "days"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.member, 10);
    const varName = this.evalMessage(data.varName, cache);
    const varName2 = this.evalMessage(data.varName2, cache);
    const guildType = parseInt(data.guild, 10);
    const server = this.getServer(guildType, varName2, cache);
    const reason = this.evalMessage(data.reason, cache) || "";
    const days = parseInt(this.evalMessage(data.days, cache), 10);
    const member =
      type === 5
        ? this.evalMessage(varName)
        : this.getMember(type, varName, cache);
    if (guildType !== 0) {
      cache.server = server;
    }
    if (Array.isArray(member)) {
      this.callListFunc(member, "ban", [{ days, reason }]).then(() =>
        this.callNextAction(cache)
      );
    } else if (member) {
      server.members
        .ban(member, { days, reason })
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod() {},
};
