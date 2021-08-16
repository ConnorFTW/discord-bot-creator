import path from "path";
import fs from "fs";

export const copyFiles = (externalFolder, files) => {
  console.log(`Copying files from ${externalFolder} to ${files}`);
  const localFiles = files.map((file) => {
    return path.join("./resources/templates/empty", file);
  });
  console.log(localFiles);

  const externalFiles = files.map((file) => {
    console.log(file);
    return path.join(externalFolder, file);
  });

  try {
    for (let i in files) {
      const localFile = localFiles[i];
      const externalFile = externalFiles[i];

      // Create data folder if it doesn't exist
      const dataFolder = path.join(externalFolder, "data");
      if (!fs.existsSync(dataFolder)) {
        console.log(dataFolder);
        fs.mkdirSync(dataFolder);
      }
      console.log(fs.readFileSync(localFile, "utf-8"));
      fs.copyFileSync(localFile, externalFile);
    }

    return true;
  } catch (e) {
    console.error(e);
  }
};
