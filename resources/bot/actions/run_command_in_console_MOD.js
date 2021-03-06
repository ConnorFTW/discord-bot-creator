export default {
  name: "Run Command in Console",
  section: "Other Stuff",

  fields: ["storage", "varName", "messageToSend"],

  html(isEvent, data) {
    return `
<div>
  <p>
    Run a command in your console.<strong> THIS IS VERY DANGEROUS. SET THIS TO "BOT OWNER ONLY"</strong><br><br>
  </p>
</div>
Command to run:
<input id="messageToSend" class="round" type="text"><br>
Store result in:<br>
<select class="round" id="storage">
  ${data.variables[0]}
</select><br>
Variable name:<br>
<input class="round" id="varName" />`;
  },

  init() {},

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const messageToSend = this.evalMessage(data.messageToSend, cache);
    const response = require("child_process")
      .execSync(messageToSend)
      .toString();
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    if (response) this.storeValue(response, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
