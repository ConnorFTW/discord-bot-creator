/* eslint-disable no-undef, no-unused-vars */
export default {
  name: "Delete Global Data",
  section: "Data",

  fields: ["dataName"],

  html() {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 80%;">
    Data Name:<br>
    <input id="dataName" class="round" placeholder="Leave it blank to delete all data" type="text">
  </div>
</div>`;
  },

  init() {},

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const dataName = this.evalMessage(data.dataName, cache);
    const { Globals } = this.getDBM();
    Globals.delData(dataName);
    this.callNextAction(cache);
  },

  async mod(DBM) {
    const fs = (await import("fs")).default;
    const path = (await import("path")).default;
    const filePath = path.join(process.cwd(), "data", "globals.json");
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "{}");
    }
    DBM.Files.data.globals = JSON.parse(fs.readFileSync(filePath));
    class GlobalData {
      delData(name) {
        if (name && DBM.Files.data.globals[name]) {
          delete DBM.Files.data.globals[name];
          DBM.Files.saveData("globals");
        } else if (!name) {
          DBM.Files.data.globals = {};
          DBM.Files.saveData("globals");
        }
      }

      data(name, defaultValue) {
        if (DBM.Files.data.globals[name] || defaultValue !== undefined) {
          const data = DBM.Files.data.globals[name]
            ? DBM.Files.data.globals[name]
            : defaultValue;
          return data;
        }
        return null;
      }

      setData(name, value) {
        if (value !== undefined) {
          DBM.Files.data.globals[name] = value;
          DBM.Files.saveData("globals");
        }
      }

      addData(name, value) {
        const data = DBM.Files.data.globals;
        if (data[name] === undefined) {
          this.setData(name, value);
        } else {
          this.setData(name, this.data(name) + value);
        }
      }
    }

    DBM.Globals = new GlobalData();
  },
};
