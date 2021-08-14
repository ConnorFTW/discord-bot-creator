export default {
  name: "Create Role",

  section: "Role Control",

  subtitle: function (data) {
    return `${data.roleName}`;
  },

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName, "Role"];
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
Name:<br>
<input id="roleName" class="round" type="text"><br>
<div style="float: left; width: 50%;">
	Display Separate from Online Users:<br>
	<select id="hoist" class="round" style="width: 90%;">
		<option value="true">Yes</option>
		<option value="false" selected>No</option>
	</select><br>
	Mentionable:<br>
	<select id="mentionable" class="round" style="width: 90%;">
		<option value="true" selected>Yes</option>
		<option value="false">No</option>
	</select><br>
</div>
<div style="float: right; width: 50%;">
	Color:<br>
	<input id="color" class="round" type="text" placeholder="Leave blank for default!"><br>
	Position:<br>
	<input id="position" class="round" type="text" placeholder="Leave blank for default!" style="width: 90%;"><br>
</div><br>
<div>
  Reason:
  <input id="reason" placeholder="Optional" class="round" type="text">
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text"><br>
	</div>
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.variableChange(document.getElementById("storage"), "varNameContainer");
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
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
    roleData.hoist = JSON.parse(data.hoist);
    roleData.mentionable = JSON.parse(data.mentionable);
    if (this.dest(server, "roles", "create")) {
      const storage = parseInt(data.storage);
      server.roles
        .create({ data: roleData, reason })
        .then((role) => {
          const varName = this.evalMessage(data.varName, cache);
          this.storeValue(role, storage, varName, cache);
          this.callNextAction(cache);
        })
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
