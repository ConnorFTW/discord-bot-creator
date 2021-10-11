export default {
  name: "Get Item from List",

  section: "Lists and Loops",

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    const list = parseInt(data.list);
    let dataType = "Unknown Type";
    switch (list) {
      case 0:
        dataType = "Server Member";
        break;
      case 1:
        dataType = "Channel";
        break;
      case 2:
      case 5:
      case 6:
        dataType = "Role";
        break;
      case 3:
        dataType = "Emoji";
        break;
      case 4:
        dataType = "Server";
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ["list", "varName", "getType", "position", "storage", "varName2"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.list);
    const varName = this.evalMessage(data.varName, cache);
    const list = this.getList(storage, varName, cache);

    const type = parseInt(data.getType);
    let result;
    switch (type) {
      case 0:
        result = list[0];
        break;
      case 1:
        result = list[list.length - 1];
        break;
      case 2:
        result = list[Math.floor(Math.random() * list.length)];
        break;
      case 3:
        const position = parseInt(this.evalMessage(data.position, cache));
        if (position < 0) {
          result = list[0];
        } else if (position >= list.length) {
          result = list[list.length - 1];
        } else {
          result = list[position];
        }
        break;
    }

    if (result) {
      const varName2 = this.evalMessage(data.varName2, cache);
      const storage2 = parseInt(data.storage);
      this.storeValue(result, storage2, varName2, cache);
    }

    this.callNextAction(cache);
  },

  mod: function () {},
};
