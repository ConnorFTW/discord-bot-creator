export default {
  name: "Loop Through List",
  section: "Lists and Loops",
  fields: ["source", "list", "varName", "tempVarName", "type"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const Files = this.getDBM().Files;

    const id = data.source;
    let actions;
    const allData = Files.data.events;
    for (let i = 0; i < allData.length; i++) {
      if (allData[i] && allData[i]._id === id) {
        actions = allData[i].actions;
        break;
      }
    }
    if (!actions) {
      this.callNextAction(cache);
      return;
    }

    const storage = parseInt(data.list);
    const varName = this.evalMessage(data.varName, cache);
    const list = this.getList(storage, varName, cache);

    const act = actions[0];
    if (act && this.exists(act.name)) {
      const looper = function (i) {
        if (!list[i]) {
          if (data.type === "true") this.callNextAction(cache);
          return;
        }
        const cache2 = {
          actions: actions,
          index: 0,
          temp: cache.temp,
          server: cache.server,
          msg: cache.msg || null,
        };
        cache2.temp[data.tempVarName] = list[i];
        cache2.callback = function () {
          looper(i + 1);
        }.bind(this);
        this[act.name](cache2);
      }.bind(this);
      looper(0);
      if (data.type === "false") this.callNextAction(cache);
    } else {
      this.callNextAction(cache);
    }
  },
  mod() {},
};
