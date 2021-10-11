/* eslint-disable no-unused-vars */

export default {
  name: "Await Response Call Action",
  displayName: "Await Response",
  section: "Messaging",
  fields: [
    "storage",
    "varName",
    "filter",
    "max",
    "time",
    "iftrue",
    "iftrueVal",
    "iffalse",
    "iffalseVal",
    "storage2",
    "varName2",
  ],

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [
      data.varName2,
      parseInt(data.max, 10) === 1 ? "Message" : "Message List",
    ];
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const { Actions } = this.getDBM();

    const ch = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const channel = this.getChannel(ch, varName, cache);

    const storage = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);

    if (channel) {
      const js = String(this.evalMessage(data.filter, cache));

      const max = parseInt(this.evalMessage(data.max, cache), 10);
      const time = parseInt(this.evalMessage(data.time, cache), 10);

      channel
        .awaitMessages(
          (msg) => {
            const { msg: message, server } = cache;
            const { author, content } = msg;
            let user;
            let member;
            const tempVars = Actions.getActionVariable.bind(cache.temp);
            const globalVars = Actions.getActionVariable.bind(Actions.global);
            let serverVars = null;

            if (message) {
              user = message.author;
              member = message.member;
            }

            if (server)
              serverVars = Actions.getActionVariable.bind(
                Actions.server[server.id]
              );

            try {
              return Boolean(eval(js));
            } catch {
              return false;
            }
          },
          { max, time, errors: ["time"] }
        )
        .then((c) => {
          this.storeValue(
            c.size === 1 ? c.first() : c.array(),
            storage,
            varName2,
            cache
          );
          this.executeResults(true, data, cache);
        })
        .catch(() => this.executeResults(false, data, cache));
    }
  },
  mod() {},
};
