export default {
  name: "Add Item to List",
  section: "Lists and Loops",
  fields: ["storage", "varName", "addType", "position", "value"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const list = this.getVariable(storage, varName, cache);

    const type = parseInt(data.addType);
    let val = this.evalMessage(data.value, cache);
    try {
      val = this.eval(val, cache);
    } catch (e) {
      this.displayError(data, cache, e);
    }

    switch (type) {
      case 0:
        list.push(val);
        break;
      case 1:
        list.unshift(val);
        break;
      case 2:
        const position = parseInt(this.evalMessage(data.position));
        if (position < 0) {
          list.unshift(val);
        } else if (position >= list.length) {
          list.push(val);
        } else {
          list.splice(position, 0, val);
        }
        break;
    }

    this.callNextAction(cache);
  },
};
