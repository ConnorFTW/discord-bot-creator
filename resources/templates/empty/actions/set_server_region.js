export default {
  name: "Set Server Region",

  section: "Server Control",

  subtitle: function (data) {
    return `${data.region}`;
  },

  fields: ["server", "varName", "region", "reason"],

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
	Server Region:<br>
	<select id="region" class="round">
		<option value="brazil">Brazil</option>
		<option value="us-west">US West</option>
		<option value="singapore">Singapore</option>
		<option value="eu-central">EU Central</option>
		<option value="hongkong">HongKong</option>
		<option value="us-south">US South</option>
		<option value="us-central">US Central</option>
		<option value="london">London</option>
		<option value="us-east">US East</option>
		<option value="sydney">Sydney</option>
		<option value="amsterdam">Amsterdam</option>
		<option value="eu-west">EU West</option>
		<option value="frankfurt">Frankfurt</option>
		<option value="russia">Russia</option>
	</select>
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
    const reason = this.evalMessage(data.reason, cache);
    if (Array.isArray(server)) {
      this.callListFunc(server, "setRegion", [data.region, reason]).then(() =>
        this.callNextAction(cache)
      );
    } else if (server && server.setRegion) {
      server
        .setRegion(data.region, reason)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
