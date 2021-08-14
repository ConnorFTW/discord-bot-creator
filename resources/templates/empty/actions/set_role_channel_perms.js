export default {
  name: "Set Role Channel Perms",

  section: "Channel Control",

  subtitle: function (data) {
    const names = [
      "Same Channel",
      "Mentioned Channel",
      "Default Channel",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    const index = parseInt(data.channel);
    return index < 3 ? `${names[index]}` : `${names[index]} (${data.varName})`;
  },

  fields: [
    "channel",
    "varName",
    "role",
    "varName2",
    "permission",
    "state",
    "reason",
  ],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source Channel:<br>
		<select id="channel" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
			${data.channels[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Source Role:<br>
		<select id="role" name="second-list" class="round" onchange="glob.roleChange(this, 'varNameContainer2')">
			${data.roles[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text" list="variableList2"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 45%;">
		Permission:<br>
		<select id="permission" class="round">
			${data.permissions[0]}
		</select>
	</div>
	<div style="padding-left: 5%; float: left; width: 55%;">
		Change To:<br>
		<select id="state" class="round">
			<option value="0" selected>Allow</option>
			<option value="1">Inherit</option>
			<option value="2">Disallow</option>
		</select>
	</div>
</div><br><br><br>
<div>
  Reason:
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.channelChange(document.getElementById("channel"), "varNameContainer");
    glob.roleChange(document.getElementById("role"), "varNameContainer2");
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.channel);
    const varName = this.evalMessage(data.varName, cache);
    const channel = this.getChannel(storage, varName, cache);

    const storage2 = parseInt(data.role);
    const varName2 = this.evalMessage(data.varName2, cache);
    const role = this.getRole(storage2, varName2, cache);
    const reason = this.evalMessage(data.reason, cache);

    const options = {
      [data.permission]: [true, null, false][parseInt(data.state)],
    };

    if (role && role.id) {
      if (Array.isArray(channel)) {
        this.callListFunc(channel, "overwritePerms", [
          role,
          options,
          reason,
        ]).then(() => this.callNextAction(cache));
      } else if (channel && channel.overwritePermissions) {
        channel
          .overwritePerms(role, options, reason)
          .then(() => this.callNextAction(cache))
          .catch(this.displayError.bind(this, data, cache));
      } else {
        this.callNextAction(cache);
      }
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
