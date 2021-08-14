export default {
  name: "Set Channel Permissions",
  section: "Permission Control",

  fields: [
    "target",
    "way",
    "storage",
    "varName3",
    "role",
    "varName",
    "member",
    "varName2",
    "storage3",
    "varName4",
    "iftrue",
    "iftrueVal",
    "iffalse",
    "iffalseVal",
  ],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const way = parseInt(data.way, 10);

    const type = parseInt(data.target, 10);
    let target;
    if (type === 0) {
      const role = parseInt(data.role, 10);
      const varName = this.evalMessage(data.varName, cache);
      target = this.getRole(role, varName, cache);
    } else {
      const member = parseInt(data.member, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      target = this.getMember(member, varName2, cache);
    }

    const storage = parseInt(data.storage, 10);
    const varName3 = this.evalMessage(data.varName3, cache);
    const targetChannel = this.getChannel(storage, varName3, cache);

    const storage3 = parseInt(data.storage3, 10);
    const varName4 = this.evalMessage(data.varName4, cache);
    let permissions = this.getVariable(storage3, varName4, cache);

    const perms = {};
    if (permissions.bitfield) {
      const temp = permissions;
      permissions = { allow: temp };
    }
    if (permissions.allow) {
      permissions.allow.toArray().forEach((perm) => {
        perms[perm] = true;
      });
    }
    if (permissions.disallow) {
      permissions.disallow.toArray().forEach((perm) => {
        perms[perm] = false;
      });
    }
    if (permissions.inherit) {
      permissions.inherit.forEach((perm) => {
        perms[perm] = null;
      });
    }

    if (way === 0) {
      targetChannel.permissionOverwrites
        .edit(target, perms)
        .then(() => {
          this.executeResults(true, data, cache);
        })
        .catch((error) => {
          console.error(error);
          this.executeResults(false, data, cache);
        });
    } else {
      targetChannel.permissionOverwrites
        .create(target, perms)
        .then(() => {
          this.executeResults(true, data, cache);
        })
        .catch((error) => {
          console.error(error);
          this.executeResults(false, data, cache);
        });
    }
  },

  mod() {},
};
