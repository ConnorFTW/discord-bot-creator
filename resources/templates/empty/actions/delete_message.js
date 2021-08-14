export default {
  name: "Delete Message",

  section: "Messaging",

  fields: ["storage", "varName", "reason"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const message = this.getMessage(storage, varName, cache);
    const reason = this.evalMessage(data.reason, cache);
    if (Array.isArray(message)) {
      this.callListFunc(message, "delete", [{ reason }]).then(() =>
        this.callNextAction(cache)
      );
    } else if (message && message.delete) {
      if (reason)
        console.info("Discord doesn't accept message-delete-reasons anymore");
      message
        .delete()
        .then(() => this.callNextAction(cache))
        .catch((err) => {
          this.displayError(data, cache, err.message);
        });
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
