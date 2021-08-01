import fs from "fs";
import fg from "fast-glob";
import path from "path";

export default class Loader {
  constructor({ filePath }) {
    this.filePath = filePath;
    this.actions = {};
  }
  getSettings() {
    console.log(this.filePath);
    return fs.readFileSync(
      path.resolve(this.filePath, "./data/settings.json"),
      "utf8"
    );
  }
  async getLocalActions() {
    const files = await fg(
      path.resolve(__dirname, "../../public/resources/action-configs/*.json")
    );

    console.log(files);
    const actions = files.map((file) =>
      JSON.parse(fs.readFileSync(file, "utf-8"))
    );

    return JSON.stringify(actions);
  }
  async getCommands() {
    console.log(path.resolve(this.filePath, "./data/commands.json"));
    return fs.readFileSync(
      path.resolve(this.filePath, "./data/commands.json"),
      "utf8"
    );
  }
  async getEvents() {
    console.log(path.resolve(this.filePath, "./data/events.json"));
    return fs.readFileSync(
      path.resolve(this.filePath, "./data/events.json"),
      "utf8"
    );
  }
}
