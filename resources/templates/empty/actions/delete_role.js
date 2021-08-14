export default {
  name: "Delete Role",

  section: "Role Control",

  subtitle: function (data) {
    const names = [
      "Mentioned Role",
      "1st Author Role",
      "1st Server Role",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    const index = parseInt(data.storage);
    return data.storage === "0"
      ? `${names[index]}`
      : `${names[index]} - ${data.varName}`;
  },

  fields: ["storage", "varName", "reason"],

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
    const storage = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const role = this.getRole(storage, varName, cache);
    const reason = this.evalMessage(data.reason, cache);
    if (Array.isArray(role)) {
      this.callListFunc(role, "delete", [reason]).then(() =>
        this.callNextAction(cache)
      );
    } else if (role && role.delete) {
      role
        .delete(reason)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
