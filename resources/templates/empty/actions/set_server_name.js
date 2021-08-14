export default {
  name: "Set Server Name",

  section: "Server Control",

  subtitle: function (data) {
    return `${data.serverName}`;
  },

  fields: ["server", "varName", "serverName", "reason"],

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
	Server Name:<br>
	<input id="serverName" class="round" type="text">
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
    const name = this.evalMessage(data.serverName, cache);
    const reason = this.evalMessage(data.reason, cache);
    if (Array.isArray(server)) {
      this.callListFunc(server, "setName", [name, reason]).then(() =>
        this.callNextAction(cache)
      );
    } else if (server && server.setName) {
      server
        .setName(name, reason)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
