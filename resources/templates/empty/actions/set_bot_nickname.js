export default {
  name: "Set Bot Nickname",

  section: "Bot Client Control",

  subtitle: function (data) {
    return `${data.nickname}`;
  },

  fields: ["server", "varName", "nickname", "reason"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Server:<br>
		<select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
			${data.servers[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList">
	</div>
</div><br><br><br>
<div style="padding-top: 8px; width: 90%;">
	Nickname:<br>
	<input id="nickname" class="round" type="text">
</div><br>
<div>
  Reason:
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.serverChange(document.getElementById("server"), "varNameContainer");
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.server);
    const varName = this.evalMessage(data.varName, cache);
    const server = this.getServer(type, varName, cache);
    const nickname = this.evalMessage(data.nickname, cache);
    const reason = this.evalMessage(data.reason, cache);
    const bot = server.me;
    if (bot && bot.setNickname) {
      bot
        .setNickname(nickname, reason)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
