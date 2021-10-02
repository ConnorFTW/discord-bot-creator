import path from "path";
import { fork } from "child_process";
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

      this.botProcess = fork(botFile, {
        cwd: this.filePath,
        detached: true,
      });

      this.botProcess.on("message", (message) => {
        console.log("from script: " + message);
        if (message === "BotReady") return resolve();
        if (message.type === "error") {
          delete message.type;
          ipcMain.emit("onBotError", message);
        }
      });

      this.botProcess.on("exit", (code) => {
        console.log("Bot process exited with code:", code);
        reject();
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
