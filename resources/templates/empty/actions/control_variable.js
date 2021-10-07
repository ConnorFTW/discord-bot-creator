export default {
  name: "Control Variable",

  section: "Other Stuff",

  subtitle: function (data) {
    const storage = ["", "Temp Variable", "Server Variable", "Global Variable"];
    return `${storage[parseInt(data.storage)]} (${data.varName}) ${
      data.changeType === "1" ? "+=" : "="
    } ${data.value}`;
  },

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName, "Unknown Type"];
  },

  fields: ["storage", "varName", "changeType", "value"],

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
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 45%;">
		Control Type:<br>
		<select id="changeType" class="round">
			<option value="0" selected>Set Value</option>
			<option value="1">Add Value</option>
		</select>
	</div>
	<div style="float: right; width: 50%;">
		Value:<br>
		<input id="value" class="round" type="text" name="is-eval"><br>
	</div>
</div>`;
  },

  init: function () {},

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const storage = this.getVariable(type, varName, cache);
    const isAdd = data.changeType === "1";
    let val = this.evalMessage(data.value, cache);
    try {
      val = this.eval(val, cache);
    } catch (e) {
      this.displayError(data, cache, e);
    }
    if (val !== undefined) {
      if (isAdd) {
        let result;
        result = storage === undefined ? val : storage + val;
        this.storeValue(result, type, varName, cache);
      } else {
        this.storeValue(val, type, varName, cache);
      }
    }
    this.callNextAction(cache);
  },

  mod: function () {},
};
