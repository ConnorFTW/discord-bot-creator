export default {
  name: "Create Voice Channel",

  section: "Channel Control",

  subtitle: function (data) {
    return `${data.channelName}`;
  },

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName, "Voice Channel"];
  },

  fields: [
    "channelName",
    "bitrate",
    "userLimit",
    "storage",
    "varName",
    "categoryID",
    "reason",
  ],

  html: function (isEvent, data) {
    return `
Name:<br>
<input id="channelName" class="round" type="text"><br>
Category ID:<br>
<input id= "categoryID" class="round" type="text" placeholder="Leave blank for default!" style="width: 95%"><br>
<div style="float: left; width: 50%;">
	Bitrate:<br>
	<input id="bitrate" class="round" type="text" placeholder="Leave blank for default!" style="width: 90%;"><br>
</div>
<div style="float: right; width: 50%;">
	User Limit:<br>
	<input id="userLimit" class="round" type="text" placeholder="Leave blank for default!" style="width: 90%;"><br>
</div>
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
    if (this.dest(server, "channels", "create")) {
      const name = this.evalMessage(data.channelName, cache);
      const storage = parseInt(data.storage);
      const reason = this.evalMessage(data.reason, cache);
      const channelData = { reason };
      if (data.bitrate) {
        channelData.bitrate =
          parseInt(this.evalMessage(data.bitrate, cache)) * 1000;
      }
      if (data.userLimit) {
        channelData.userLimit = parseInt(
          this.evalMessage(data.userLimit, cache)
        );
      }
      if (data.categoryID) {
        channelData.parent = this.evalMessage(data.categoryID, cache);
      }
      server.channels
        .create(name, {
          ...channelData,
          type: "voice",
        })
        .then(
          function (channel) {
            const varName = this.evalMessage(data.varName, cache);
            this.storeValue(channel, storage, varName, cache);
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
