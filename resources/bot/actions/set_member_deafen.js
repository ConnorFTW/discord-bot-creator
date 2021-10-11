export default {
  name: "Set Member Deafen",

  section: "Member Control",

  subtitle: function (data) {
    const channels = [
      "Mentioned User",
      "Command Author",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    return `${channels[parseInt(data.member)]} - ${
      data.deafen === "0" ? "Deafen" : "Undeafen"
    }`;
  },

  fields: ["member", "varName", "deafen", "reason"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source Member:<br>
		<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
			${data.members[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div>
<br><br><br>
<div style="padding-top: 8px;">
	Deafen Status:<br>
	<select id="deafen" class="round" style="width: 50%;">
		<option value="0" selected>Deafen</option>
		<option value="1">Undeafen</option>
	</select>
</div><br>
<div>
  Reason:
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.memberChange(document.getElementById("member"), "varNameContainer");
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.member);
    const varName = this.evalMessage(data.varName, cache);
    const member = this.getMember(type, varName, cache);
    const reason = this.evalMessage(data.reason, cache);
    if (Array.isArray(member)) {
      this.callListFunc(
        member.map((m) => m.voice),
        "setDeaf",
        [data.deafen === "0", reason]
      ).then(() => this.callNextAction(cache));
    } else if (this.dest(member.voice, "setDeaf")) {
      member.voice
        .setDeaf(data.deafen === "0", reason)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
