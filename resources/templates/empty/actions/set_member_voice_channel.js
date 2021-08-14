export default {
  name: "Set Member Voice Channel",

  section: "Member Control",

  subtitle: function (data) {
    const members = [
      "Mentioned User",
      "Command Author",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    return `${members[parseInt(data.member)]}`;
  },

  fields: ["member", "varName", "channel", "varName2", "reason"],

  html: function (isEvent, data) {
    return `
<div style="padding-top: 8px;">
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
</div><br><br><br>
<div>
	<div style="float: left; width: 35%;">
		Source Voice Channel:<br>
		<select id="channel" name="second-list" class="round" onchange="glob.channelChange(this, 'varNameContainer2')">
			${data.channels[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text" list="variableList2"><br>
	</div>
</div><br><br><br>
<div>
  Reason:
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.memberChange(document.getElementById("member"), "varNameContainer");
    glob.channelChange(document.getElementById("channel"), "varNameContainer2");
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.member);
    const varName = this.evalMessage(data.varName, cache);
    const member = this.getMember(storage, varName, cache);

    const storage2 = parseInt(data.channel);
    const varName2 = this.evalMessage(data.varName2, cache);
    const channel = this.getVoiceChannel(storage2, varName2, cache);
    const reason = this.evalMessage(data.reason, cache);

    if (Array.isArray(member)) {
      this.callListFunc(
        member.map((m) => m.voice),
        "setChannel",
        [channel, reason]
      ).then(() => this.callNextAction(cache));
    } else if (this.dest(member, "voice", "setChannel")) {
      member.voice
        .setChannel(channel, reason)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
