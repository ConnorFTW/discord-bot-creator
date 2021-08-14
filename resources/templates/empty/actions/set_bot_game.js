export default {
  name: "Set Bot Game",
  section: "Bot Client Control",
  fields: ["gameName", "gameLink"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const botClient = this.getDBM().Bot.bot.user;
    const data = cache.actions[cache.index];
    const game = this.evalMessage(data.gameName, cache);
    const link = this.evalMessage(data.gameLink, cache);
    if (botClient && botClient.setPresence) {
      if (link) {
        botClient.setPresence({
          activity: { name: game, type: "STREAMING", url: link },
        });
      } else {
        botClient.setPresence({ activity: { name: game, type: "PLAYING" } });
      }
    } else {
      this.callNextAction(cache);
    }
  },

  mod() {},
};
