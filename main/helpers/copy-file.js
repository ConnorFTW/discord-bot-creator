import { error, log } from "electron-log";
import fg from "fast-glob";
import fs from "fs";
import path from "path";

export const copyFiles = async (externalFolder, _files) => {
  try {
    log("copy-file __dirname", __dirname);
    const directory = path
      .join(__dirname, "../resources/bot/**/*.*")
      .replace(/\\/g, "/");
    const localFiles = await fg(directory);
    log(`${localFiles.length} files found`);
    log(`file example ${localFiles[0]}`);
    const externalFiles = localFiles.map((file) => {
      return path.join(externalFolder, file.split("/resources/bot")[1]);
    });

    log(`Files converted to something like ${externalFiles[0]}`);

    for (let i in localFiles) {
      const localFile = localFiles[i];
      const externalFile = externalFiles[i];

      // Create data folder if it doesn't exist
      const dataFolder = path.join(externalFolder, "data");
      if (!fs.existsSync(dataFolder)) {
        log(dataFolder);
        fs.mkdirSync(dataFolder);
      }

      // Create actions folder if it doesn't exist
      const actionsFolder = path.join(externalFolder, "actions");
      if (!fs.existsSync(actionsFolder)) {
        log(actionsFolder);
        fs.mkdirSync(actionsFolder);
      }

      // Create fonts folder if it doesn't exist
      const fontsFolder = path.join(externalFolder, "fonts");
      if (!fs.existsSync(fontsFolder)) {
        log(fontsFolder);
        fs.mkdirSync(fontsFolder);
      }

      // Create utils folder if it doesn't exist
      const utilsFolder = path.join(externalFolder, "utils");
      if (!fs.existsSync(utilsFolder)) {
        log(utilsFolder);
        fs.mkdirSync(utilsFolder);
      }

      // Don't write data files if they already exist
      if (externalFile.includes("data") && fs.existsSync(externalFile)) {
        continue;
      }

      fs.copyFileSync(localFile, externalFile);
    }

    return true;
  } catch (e) {
    error(e);
  }
};
