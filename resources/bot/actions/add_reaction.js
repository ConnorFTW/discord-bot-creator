export default {
  name: "Add Reaction",
  section: "Messaging",
  fields: ["storage", "varName", "emoji", "varName2", "varName3"],

  /** @this {import("../utils/Actions.js").default} */
  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const message = this.getMessage(storage, varName, cache);

    const type = parseInt(data.emoji);
    let emoji;
    if (type === 4) {
      emoji = this.evalMessage(data.varName2, cache);
    } else if (type === 0) {
      if (message?.guild) {
        const emojis = await message.guild.emojis.fetch();
        console.log(emojis.map((e) => e.name));
        emoji = emojis.find(
          (e) => e.name === this.evalMessage(data.varNam2, cache)
        );
      } else {
        emoji = this.getDBM().Bot.bot.emojis.cache.find(
          (e) => e.name === this.evalMessage(data.varName2, cache)
        );
      }
    } else {
      emoji = this.getVariable(
        type,
        this.evalMessage(data.varName3, cache),
        cache
      );
    }

    if (Array.isArray(message)) {
      this.callListFunc(message, "react", [emoji]).then(() =>
        this.callNextAction(cache)
      );
    } else if (emoji && message && message.react) {
      message
        .react(emoji)
        .then(() => this.callNextAction(cache))
        .catch((err) => {
          this.displayError(data, cache, err.message);
        });
    } else {
      this.callNextAction(cache);
    }
  },
};
