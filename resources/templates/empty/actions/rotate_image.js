export default {
  name: "Rotate Image",

  section: "Image Editing",

  subtitle: function (data) {
    const storeTypes = [
      "",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    const mirror = [
      "No Mirror",
      "Horizontal Mirror",
      "Vertical Mirror",
      "Diagonal Mirror",
    ];
    return `${storeTypes[parseInt(data.storage)]} (${data.varName}) -> [${
      mirror[parseInt(data.mirror)]
    } ~ ${data.rotation}°]`;
  },

  fields: ["storage", "varName", "rotation", "mirror"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 45%;">
		Source Image:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 50%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 45%;">
		Mirror:<br>
		<select id="mirror" class="round">
			<option value="0" selected>None</option>
			<option value="1">Horizontal Mirror</option>
			<option value="2">Vertical Mirror</option>
			<option value="3">Diagonal Mirror</option>
		</select><br>
	</div>
	<div style="float: right; width: 50%;">
		Rotation (degrees):<br>
		<input id="rotation" class="round" type="text" value="0"><br>
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
    const storage = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(storage, varName, cache);
    if (!image) {
      this.callNextAction(cache);
      return;
    }
    const mirror = parseInt(data.mirror);
    switch (mirror) {
      case 0:
        image.mirror(false, false);
        break;
      case 1:
        image.mirror(true, false);
        break;
      case 2:
        image.mirror(false, true);
        break;
      case 3:
        image.mirror(true, true);
        break;
    }
    const rotation = parseInt(data.rotation);
    image.rotate(rotation);
    this.callNextAction(cache);
  },

  mod: function () {},
};
