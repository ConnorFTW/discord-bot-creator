const fg = require("fast-glob");

fg("C:/Users/micha/discord-bot-creator/resources/actions/*.js", {
  dot: true,
}).then(console.log);
