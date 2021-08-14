import DiscordJS from "discord.js";
import Bot from "./utils/Bot.js";
import Files from "./utils/Files.js";
import Actions from "./utils/Actions.js";
import Events from "./utils/Events.js";
import Images from "./utils/Images.js";
import Audio from "./utils/Audio.js";

const DBM = {
  Bot: new Bot(),
  Actions: new Actions(),
  Images: new Images(),
  Events: new Events(),
  Files: new Files(),
  Audio: new Audio(),
  version: "0.0.1",
  DiscordJS,
};

if (DiscordJS.version < "13.0.1") {
  throw new Error(
    "Discord.js version is out of date. Please update to the latest version."
  );
}

DBM.Files.Bot = DBM.Bot;
DBM.Files.Actions = DBM.Actions;

DBM.Bot.Files = DBM.Files;
DBM.Bot.Events = DBM.Events;
DBM.Bot.Actions = DBM.Actions;

DBM.Actions.DBM = DBM;
DBM.Actions.Bot = DBM.Bot;
DBM.Actions.Files = DBM.Files;
DBM.Actions.Events = DBM.Events;

DBM.Images.Actions = DBM.Actions;

DBM.Events.Bot = DBM.Bot;
DBM.Events.Actions = DBM.Actions;

DBM.Audio.Actions = DBM.Actions;

DBM.Audio.init();
DBM.Files.initEncryption();
DBM.Files.startBot();
