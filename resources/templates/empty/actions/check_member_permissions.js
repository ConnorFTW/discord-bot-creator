export default {
  name: "Check Member Permissions",

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
    "member",
    "varName",
    "permission",
    "iftrue",
    "iftrueVal",
    "iffalse",
    "iffalseVal",
  ],

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
</div><br><br><br>
<div style="padding-top: 8px; width: 80%;">
	Permission:<br>
	<select id="permission" class="round">
		${data.permissions[2]}
	</select>
</div><br>
<div>
	${data.conditions[0]}
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.memberChange(document.getElementById("member"), "varNameContainer");
    glob.onChangeTrue(document.getElementById("iftrue"));
    glob.onChangeFalse(document.getElementById("iffalse"));
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.member);
    const varName = this.evalMessage(data.varName, cache);
    const member = this.getMember(type, varName, cache);
    let result = false;
    if (member) {
      result = member.permissions.has([data.permission]);
    }
    this.executeResults(result, data, cache);
  },

  mod: function () {},
};
