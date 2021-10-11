export default {
  name: "Save Variable",

  section: "Other Stuff",

  subtitle: function (data) {
    const storage = ["", "", "Server Variable", "Global Variable"];
    return `${storage[parseInt(data.storage)]} (${data.varName})`;
  },

  fields: ["storage", "varName"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source Variable:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			<option value="2" selected>Server Variable</option>
			<option value="3">Global Variable</option>
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList">
	</div>
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.refreshVariableList(document.getElementById("storage"));
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const Files = this.getDBM().Files;
    const type = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const item = this.getVariable(type, varName, cache);
    if (data.storage === "3") {
      Files.saveGlobalVariable(varName, item);
    } else if (cache.server) {
      Files.saveServerVariable(cache.server.id, varName, item);
    }
    this.callNextAction(cache);
  },

  mod: function () {},
};
