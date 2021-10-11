export default {
  name: "Edit Role",

  section: "Role Control",

  subtitle: function (data) {
    const roles = [
      "Mentioned Role",
      "1st Author Role",
      "1st Server Role",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    return `${roles[parseInt(data.storage)]}`;
  },

  fields: [
    "roleName",
    "hoist",
    "mentionable",
    "color",
    "position",
    "storage",
    "varName",
    "reason",
  ],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source Role:<br>
		<select id="storage" class="round" onchange="glob.roleChange(this, 'varNameContainer')">
			${data.roles[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Name:<br>
	<input id="roleName" placeholder="Leave blank to not edit!" class="round" type="text">
</div><br>
<div style="float: left; width: 50%;">
	Display Separate from Online Users:<br>
	<select id="hoist" class="round" style="width: 90%;">
		<option value="none" selected>Don't Edit</option>
		<option value="true">Yes</option>
		<option value="false">No</option>
	</select><br>
	Mentionable:<br>
	<select id="mentionable" class="round" style="width: 90%;">
		<option value="none" selected>Don't Edit</option>
		<option value="true">Yes</option>
		<option value="false">No</option>
	</select><br>
</div>
<div style="float: right; width: 50%;">
	Color:<br>
	<input id="color" class="round" type="text" placeholder="Leave blank to not edit!"><br>
	Position:<br>
	<input id="position" class="round" type="text" placeholder="Leave blank to not edit!" style="width: 90%;"><br>
</div><br><br><br>
<div>
  Reason:
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.roleChange(document.getElementById("storage"), "varNameContainer");
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const reason = this.evalMessage(data.reason, cache);
    const roleData = {};
    if (data.roleName) {
      roleData.name = this.evalMessage(data.roleName, cache);
    }
    if (data.color) {
      roleData.color = this.evalMessage(data.color, cache);
    }
    if (data.position) {
      roleData.position = parseInt(this.evalMessage(data.position, cache));
    }
    if (data.hoist !== "none") {
      roleData.hoist = JSON.parse(data.hoist);
    }
    if (data.mentionable !== "none") {
      roleData.mentionable = JSON.parse(data.mentionable);
    }
    const storage = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const role = this.getRole(storage, varName, cache);
    if (Array.isArray(role)) {
      this.callListFunc(role, "edit", [roleData, reason]).then(() =>
        this.callNextAction(cache)
      );
    } else if (role && role.edit) {
      role
        .edit(roleData, reason)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
