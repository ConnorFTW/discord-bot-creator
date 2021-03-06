export default {
  name: "Create Invite",

  section: "Channel Control",

  subtitle: function (data) {
    const names = [
      "Same Channel",
      "Mentioned Channel",
      "1st Server Channel",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    const index = parseInt(data.storage);
    return parseInt(data.storage) < 3
      ? `Invite to ${names[index]}`
      : `Invite to ${names[index]} (${data.varName})`;
  },

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName2, "Text"];
  },

  fields: [
    "channel",
    "varName",
    "maxUses",
    "lifetime",
    "tempInvite",
    "unique",
    "storage",
    "varName2",
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
	<div style="float: left; width: 70%;">
		Max Uses:<br>
		<input id="maxUses" class="round" type="text" placeholder="Leave blank for infinite uses!"><br>
		Invite Lifetime (in seconds):<br>
		<input id="lifetime" class="round" type="text" placeholder="Leave blank to last forever!"><br>
	</div>
	<div style="float: right; width: 30%;">
		Temporary Invite:<br>
		<select id="tempInvite" class="round" style="width: 90%;">
			<option value="true">Yes</option>
			<option value="false" selected>No</option>
		</select><br>
		Is Unique:<br>
		<select id="unique" class="round" style="width: 90%;">
			<option value="true" selected>Yes</option>
			<option value="false">No</option>
		</select>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
	</div>
</div><br><br><br><br><br><br><br>
<div>
  Reason:
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.channelChange(document.getElementById("channel"), "varNameContainer");
    glob.variableChange(
      document.getElementById("storage"),
      "varNameContainer2"
    );
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.channel);
    const varName = this.evalMessage(data.varName, cache);
    const channel = this.getChannel(storage, varName, cache);
    const reason = this.evalMessage(data.reason, cache);
    const options = {};
    if (data.maxUses) {
      options.maxUses = parseInt(this.evalMessage(data.maxUses, cache));
    } else {
      options.maxUses = 0;
    }
    if (data.lifetime) {
      options.maxAge = parseInt(this.evalMessage(data.lifetime, cache));
    } else {
      options.maxAge = 0;
    }
    if (reason) {
      options.reason = reason;
    }
    options.maxUses = data.temporary === "true";
    options.unique = data.unique === "true";
    if (Array.isArray(channel)) {
      this.callListFunc(channel, "createInvite", [options]).then(
        function (invite) {
          const varName2 = this.evalMessage(data.varName2, cache);
          const storage2 = parseInt(data.storage);
          this.storeValue(invite.url, storage2, varName2, cache);
          this.callNextAction(cache);
        }.bind(this)
      );
    } else if (channel && channel.createInvite) {
      channel
        .createInvite(options)
        .then(
          function (invite) {
            const varName2 = this.evalMessage(data.varName2, cache);
            const storage2 = parseInt(data.storage);
            this.storeValue(invite.url, storage2, varName2, cache);
            this.callNextAction(cache);
          }.bind(this)
        )
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
