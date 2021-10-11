export default {
  name: "Draw Text on Image",

  section: "Image Editing",

  subtitle: function (data) {
    return `${data.text}`;
  },

  fields: ["storage", "varName", "x", "y", "font", "width", "text"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source Image:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="float: left; width: 50%;">
	Local Font URL (.fnt):<br>
	<input id="font" class="round" type="text" value="fonts/Asimov.fnt"><br>
	X Position:<br>
	<input id="x" class="round" type="text" value="0"><br>
</div>
<div style="float: right; width: 50%;">
	Max Width:<br>
	<input id="width" class="round" type="text" placeholder="Leave blank for none!"><br>
	Y Position:<br>
	<input id="y" class="round" type="text" value="0"><br>
</div><br><br><br>
<div>
	Text:<br>
	<textarea id="text" rows="5" placeholder="Insert text here..." style="width: 99%; white-space: nowrap; resize: none;"></textarea>
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.refreshVariableList(document.getElementById("storage"));
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const Images = this.getDBM().Images;
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(storage, varName, cache);
    if (!image) {
      this.callNextAction(cache);
      return;
    }
    const fontName = this.evalMessage(data.font, cache);
    const x = parseInt(this.evalMessage(data.x, cache));
    const y = parseInt(this.evalMessage(data.y, cache));
    const width = data.width
      ? parseInt(this.evalMessage(data.width, cache))
      : null;
    const text = this.evalMessage(data.text, cache);
    Images.getFont(fontName)
      .then(
        function (font) {
          if (width) {
            image.print(font, x, y, text, width);
          } else {
            image.print(font, x, y, text);
          }
          this.callNextAction(cache);
        }.bind(this)
      )
      .catch(this.displayError.bind(this, data, cache));
  },

  mod: function () {},
};
