export default {
  name: "Apply Image Effect",

  section: "Image Editing",

  subtitle: function (data) {
    const storeTypes = [
      "",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    const effect = [
      "Greyscale",
      "Invert",
      "Normalize",
      "Remove Transparency",
      "Apply Minor Blur",
      "Apply Major Blur",
      "Apply Sepia",
      "Dither",
    ];
    return `${storeTypes[parseInt(data.storage)]} (${data.varName}) -> ${
      effect[parseInt(data.effect)]
    }`;
  },

  fields: ["storage", "varName", "effect"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 45%;">
		Base Image:<br>
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
	<div style="float: left; width: 90%;">
		Effect:<br>
		<select id="effect" class="round">
			<option value="0" selected>Greyscale</option>
			<option value="1">Invert</option>
			<option value="2">Normalize</option>
			<option value="3">Remove Transparency</option>
			<option value="4">Apply Minor Blur</option>
			<option value="5">Apply Major Blur</option>
			<option value="6">Apply Sepia</option>
			<option value="7">Dither</option>
		</select><br>
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
    const effect = parseInt(data.effect);
    switch (effect) {
      case 0:
        image.greyscale();
        break;
      case 1:
        image.invert();
        break;
      case 2:
        image.normalize();
        break;
      case 3:
        image.opaque();
        break;
      case 4:
        image.blur(2);
        break;
      case 5:
        image.blur(10);
        break;
      case 6:
        image.sepia();
        break;
      case 7:
        image.dither565();
        break;
    }
    this.callNextAction(cache);
  },

  mod: function () {},
};
