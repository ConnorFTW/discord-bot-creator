import path from "path";
import { spawn } from "child_process";
import { ipcMain } from "electron";

export default class Runner {
  constructor(runner = {}) {
    this.filePath = runner.filePath;
    process.on("exit", () => {
      if (this.botProcess) {
        this.botProcess.kill();
        this.botProcess = null;
      }
    });
  }
  async run() {
    return new Promise(async (resolve, reject) => {
      console.log("Running:", this.filePath);
      if (this.botProcess) await this.stop();
      const botFile = path.join(this.filePath, "bot.js");

      this.botProcess = spawn("node", [botFile], {
        cwd: this.filePath,
        detached: false,
      });
      this.botProcess.stdout.on("data", (data) => {
        const message = data.toString().replace(/\n/g, "");
        console.log({ message });
        if (message === "Bot is ready!") {
          resolve();
        }
        ipcMain.emit("onBotLog", message);
      });
    });
  }
  stop() {
    console.log("Stopping:", this.botProcess.pid);
    if (this.botProcess) {
      this.botProcess.kill();
      this.botProcess = null;
    }
  }
}
