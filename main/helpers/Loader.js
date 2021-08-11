import fs from "fs";
import fg from "fast-glob";
import path from "path";
import _eval from "eval";

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
    const files = await fg("./resources/actions/*.js");
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
    return fs.readFileSync(
      path.resolve(this.filePath, "./data/commands.json"),
      "utf8"
    );
  }
  async saveCommands(commands) {
    if (!Object.keys(commands).length) return;
    commands = commands.map((command) => {
      delete command.members;
      delete command.conditions;
      delete command.sendTargets;
      delete command.variables;
      delete command.messages;
      delete command.servers;
      return commands;
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
      delete event.members;
      delete event.conditions;
      delete event.sendTargets;
      delete event.variables;
      delete event.messages;
      delete event.servers;
      return events;
    });
    fs.writeFileSync(
      path.resolve(this.filePath, "./data/events.json"),
      JSON.stringify(events, null, 2)
    );
  }
}
