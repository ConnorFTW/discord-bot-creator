export default {
  name: "Draw Image on Image",

  section: "Image Editing",

  subtitle: function (data) {
    const storeTypes = [
      "",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    return `${storeTypes[parseInt(data.storage2)]} (${data.varName2}) -> ${
      storeTypes[parseInt(data.storage)]
    } (${data.varName})`;
  },

  fields: ["storage", "varName", "storage2", "varName2", "x", "y", "mask"],

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
		Image that is Drawn:<br>
		<select id="storage2" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 50%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 50%;">
		X Position:<br>
		<input id="x" class="round" type="text" value="0"><br>
	</div>
	<div style="float: right; width: 50%;">
		Y Position:<br>
		<input id="y" class="round" type="text" value="0"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px; width: 45%">
	Draw Effect:<br>
	<select id="mask" class="round">
		<option value="0" selected>Overlay</option>
		<option value="1">Replace</option>
		<option value="2">Mask</option>
	</select>
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
    if (!image || !image.composite) {
      this.callNextAction(cache);
      return;
    }
    const storage2 = parseInt(data.storage2);
    const varName2 = this.evalMessage(data.varName2, cache);
    const image2 = this.getVariable(storage2, varName2, cache);
    if (!image2) {
      this.callNextAction(cache);
      return;
    }
    const x = parseInt(this.evalMessage(data.x, cache));
    const y = parseInt(this.evalMessage(data.y, cache));
    const mask = data.mask;
    if (mask === "2") {
      image.mask(image2, x, y);
    } else if (mask === "1") {
      this.getDBM().Images.drawImageOnImage(image, image2, x, y);
    } else {
      image.composite(image2, x, y);
    }
    this.callNextAction(cache);
  },

  mod: function () {},
};
