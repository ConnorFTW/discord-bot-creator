export default {
  name: "Generate Random Number",

  section: "Other Stuff",

  subtitle: function (data) {
    const storage = ["", "Temp Variable", "Server Variable", "Global Variable"];
    return `${storage[parseInt(data.storage)]} (${data.varName}) => [${
      data.min
    }, ${data.max}]`;
  },

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName, "Number"];
  },

  fields: ["storage", "varName", "min", "max"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 45%;">
		Minimum Range:<br>
		<input id="min" class="round" type="text"><br>
	</div>
	<div style="padding-left: 5%; float: left; width: 50%;">
		Maximum Range:<br>
		<input id="max" class="round" type="text"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
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
    const type = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const min = parseInt(this.evalMessage(data.min, cache));
    const max = parseInt(this.evalMessage(data.max, cache)) + 1;
    const finalVal = Math.floor(Math.random() * (max - min)) + min;
    this.storeValue(finalVal, type, varName, cache);
    this.callNextAction(cache);
  },

  mod: function () {},
};
