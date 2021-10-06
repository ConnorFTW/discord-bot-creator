import _eval from "eval";
import fg from "fast-glob";
import fs from "fs";
import path from "path";

export default class Loader {
  constructor({ filePath }) {
    this.filePath = filePath;
    this.actions = {};
  }
  getSettings() {
    return fs.readFileSync(
      path.resolve(this.filePath, "./data/settings.json"),
      "utf8"
    );
  }
  saveSettings(settings) {
    if (!Object.keys(settings).length) return;

    fs.writeFileSync(
      path.resolve(this.filePath, "./data/settings.json"),
      JSON.stringify(settings, null, 2)
    );
  }
  async getLocalActions() {
    console.log(path.join(__dirname, "../resources/actions/*.js"));
    const directory = path
      .join(__dirname, "../resources/actions/*.js")
      .replace(/\\/g, "/");
    const files = await fg(directory);
    console.log(files);
    // Remove strange dev file
    files.unshift();
    const actions = files
      .map((file) => _eval(fs.readFileSync(file, "utf-8")))
      .map((content) => {
        return {
          name: content.name + "",
          section: content.section + "",
          html: content.html + "",
          mod: content.mod + "",
          getMods: content.getMods + "",
          subtitle: content.subtitle + "",
          fields: content.fields,
          init: content.init + "",
          displayName: content.displayName + "",
          variableStorage: content.variableStorage + "",
          requiresAudioLibraries: content.requiresAudioLibraries + "",
          version: content.version + "",
          commandOnly: content.commandOnly + "",
        };
      });

    return actions;
  }
  async getCommands() {
    const commands = fs.readFileSync(
      path.resolve(this.filePath, "./data/commands.json"),
      "utf8"
    );
    return commands;
  }
  async saveCommands(commands) {
    if (!Object.keys(commands).length) return;
    commands = commands.map((command) => {
      for (const action of command.actions || []) {
        delete action.members;
        delete action.conditions;
        delete action.sendTargets;
        delete action.variables;
        delete action.messages;
        delete action.servers;
      }
      return command;
    });

    fs.writeFileSync(
      path.resolve(this.filePath, "./data/commands.json"),
      JSON.stringify(commands, null, 2)
    );
  }
  async getEvents() {
    return fs.readFileSync(
      path.resolve(this.filePath, "./data/events.json"),
      "utf8"
    );
  }

  async saveEvents(events) {
    if (!Object.keys(events).length) return;
    events = events.map((event) => {
      for (const action of event.actions || []) {
        delete action.members;
        delete action.conditions;
        delete action.sendTargets;
        delete action.variables;
        delete action.messages;
        delete action.servers;
      }
      return event;
    });
    fs.writeFileSync(
      path.resolve(this.filePath, "./data/events.json"),
      JSON.stringify(events, null, 2)
    );
  }
}
