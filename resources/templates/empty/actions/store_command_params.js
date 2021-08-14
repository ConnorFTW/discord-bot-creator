export default {
  commandOnly: true,
  name: "Store Command Params",
  section: "Other Stuff",

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    const info = parseInt(data.info);
    let dataType = "None";
    switch (info) {
      case 0:
      case 1:
        dataType = "Text";
        break;
      case 2:
        dataType = "Server Member";
        break;
      case 3:
        dataType = "Role";
        break;
      case 4:
        dataType = "Channel";
        break;
    }
    return [data.varName, dataType];
  },

  fields: ["info", "infoIndex", "storage", "varName"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const msg = cache.msg;
    const infoType = parseInt(data.info);
    const index = parseInt(this.evalMessage(data.infoIndex, cache));
    const separator = this.getDBM().Files.data.settings.separator || "\\s+";
    let source;
    switch (infoType) {
      case 0:
        if (msg && msg.content) {
          const params = msg.content.split(new RegExp(separator));
          source = params[index] || "";
        }
        break;
      case 1:
        if (msg && msg.content) {
          const params = msg.content.split(new RegExp(separator));
          source = "";
          for (let i = 0; i < index; i++) {
            source += params[i] + " ";
          }
          const location = msg.content.indexOf(source);
          if (location === 0) {
            source = msg.content.substring(source.length);
          }
        }
        break;
      case 2:
        if (this.dest(msg, "mentions", "members")) {
          const members = msg.mentions.members.array();
          if (members[index - 1]) {
            source = members[index - 1];
          }
        }
        break;
      case 3:
        if (this.dest(msg, "mentions", "roles")) {
          const roles = msg.mentions.roles.array();
          if (roles[index - 1]) {
            source = roles[index - 1];
          }
        }
        break;
      case 4:
        if (this.dest(msg, "mentions", "channels")) {
          const channels = msg.mentions.channels.array();
          if (channels[index - 1]) {
            source = channels[index - 1];
          }
        }
        break;
      default:
        break;
    }
    if (source) {
      const storage = parseInt(data.storage);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(source, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod: function () {},
};
