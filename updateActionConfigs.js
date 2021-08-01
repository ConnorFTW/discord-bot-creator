const fg = require("fast-glob");
const fs = require("fs");

async function updateFiles() {
  const files = await fg("./actions/**/*.js");
  for (const file of files) {
    const content = await require(file);
    const newFile = file
      .replace(".js", ".json")
      .replace("actions/", "action-configs/");
    await fs.writeFileSync(newFile, JSON.stringify(content, null, 2));
  }
}

updateFiles();
