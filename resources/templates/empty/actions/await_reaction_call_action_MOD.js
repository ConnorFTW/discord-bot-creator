/* eslint-disable no-unused-vars */

export default {
  name: "Await Reaction Call Action",
  displayName: "Await Reaction",
  section: "Messaging",

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [
      data.varName2,
      `Reaction${parseInt(data.max, 10) === 1 ? "" : " List"}`,
    ];
  },

  fields: [
    "storage",
    "varName",
    "filter",
    "max",
    "time",
    "maxEmojis",
    "maxUsers",
    "iftrue",
    "iftrueVal",
    "iffalse",
    "iffalseVal",
    "storage2",
    "varName2",
  ],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const { Actions } = this.getDBM();

    const messageVariable = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const msg = this.getMessage(messageVariable, varName, cache);

    const storage = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);

    if (msg) {
      const js = String(this.evalMessage(data.filter, cache));

      const max = parseInt(this.evalMessage(data.max, cache), 10);
      const maxEmojis = parseInt(this.evalMessage(data.maxEmojis, cache), 10);
      const maxUsers = parseInt(this.evalMessage(data.maxUsers, cache), 10);
      const time = parseInt(this.evalMessage(data.time, cache), 10);

      msg
        .awaitReactions(
          (reaction, user) => {
            const { msg: message, server } = cache;
            let member;
            let author;
            const tempVars = Actions.getActionVariable.bind(cache.temp);
            const globalVars = Actions.getActionVariable.bind(Actions.global);
            let serverVars = null;

            if (message) {
              member = message.member;
              author = message.author;
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
          {
            max,
            maxEmojis,
            maxUsers,
            time,
            errors: ["time"],
          }
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
