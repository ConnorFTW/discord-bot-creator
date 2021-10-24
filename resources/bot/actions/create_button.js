export default {
  name: "Create Button",
  section: "Messaging",

  fields: [
    "channel",
    "varName",
    "message",
    "storage",
    "varName2",
    "iffalse",
    "iffalseVal",
  ],


  action(cache) {
    const data = cache.actions[cache.index];
    const channel = parseInt(data.channel, 10);
    const varName = this.evalMessage(data.varName, cache);
    const target = this.getSendTarget(channel, varName, cache);
    const { message } = data;

    if (!target || !message) return;

    if (Array.isArray(target)) {
      this.callListFunc(target, "send", [
        this.evalMessage(message, cache),
      ]).then((msg) => {
        const varName2 = this.evalMessage(data.varName2, cache);
        const storage = parseInt(data.storage, 10);
        this.storeValue(msg, storage, varName2, cache);
        this.callNextAction(cache);
      });
    } else if (target && target.send) {
      target
        .send(this.evalMessage(message, cache))
        .then((msg) => {
          const varName2 = this.evalMessage(data.varName2, cache);
          const storage = parseInt(data.storage, 10);
          this.storeValue(msg, storage, varName2, cache);
          this.callNextAction(cache);
        })
        .catch(() => this.executeResults(false, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },
};
