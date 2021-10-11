export default {
  name: "Set Bot Status",

  section: "Bot Client Control",

  fields: ["status"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const botClient = this.getDBM().Bot.bot.user;
    const data = cache.actions[cache.index];
    const status = parseInt(data.status);
    let targetStatus = "";
    if (status >= 0) {
      switch (status) {
        case 0:
          targetStatus = "online";
          break;
        case 1:
          targetStatus = "idle";
          break;
        case 2:
          targetStatus = "invisible";
          break;
        case 3:
          targetStatus = "dnd";
          break;
      }
    }
    if (botClient && botClient.setStatus) {
      botClient.setPresence({ status: targetStatus });
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
