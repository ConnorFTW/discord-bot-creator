module.exports = {
  name: "Change Server",

  section: "Server Control",

  subtitle(data) {
    const servers = [
      "Current Server",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    return `${servers[parseInt(data.server)]}`;
  },

  fields: ["server", "varName"],

  html(isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Change Server To:<br>
		<select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
			${data.servers[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList">
	</div>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.serverChange(document.getElementById("server"), "varNameContainer");
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.server);
    const varName = this.evalMessage(data.varName, cache);
    const server = this.getServer(type, varName, cache);
    if (server) {
      cache.server = server;
    }
    this.callNextAction(cache);
  },

  mod() {},
};
