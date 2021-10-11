export default {
  name: "Add Embed Field",
  section: "Embed Message",

  fields: ["storage", "varName", "fieldName", "message", "inline"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const embed = this.getVariable(storage, varName, cache);
    const name = this.evalMessage(data.fieldName, cache);
    const message = this.evalMessage(data.message, cache);

    const inline = Boolean(data.inline === "0");
    if (embed && embed.addField) {
      embed.addField(name || "\u200B", message || "\u200B", inline);
    }
    this.callNextAction(cache);
  },
};
