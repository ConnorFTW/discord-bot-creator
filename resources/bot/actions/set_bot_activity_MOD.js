export default {
  name: "Set Bot Activity",
  section: "Bot Client Control",
  fields: ["activity", "nameText", "url", "stat"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    /** @type {Client} */
    const botClient = this.getDBM().Bot.bot;
    const data = cache.actions[cache.index];

    const nameText = this.evalMessage(data.nameText, cache) || null;
    const url = this.evalMessage(data.url, cache);

    const target = [
      "PLAYING",
      "LISTENING",
      "WATCHING",
      "STREAMING",
      "COMPETING",
    ][parseInt(data.activity, 10)];
    const statusTarget = ["online", "idle", "invisible", "dnd"][
      parseInt(data.stat, 10)
    ];

    const obj = {
      activities: [
        {
          name: nameText,
          type: target,
        },
      ],
      status: statusTarget,
    };
    if (target === "STREAMING") Object.assign(obj.activity, { url });
    botClient.setPresence(obj);
    this.callNextAction(cache);
  },

  mod() {},
};
