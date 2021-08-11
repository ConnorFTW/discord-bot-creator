import path from "path";
import { fork } from "child_process";

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
        console.log(message);
        resolve();
      });

      this.botProcess.on("exit", (code) => {
        console.log("Bot process exited with code:", code);
        reject();
      });

      this.botProcess.addListener("message", (message) => {
        console.log("Bot process message:", message);
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
