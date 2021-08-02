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
  async getEvents() {
    return fs.readFileSync(
      path.resolve(this.filePath, "./data/events.json"),
      "utf8"
    );
  }
}
