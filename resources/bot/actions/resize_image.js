export default {
  name: "Resize Image",

  section: "Image Editing",

  subtitle: function (data) {
    const storeTypes = [
      "",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    return `${storeTypes[parseInt(data.storage)]} (${data.varName}) -> [${
      data.width
    }, ${data.height}]`;
  },

  fields: ["storage", "varName", "width", "height"],

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
	<div style="float: left; width: 50%;">
		New Width (direct size or percent):<br>
		<input id="width" class="round" type="text" value="100%"><br>
	</div>
	<div style="float: right; width: 50%;">
		New Height (direct size or percent):<br>
		<input id="height" class="round" type="text" value="100%"><br>
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
    let width = this.evalMessage(data.width, cache);
    let height = this.evalMessage(data.height, cache);
    if (width.endsWith("%")) {
      const percent = width.replace("%", "");
      width = image.bitmap.width * (parseInt(percent) / 100);
    } else {
      width = parseInt(width);
    }
    if (height.endsWith("%")) {
      const percent = height.replace("%", "");
      height = image.bitmap.height * (parseInt(percent) / 100);
    } else {
      height = parseInt(height);
    }
    image.resize(width, height);
    this.callNextAction(cache);
  },

  mod: function () {},
};
