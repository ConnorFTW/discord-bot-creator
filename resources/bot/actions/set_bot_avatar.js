export default {
  name: "Set Bot Avatar",

  section: "Bot Client Control",

  subtitle: function (data) {
    const storeTypes = [
      "",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    return `${storeTypes[parseInt(data.storage)]} (${data.varName})`;
  },

  fields: ["storage", "varName"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 45%;">
		Source Image:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 50%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text"><br>
	</div>
</div>`;
  },

  init: function () {},

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const botClient = this.getDBM().Bot.bot.user;
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(storage, varName, cache);
    if (botClient && botClient.setAvatar) {
      const Images = this.getDBM().Images;
      Images.createBuffer(image)
        .then(
          function (buffer) {
            botClient
              .setAvatar(buffer)
              .then(() => this.callNextAction(cache))
              .catch(this.displayError.bind(this, data, cache));
          }.bind(this)
        )
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
