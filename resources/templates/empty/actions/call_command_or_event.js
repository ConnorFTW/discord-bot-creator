/* eslint-disable no-unused-vars */
export default {
  name: "Call Command/Event",
  section: "Other Stuff",
  fields: ["sourcetype", "source", "source2", "type"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const { Files } = this.getDBM();

    let id;
    id = parseInt(data.sourcetype, 10) === 1 ? this.evalMessage(data.source2, cache) : data.source;
    if (!id) return console.log("Please insert a Command/Event ID!");

    let actions;
    const allData = Files.data.commands.concat(Files.data.events);
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

    const act = actions[0];
    if (act && this.exists(act.name)) {
      const cache2 = {
        actions,
        index: 0,
        temp: cache.temp,
        server: cache.server,
        msg: cache.msg || null,
      };
      if (data.type === "true") {
        cache2.callback = function callback() {
          this.callNextAction(cache);
        }.bind(this);
        this[act.name](cache2);
      } else {
        this[act.name](cache2);
        this.callNextAction(cache);
      }
    } else {
      this.callNextAction(cache);
    }
  },
};
