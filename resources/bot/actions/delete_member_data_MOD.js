export default {
  name: "Delete Member Data",
  section: "Data",
  fields: ["member", "varName", "dataName"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.member, 10);
    const varName = this.evalMessage(data.varName, cache);
    const member = this.getMember(type, varName, cache);
    const dataName = this.evalMessage(data.dataName, cache);

    member.delData(dataName);
    this.callNextAction(cache);
  },

  mod(DBM) {
    DBM.Actions["Delete Member Data MOD"] = DBM.Actions["Delete Member Data"];
    /*
    DBM.DiscordJS.Structures.extend(
      "GuildMember",
      (GuildMember) =>
        class extends GuildMember {
          constructor(client, data, guild) {
            super(client, data, guild);
          }

          delData(name) {
            const { players } = DBM.Files.data;
            if (players[this.id] && name && players[this.id][name]) {
              delete players[this.id][name];
              DBM.Files.saveData("players");
            } else if (!name) {
              delete players[this.id];
              DBM.Files.saveData("players");
            }
          }
        }
    );
    DBM.DiscordJS.Structures.extend(
      "User",
      (User) =>
        class extends User {
          delData(name) {
            const { players } = DBM.Files.data;
            if (players[this.id] && name && players[this.id][name]) {
              delete players[this.id][name];
              DBM.Files.saveData("players");
            } else if (!name) {
              delete players[this.id];
              DBM.Files.saveData("players");
            }
          }
        }
    );
    */
  },
};
