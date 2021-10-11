export default {
  name: "Create Text Channel",

  section: "Channel Control",

  subtitle: function (data) {
    return `${data.channelName}`;
  },

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName, "Channel"];
  },

  fields: [
    "channelName",
    "topic",
    "position",
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
	Topic:<br>
	<input id="topic" class="round" type="text"><br>
</div>
<div style="float: right; width: 50%;">
	Position:<br>
	<input id="position" class="round" type="text" placeholder="Leave blank for default!" style="width: 90%;"><br>
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
    if (server && server.channels && server.channels.create) {
      const name = this.evalMessage(data.channelName, cache);
      const storage = parseInt(data.storage);
      const reason = this.evalMessage(data.reason, cache);
      const channelData = { reason };
      if (data.topic) {
        channelData.topic = this.evalMessage(data.topic, cache);
      }
      if (data.position) {
        channelData.position = parseInt(this.evalMessage(data.position, cache));
      }
      if (data.categoryID) {
        channelData.parent = this.evalMessage(data.categoryID, cache);
      }
      server.channels
        .create(name, channelData)
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
