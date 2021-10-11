export default {
  name: "Create List",

  section: "Lists and Loops",

  subtitle: function (data) {
    const storage = ["", "Temp Variable", "Server Variable", "Global Variable"];
    return `${storage[parseInt(data.storage)]} (${data.varName})`;
  },

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName, "List"];
  },

  fields: ["storage", "varName"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
</div>`;
  },

  init: function () {},

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage);
    this.storeValue([], storage, varName, cache);
    this.callNextAction(cache);
  },

  mod: function () {},
};
