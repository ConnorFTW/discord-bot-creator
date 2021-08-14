export default {
  name: "Wait",
  section: "Other Stuff",
  fields: ["time", "measurement"],
  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const time = parseInt(this.evalMessage(data.time, cache));
    const type = parseInt(data.measurement);
    switch (type) {
      case 0:
        setTimeout(this.callNextAction.bind(this, cache), time);
        break;
      case 1:
        setTimeout(this.callNextAction.bind(this, cache), time * 1000);
        break;
      case 2:
        setTimeout(this.callNextAction.bind(this, cache), time * 1000 * 60);
        break;
      case 3:
        setTimeout(
          this.callNextAction.bind(this, cache),
          time * 1000 * 60 * 60
        );
        break;
      default:
        this.callNextAction(cache);
    }
  },
  mod() {},
};
