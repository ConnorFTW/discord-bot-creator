export default {
  name: "Check Variable Type",

  section: "Conditions",

  subtitle: function (data) {
    const results = [
      "Continue Actions",
      "Stop Action Sequence",
      "Jump To Action",
      "Jump Forward Actions",
    ];
    return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${
      results[parseInt(data.iffalse)]
    }`;
  },

  fields: [
    "storage",
    "varName",
    "comparison",
    "iftrue",
    "iftrueVal",
    "iffalse",
    "iffalseVal",
  ],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Variable:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList">
	</div>
</div><br><br><br>
<div style="padding-top: 8px; width: 80%;">
		Variable Type to Check:<br>
		<select id="comparison" class="round">
			<option value="0" selected>Number</option>
			<option value="1">String</option>
			<option value="2">Image</option>
			<option value="3">Member</option>
			<option value="4">Message</option>
			<option value="5">Text Channel</option>
			<option value="6">Voice Channel</option>
			<option value="7">Role</option>
			<option value="8">Server</option>
			<option value="9">Emoji</option>
		</select>
</div><br>
<div>
	${data.conditions[0]}
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.refreshVariableList(document.getElementById("storage"));
    glob.onChangeTrue(document.getElementById("iftrue"));
    glob.onChangeFalse(document.getElementById("iffalse"));
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const variable = this.getVariable(type, varName, cache);
    let result = false;
    if (variable) {
      const DiscordJS = this.getDBM().DiscordJS;
      const compare = parseInt(data.comparison);
      switch (compare) {
        case 0:
          result = typeof variable === "number";
          break;
        case 1:
          result = typeof variable === "string";
          break;
        case 2:
          result = variable instanceof this.getDBM().JIMP;
          break;
        case 3:
          result = variable instanceof DiscordJS.GuildMember;
          break;
        case 4:
          result = variable instanceof DiscordJS.Message;
          break;
        case 5:
          result =
            variable instanceof DiscordJS.TextChannel ||
            variable instanceof DiscordJS.NewsChannel ||
            variable instanceof DiscordJS.StoreChannel;
          break;
        case 6:
          result = variable instanceof DiscordJS.VoiceChannel;
          break;
        case 7:
          result = variable instanceof DiscordJS.Role;
          break;
        case 8:
          result = variable instanceof DiscordJS.Guild;
          break;
        case 9:
          result =
            variable instanceof DiscordJS.Emoji ||
            variable instanceof DiscordJS.GuildEmoji;
          break;
      }
    }
    this.executeResults(result, data, cache);
  },

  mod: function () {},
};
