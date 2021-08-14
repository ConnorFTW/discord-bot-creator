export default {
  name: "Create Image from Avatar",

  section: "Image Editing",

  subtitle: function (data) {
    const channels = [
      "Mentioned User",
      "Command Author",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    return `${channels[parseInt(data.member)]}`;
  },

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName2, "Image"];
  },

  fields: ["member", "varName", "storage", "varName2"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Avatar Source:<br>
		<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
			${data.members[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
	</div>
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
    const Images = this.getDBM().Images;
    Images.getImage(member.user.displayAvatarURL({ format: "png" }))
      .then(
        function (image) {
          const varName2 = this.evalMessage(data.varName2, cache);
          const storage = parseInt(data.storage);
          this.storeValue(image, storage, varName2, cache);
          this.callNextAction(cache);
        }.bind(this)
      )
      .catch(this.displayError.bind(this, data, cache));
  },

  mod: function () {},
};
