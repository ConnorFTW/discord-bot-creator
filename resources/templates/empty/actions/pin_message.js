export default {
  name: "Pin Message",

  section: "Messaging",

  subtitle: function (data) {
    const names = [
      "Command Message",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    const index = parseInt(data.storage);
    return data.storage === "0"
      ? `Pin ${names[index]}`
      : `Pin ${names[index]} (${data.varName})`;
  },

  fields: ["storage", "varName"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source Message:<br>
		<select id="storage" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
			${data.messages[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.messageChange(document.getElementById("storage"), "varNameContainer");
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const message = this.getMessage(storage, varName, cache);
    if (Array.isArray(message)) {
      this.callListFunc(message, "pin", []).then(() =>
        this.callNextAction(cache)
      );
    } else if (message && message.pin) {
      message
        .pin()
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
