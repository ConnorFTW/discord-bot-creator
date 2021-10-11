export default {
  name: "Store Member Info",
  section: "Member Control",

  variableStorage(data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    const info = parseInt(data.info);
    let dataType = "Unknown Type";
    switch (info) {
      case 0:
        dataType = "Server Member";
        break;
      case 1:
        dataType = "Server Member ID";
        break;
      case 2:
      case 3:
        dataType = "Text";
        break;
      case 4:
        dataType = "Color";
        break;
      case 5:
        dataType = "Server";
        break;
      case 6:
        dataType = "Message";
        break;
      case 7:
      case 8:
      case 9:
        dataType = "Role";
        break;
      case 10:
      case 11:
      case 12:
      case 13:
        dataType = "Boolean";
        break;
      case 14:
      case 15:
        dataType = "Text";
        break;
      case 16:
        dataType = "Image URL";
        break;
      case 17:
        dataType = "List of Roles";
        break;
      case 18:
        dataType = "Number";
        break;
      case 19:
        dataType = "Voice Channel";
        break;
      case 20:
        dataType = "Member Discriminator";
        break;
      case 21:
        dataType = "Member Tag";
        break;
      case 22:
        dataType = "Date";
        break;
      case 23:
        dataType = "Timestamp";
        break;
      case 24:
        dataType = "Date";
        break;
      case 25:
        dataType = "Timestamp";
        break;
      case 26:
        dataType = "Message ID";
        break;
      case 27:
      case 28:
      case 29:
        dataType = "List";
        break;
      case 30:
        dataType = "Text";
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ["member", "varName", "info", "storage", "varName2"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const member = parseInt(data.member);
    const varName = this.evalMessage(data.varName, cache);
    const info = parseInt(data.info);
    const mem = this.getMember(member, varName, cache);
    if (!mem) {
      this.callNextAction(cache);
      return;
    }
    let result;
    switch (info) {
      case 0:
        result = mem;
        break;
      case 1:
        result = mem.id;
        break;
      case 2:
        if (mem.user) {
          result = mem.user.username;
        }
        break;
      case 3:
        result = mem.displayName;
        break;
      case 4:
        result = mem.displayHexColor;
        break;
      case 5:
        result = mem.guild;
        break;
      case 6:
        console.log("Last lastMessage is deprecated");
        result = mem.lastMessage;
        break;
      case 7:
        result = this.dest(mem.roles, "highest");
        break;
      case 8:
        result = this.dest(mem.roles, "hoist");
        break;
      case 9:
        result = this.dest(mem.roles, "color");
        break;
      case 10:
        if (this.dest(mem.guild, "ownerID")) {
          result = mem.id === mem.guild.ownerID;
        }
        break;
      case 11:
        result = this.dest(mem.voice, "mute");
        break;
      case 12:
        result = this.dest(mem.voice, "deaf");
        break;
      case 13:
        result = mem.bannable;
        break;
      case 14:
        if (this.dest(mem.presence, "activities")) {
          const status = mem.presence.activities.filter(
            (s) => s.type !== "CUSTOM_STATUS"
          );
          result = status && this.dest(status[0], "name");
        }
        break;
      case 15:
        if (this.dest(mem.presence, "status")) {
          const status = mem.presence.status;
          if (status === "online") result = "Online";
          else if (status === "offline") result = "Offline";
          else if (status === "idle") result = "Idle";
          else if (status === "dnd") result = "Do Not Disturb";
        }
        break;
      case 16:
        if (mem.user) {
          result = mem.user.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: 4096,
          });
        }
        break;
      case 17:
        if (this.dest(mem.roles, "cache")) {
          result = mem.roles.cache.values();
        }
        break;
      case 18:
        result = this.dest(mem.roles, "cache", "size");
        break;
      case 19:
        result = this.dest(mem.voice, "channel");
        break;
      case 20:
        result = this.dest(mem.user, "discriminator");
        break;
      case 21:
        result = this.dest(mem.user, "tag");
        break;
      case 22:
        result = this.dest(mem.user, "createdAt");
        break;
      case 23:
        result = this.dest(mem.user, "createdTimestamp");
        break;
      case 24:
        result = mem.joinedAt;
        break;
      case 25:
        result = mem.joinedTimestamp;
        break;
      case 26:
        console.log("Last lastMessageID is deprecated");
        result = mem.lastMessageID;
        break;
      case 27:
        result = mem.permissions && mem.permissions.toArray();
        break;
      case 28:
        const flags = this.dest(mem.user, "flags");
        result = flags && flags.toArray();
        break;
      case 29:
        const status = this.dest(mem.presence, "clientStatus");
        result = status && Object.keys(status);
        break;
      case 30:
        if (this.dest(mem.presence, "activities")) {
          const status = mem.presence.activities.filter(
            (s) => this.dest(s, "type") === "CUSTOM_STATUS"
          );
          result = status && this.dest(status[0], "state");
        }
        break;
      default:
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
