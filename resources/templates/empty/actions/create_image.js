export default {
  name: "Create Image",

  section: "Image Editing",

  subtitle: function (data) {
    return `${data.url}`;
  },

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName, "Image"];
  },

  fields: ["url", "storage", "varName"],

  html: function (isEvent, data) {
    return `
<div>
	Local/Web URL:<br>
	<input id="url" class="round" type="text" value="resources/"><br>
</div>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text"><br>
	</div>
</div>`;
  },

  init: function () {},

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const Images = this.getDBM().Images;
    Images.getImage(this.evalMessage(data.url, cache))
      .then(
        function (image) {
          const varName = this.evalMessage(data.varName, cache);
          const storage = parseInt(data.storage);
          this.storeValue(image, storage, varName, cache);
          this.callNextAction(cache);
        }.bind(this)
      )
      .catch(this.displayError.bind(this, data, cache));
  },

  mod: function () {},
};
