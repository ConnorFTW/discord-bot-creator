export default {
  name: "Set Bot AFK Status",

  section: "Bot Client Control",

  subtitle: function (data) {
    return `${data.afk === "0" ? "AFK" : "Not AFK"}`;
  },

  fields: ["afk"],

  html: function (isEvent, data) {
    return `
<div style="float: left; width: 80%;">
	AFK Status:<br>
	<select id="afk" class="round">
		<option value="0" selected>AFK</option>
		<option value="1">Not AFK</option>
	</select>
</div>`;
  },

  init: function () {},

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const botClient = this.getDBM().Bot.bot.user;
    const data = cache.actions[cache.index];
    const afk = parseInt(data.afk);
    if (botClient && botClient.setAFK) {
      botClient
        .setAFK(afk === 0)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
