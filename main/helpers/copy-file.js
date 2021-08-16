import path from "path";
import fs from "fs";

export default (externalFolder) => {
  const files = [
    "./data/settings.json",
    "./data/players.json",
    "./data/servers.json",
    "./data/commands.json",
    "./data/events.json",
    "./package.json",
  ];

  const localFiles = files.map((file) => {
    return path.join("../../resources/templates/start", file);
  });

  const externalFiles = files.map((file) => {
    return path.join(externalFolder, file);
  });

  try {
    for (let i in files) {
      const localFile = localFiles[i];
      const externalFile = externalFiles[i];

      fs.copyFileSync(localFile, externalFile);
    }

    return true;
  } catch (e) {
    console.error(e);
  }
};
