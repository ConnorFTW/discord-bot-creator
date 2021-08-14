export default {
  name: "Set Bot Username",

  section: "Bot Client Control",

  subtitle: function (data) {
    return `${data.username}`;
  },

  fields: ["username"],

  html: function (isEvent, data) {
    return `
<p>Changing usernames in Discord is heavily rate limited, with only 2 requests every hour. Use this sparingly!</p>
<div style="width: 90%;">
	Username:<br>
	<input id="username" class="round" type="text">
</div>`;
  },

  init: function () {},

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const botClient = this.getDBM().Bot.bot.user;
    const data = cache.actions[cache.index];
    const username = this.evalMessage(data.username, cache);
    if (botClient && botClient.setUsername) {
      botClient
        .setUsername(username)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
