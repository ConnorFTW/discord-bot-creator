export default {
  name: "Store Shard Info",
  section: "Bot Client Control",
  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, "Number"];
  },

  fields: ["info", "storage", "varName2"],
  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    /** @type {import("discord.js").Client} */
    const client = this.getDBM().Bot.bot;
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);

    client.shard.fetchClientValues("guilds.cache.size").then((r) => {
      const shardGuildCount = r.reduce((p, c) => p + c, 0);

      client.shard
        .broadcastEval((client) => {
          client.guilds.cache.reduce((p, g) => p + g.memberCount, 0);
        })
        .then((r) => {
          const shardMemberCount = r.reduce((p, c) => p + c, 0);

          const shardIDs = client.shard.ids;
          const shardID = Number(shardIDs) + 1;

          if (!client) return this.callNextAction(cache);

          let result;
          switch (info) {
            case 0: // Total Count of Servers in All Shards
              result = shardGuildCount;
              break;
            case 1: // Total Count of Members in All Shards
              result = shardMemberCount;
              break;
            case 2: // Shard's Ping On The Current Server
              result = client.shard.client.ws.ping;
              break;
            case 3: // Shard's ID On The Current Server
              result = shardID;
              break;
            case 4: // Total Count of Servers in Current Server's Shard
              result = client.guilds.cache.size;
              break;
            case 5: // Total Count of Members in Current Server's Shard
              result = client.guilds.cache.values()[0].memberCount;
              break;
            case 6: // Total Server's List On The Current Server's Shard
              result = client.shard.client.guilds.cache.values();
              break;
            default:
              break;
          }

          if (result !== undefined) {
            const storage = parseInt(data.storage, 10);
            const varName2 = this.evalMessage(data.varName2, cache);
            this.storeValue(result, storage, varName2, cache);
          }
          this.callNextAction(cache);
        });
    });
  },

  mod() {},
};
