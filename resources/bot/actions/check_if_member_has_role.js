export default {
  name: "Check If Member has Role",

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
    "role",
    "varName2",
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
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Source Role:<br>
		<select id="role" class="round" name="second-list" onchange="glob.roleChange(this, 'varNameContainer2')">
			${data.roles[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text" list="variableList2"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	${data.conditions[0]}
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.memberChange(document.getElementById("member"), "varNameContainer");
    glob.roleChange(document.getElementById("role"), "varNameContainer2");
    glob.onChangeTrue(document.getElementById("iftrue"));
    glob.onChangeFalse(document.getElementById("iffalse"));
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];

    const type = parseInt(data.member);
    const varName = this.evalMessage(data.varName, cache);
    const member = this.getMember(type, varName, cache);

    const type2 = parseInt(data.role);
    const varName2 = this.evalMessage(data.varName2, cache);
    const role = this.getRole(type2, varName2, cache);

    let result = false;
    if (role) {
      if (Array.isArray(member)) {
        result = member.every(function (mem) {
          return this.dest(mem, "roles", "cache") ? mem.roles.cache.has(role.id) : false;
        });
      } else if (this.dest(member, "roles", "cache")) {
        result = member.roles.cache.has(role.id);
      }
    }
    this.executeResults(result, data, cache);
  },

  mod: function () {},
};
