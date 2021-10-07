export default {
  name: "Delete Emoji",

  section: "Emoji Control",

  subtitle: function (data) {
    const inputTypes = [
      "Specific Emoji",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    return `${inputTypes[parseInt(data.emoji)]} (${data.varName})`;
  },

  fields: ["emoji", "varName", "reason"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source Emoji:<br>
		<select id="emoji" class="round" onchange="glob.onChange1(this)">
			<option value="0" selected>Specific Emoji</option>
			<option value="1">Temp Variable</option>
			<option value="2">Server Variable</option>
			<option value="3">Global Variable</option>
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		<span id="extName">Emoji Name</span>:<br>
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

    glob.onChange1 = function (event) {
      const value = parseInt(event.value);
      const varNameInput = document.getElementById("extName");
      if (value === 0) {
        varNameInput.innerHTML = "Emoji Name";
      } else {
        varNameInput.innerHTML = "Variable Name";
      }
    };

    glob.onChange1(document.getElementById("emoji"));
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    const type = parseInt(data.emoji);
    const reason = this.evalMessage(data.reason, cache);
    const varName = this.evalMessage(data.varName, cache);
    let emoji;
    emoji = type === 0 ? server.emojis.cache.find((e) => e.name === varName) : this.getVariable(type, varName, cache);
    if (!emoji) {
      this.callNextAction(cache);
      return;
    }
    if (emoji && emoji.delete) {
      emoji
        .delete(reason)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
