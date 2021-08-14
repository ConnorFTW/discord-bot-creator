export default {
  name: "Delete Channel",

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
      ? `${names[index]}`
      : `${names[index]} - ${data.varName}`;
  },

  fields: ["storage", "varName", "reason"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source Channel:<br>
		<select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
			${data.channels[isEvent ? 1 : 0]}
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

    glob.channelChange(document.getElementById("storage"), "varNameContainer");
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const channel = this.getChannel(storage, varName, cache);
    const reason = this.evalMessage(data.reason, cache);
    if (Array.isArray(channel)) {
      this.callListFunc(channel, "delete", [reason]).then(() =>
        this.callNextAction(cache)
      );
    } else if (channel && channel.delete) {
      channel
        .delete(reason)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
