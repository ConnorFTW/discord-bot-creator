export default {
  name: "Store Server Info",

  section: "Server Control",

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    const info = parseInt(data.info);
    let dataType = "Unknown Type";
    switch (info) {
      case 0:
        dataType = "Server";
        break;
      case 1:
        dataType = "Server ID";
        break;
      case 2:
      case 3:
      case 4:
        dataType = "Text";
        break;
      case 5:
        dataType = "Icon URL";
        break;
      case 6:
        dataType = "Text";
        break;
      case 7:
      case 8:
      case 9:
        dataType = "Channel";
        break;
      case 10:
        dataType = "Role";
        break;
      case 11:
        dataType = "Server Member";
        break;
      case 12:
        dataType = "Server Member";
        break;
      case 13:
        dataType = "Channels List";
        break;
      case 14:
        dataType = "Roles List";
        break;
      case 15:
        dataType = "Members List";
        break;
      case 16:
        dataType = "Emojis List";
        break;
      case 17:
        dataType = "Number";
        break;
      case 18:
        dataType = "Date";
        break;
      case 19:
        dataType = "Number";
        break;
      case 20:
      case 21:
        dataType = "Boolean";
        break;
      case 22:
        dataType = "Date";
        break;
      case 23:
      case 24:
        dataType = "Number";
        break;
      case 25:
        dataType = "Boolean";
        break;
      case 26:
      case 27:
      case 28:
      case 29:
      case 30:
        dataType = "Number";
        break;
      case 31:
      case 32:
      case 33:
        dataType = "IDs List";
        break;
      case 35:
        dataType = "Number";
        break;
      case 37:
      case 38:
      case 39:
        dataType = "Number";
        break;
      case 40:
        dataType = "Boolean";
        break;
      case 41:
        dataType = "Bans List";
        break;
      case 42:
        dataType = "Invites List";
        break;
      case 43:
        dataType = "Text";
        break;
      case 44:
      case 45:
        dataType = "Number";
        break;
      case 46:
        dataType = "Banner URL";
        break;
      case 47:
        dataType = "Server Features List";
        break;
      case 48:
      case 49:
        dataType = "Text";
        break;
      case 50:
        dataType = "Channel ID";
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ["server", "varName", "info", "storage", "varName2"],

  action: async function (cache) {
    const data = cache.actions[cache.index];
    const server = parseInt(data.server);
    const varName = this.evalMessage(data.varName, cache);
    const info = parseInt(data.info);
    /** @type {Guild} */
    const targetServer = this.getServer(server, varName, cache);
    if (!targetServer) {
      this.callNextAction(cache);
      return;
    }
    const fetchMembers = async () =>
      targetServer.memberCount !== targetServer.members.cache.size
        ? await targetServer.members.fetch()
        : null;
    let result;
    switch (info) {
      case 0:
        result = targetServer;
        break;
      case 1:
        result = targetServer.id;
        break;
      case 2:
        result = targetServer.name;
        break;
      case 3:
        result = targetServer.nameAcronym;
        break;
      case 4:
        result = targetServer.region;
        break;
      case 5:
        result = targetServer.iconURL({
          dynamic: true,
          format: "png",
          size: 4096,
        });
        break;
      case 6:
        result = targetServer.verificationLevel;
        break;
      case 7:
        result = targetServer.getDefaultChannel();
        break;
      case 8:
        result = targetServer.afkChannel;
        break;
      case 9:
        result = targetServer.systemChannel;
        break;
      case 10:
        result = targetServer.roles.cache.get(targetServer.id);
        break;
      case 11:
        result = targetServer.owner;
        break;
      case 12:
        result = targetServer.me;
        break;
      case 13:
        result = targetServer.channels.cache.values();
        break;
      case 14:
        result = targetServer.roles.cache.values();
        break;
      case 15:
        result = targetServer.members.cache.values();
        break;
      case 16:
        result = targetServer.emojis.cache.values();
        break;
      case 17:
        result = targetServer.memberCount;
        break;
      case 18:
        result = targetServer.createdAt;
        break;
      case 19: // check below
        result = targetServer.afkTimeout;
        break;
      case 20:
        result = targetServer.available;
        break;
      case 21:
        result = targetServer.large;
        break;
      case 22:
        result = targetServer.joinedAt;
        break;
      case 23:
        result = targetServer.channels.cache.size;
        break;
      case 24:
        result = targetServer.emojis.cache.size;
        break;
      case 25:
        result = targetServer.embedEnabled;
        break;
      case 26:
        await fetchMembers();
        result = targetServer.members.cache.filter(
          (m) => this.dest(m.user, "presence", "status") === "dnd"
        ).size;
        break;
      case 27:
        await fetchMembers();
        result = targetServer.members.cache.filter(
          (m) => this.dest(m.user, "presence", "status") === "online"
        ).size;
        break;
      case 28:
        await fetchMembers();
        result = targetServer.members.cache.filter(
          (m) => this.dest(m.user, "presence", "status") === "offline"
        ).size;
        break;
      case 29:
        await fetchMembers();
        result = targetServer.members.cache.filter(
          (m) => this.dest(m.user, "presence", "status") === "idle"
        ).size;
        break;
      case 30:
        result = targetServer.members.cache.filter((m) => m.user.bot).size;
        break;
      case 31:
        result = targetServer.channels.cache.map((c) => c.id);
        break;
      case 32:
        result = targetServer.roles.cache.map((r) => r.id);
        break;
      case 33:
        await fetchMembers();
        result = targetServer.members.cache.map((m) => m.id);
        break;
      case 35:
        await fetchMembers();
        result = targetServer.members.cache.filter((m) => !m.user.bot).size;
        break;
      case 37:
        result = targetServer.roles.cache.size;
        break;
      case 38:
        result = targetServer.channels.cache.filter(
          (c) => c.type !== "voice" && c.type !== "category"
        ).size;
        break;
      case 39:
        result = targetServer.channels.cache.filter(
          (c) => c.type === "voice"
        ).size;
        break;
      case 40:
        result = targetServer.verified;
        break;
      case 41:
        const bans = await targetServer.bans.fetch();
        result = bans.array();
        break;
      case 42:
        const invites = await targetServer.invites.fetch();
        result = invites.array();
        break;
      case 43:
        result = targetServer.explicitContentFilter;
        break;
      case 44:
        result = targetServer.premiumSubscriptionCount || 0;
        break;
      case 45:
        result = targetServer.premiumTier;
        break;
      case 46:
        result = targetServer.bannerURL();
        break;
      case 47:
        result = targetServer.features;
        break;
      case 48:
        result = targetServer.ownerID;
        break;
      case 49:
        result = targetServer.vanityURLCode;
        break;
      case 50:
        result = targetServer.widgetChannelID;
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

  mod: function () {},
};
