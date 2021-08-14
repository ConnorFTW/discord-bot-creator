export default {
  name: "Send File",

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

  fields: ["channel", "varName", "file", "message"],

  html: function (isEvent, data) {
    return `
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
<br><br><br>
<div style="padding-top: 8px;">
	Local File URL:<br>
	<input id="file" class="round" type="text" value="resources/"><br>
</div>
<div>
	Message:<br>
	<textarea id="message" rows="8" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.sendTargetChange(
      document.getElementById("channel"),
      "varNameContainer"
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
    const options = {
      files: [this.getLocalFile(this.evalMessage(data.file, cache))],
    };
    if (Array.isArray(target)) {
      this.callListFunc(target, "send", [
        this.evalMessage(message, cache),
        options,
      ]).then(() => this.callNextAction(cache));
    } else if (target && target.send) {
      try {
        target
          .send(this.evalMessage(message, cache), options)
          .then(() => this.callNextAction(cache))
          .catch(this.displayError.bind(this, data, cache));
      } catch (e) {
        this.displayError(data, cache, e);
      }
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
