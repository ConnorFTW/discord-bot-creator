export default {
  name: "Send TTS Message",

  section: "Messaging",

  subtitle: function (data) {
    const channels = [
      "Same Channel",
      "Command Author",
      "Mentioned User",
      "Mentioned Channel",
      "Default Channel",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    return `${channels[parseInt(data.channel)]}: "${data.message.replace(
      /[\n\r]+/,
      ""
    )}"`;
  },

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName2, "Message"];
  },

  fields: ["channel", "varName", "message", "storage", "varName2"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Send To:<br>
		<select id="channel" class="round" onchange="glob.sendTargetChange(this, 'varNameContainer')">
			${data.sendTargets[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Message:<br>
	<textarea id="message" rows="9" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text">
	</div>
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.sendTargetChange(
      document.getElementById("channel"),
      "varNameContainer"
    );
    glob.variableChange(
      document.getElementById("storage"),
      "varNameContainer2"
    );
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const channel = parseInt(data.channel);
    const message = data.message;
    if (channel === undefined || message === undefined) return;
    const varName = this.evalMessage(data.varName, cache);
    const target = this.getSendTarget(channel, varName, cache);
    if (Array.isArray(target)) {
      this.callListFunc(target, "send", [
        this.evalMessage(message, cache),
        { tts: true },
      ]).then(
        function (resultMsg) {
          const varName2 = this.evalMessage(data.varName2, cache);
          const storage = parseInt(data.storage);
          this.storeValue(resultMsg, storage, varName2, cache);
          this.callNextAction(cache);
        }.bind(this)
      );
    } else if (target && target.send) {
      target
        .send(this.evalMessage(message, cache), { tts: true })
        .then(
          function (resultMsg) {
            const varName2 = this.evalMessage(data.varName2, cache);
            const storage = parseInt(data.storage);
            this.storeValue(resultMsg, storage, varName2, cache);
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
