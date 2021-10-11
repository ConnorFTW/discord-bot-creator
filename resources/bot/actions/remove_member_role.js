export default {
  name: "Remove Member Role",

  section: "Member Control",

  subtitle: function (data) {
    const roles = [
      "Mentioned Role",
      "1st Author Role",
      "1st Server Role",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    const channels = [
      "Mentioned User",
      "Command Author",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    return `${channels[parseInt(data.member)]} - ${roles[parseInt(data.role)]}`;
  },

  fields: ["member", "varName2", "role", "varName", "reason"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source Role:<br>
		<select id="role" class="round" onchange="glob.roleChange(this, 'varNameContainer')">
			${data.roles[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Member:<br>
		<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer2')">
			${data.members[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
	</div>
</div><br><br><br>
<div>
  Reason:
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.roleChange(document.getElementById("role"), "varNameContainer");
    glob.memberChange(document.getElementById("member"), "varNameContainer2");
  },

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
        "remove",
        [role, reason]
      ).then(() => this.callNextAction(cache));
    } else if (this.dest(member, "roles", "cache")) {
      member.roles
        .remove(role, reason)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
