import fg from "fast-glob";
import fs from "fs";
import path from "path";

export const copyFiles = (externalFolder, _files) => {
  const localFiles = fg.sync("./resources/templates/empty/**/*.*");

  const externalFiles = localFiles.map((file) => {
    console.log(file);
    return path.join(
      externalFolder,
      file.split("./resources/templates/empty")[1]
    );
  });
  console.log({ externalFiles, localFiles });

  try {
    for (let i in localFiles) {
      const localFile = localFiles[i];
      const externalFile = externalFiles[i];

      // Create data folder if it doesn't exist
      const dataFolder = path.join(externalFolder, "data");
      if (!fs.existsSync(dataFolder)) {
        console.log(dataFolder);
        fs.mkdirSync(dataFolder);
      }

      // Create actions folder if it doesn't exist
      const actionsFolder = path.join(externalFolder, "actions");
      if (!fs.existsSync(actionsFolder)) {
        console.log(actionsFolder);
        fs.mkdirSync(actionsFolder);
      }

      // Create fonts folder if it doesn't exist
      const fontsFolder = path.join(externalFolder, "fonts");
      if (!fs.existsSync(fontsFolder)) {
        console.log(fontsFolder);
        fs.mkdirSync(fontsFolder);
      }

      // Create utils folder if it doesn't exist
      const utilsFolder = path.join(externalFolder, "utils");
      if (!fs.existsSync(utilsFolder)) {
        console.log(utilsFolder);
        fs.mkdirSync(utilsFolder);
      }

      console.log(localFile, externalFile);
      console.log(fs.readFileSync(localFile, "utf-8"), {
        localFile,
        externalFile,
      });

      // Don't write data files if they already exist
      if (externalFile.includes("data") && fs.existsSync(externalFile)) {
        continue;
      }

      fs.copyFileSync(localFile, externalFile);
    }

    return true;
  } catch (e) {
    console.error(e);
  }
};
