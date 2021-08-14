import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import Storage from "./Storage.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @class
 * @extends Storage
 */
export default class Files extends Storage {
  constructor() {
    super();
    this.data = {};
    this.writers = {};
    this.crypto = crypto;
    this.dataFiles = [
      "commands.json",
      "events.json",
      "settings.json",
      "players.json",
      "servers.json",
      "serverVars.json",
      "globalVars.json",
    ];
  }

  startBot() {
    this.Actions.actionsLocation = path.join(__dirname, "../actions");
    this.Actions.eventsLocation = path.join(__dirname, "../events");
    this.Actions.extensionsLocation = path.join(__dirname, "../extensions");
    if (this.verifyDirectory(this.Actions.actionsLocation)) {
      this.Actions.initMods();
      this.readData(this.Bot.init.bind(this.Bot));
    } else {
      console.error(
        'Please copy the "Actions" folder from the Discord Bot Maker directory to this bot\'s directory: \n' +
          this.Actions.actionsLocation
      );
    }
  }

  saveServerVariable(serverID, varName, item) {
    if (!this.data.serverVars[serverID]) {
      this.data.serverVars[serverID] = {};
    }
    const strItem = this.convertItem(item);
    if (strItem !== null) {
      this.data.serverVars[serverID][varName] = strItem;
    }
    this.saveData("serverVars");
  }

  restoreServerVariables() {
    const keys = Object.keys(this.data.serverVars);
    for (let i = 0; i < keys.length; i++) {
      const varNames = Object.keys(this.data.serverVars[keys[i]]);
      for (let j = 0; j < varNames.length; j++) {
        this.restoreVariable(
          this.data.serverVars[keys[i]][varNames[j]],
          2,
          varNames[j],
          keys[i]
        );
      }
    }
  }

  saveGlobalVariable(varName, item) {
    const strItem = this.convertItem(item);
    if (strItem !== null) {
      this.data.globalVars[varName] = strItem;
    }
    this.saveData("globalVars");
  }

  restoreGlobalVariables() {
    const keys = Object.keys(this.data.globalVars);
    for (let i = 0; i < keys.length; i++) {
      this.restoreVariable(this.data.globalVars[keys[i]], 3, keys[i]);
    }
  }

  restoreVariable(value, type, varName, serverId) {
    const bot = Bot.bot;
    let cache = {};
    if (serverId) {
      cache.server = { id: serverId };
    }
    if (typeof value === "string" || Array.isArray(value)) {
      this.restoreValue(value, bot)
        .then(
          function (finalValue) {
            if (finalValue) {
              this.Actions.storeValue(finalValue, type, varName, cache);
            }
          }.bind(this)
        )
        .catch(() => {});
    } else {
      this.Actions.storeValue(value, type, varName, cache);
    }
  }

  restoreMember(value, bot) {
    const split = value.split("_");
    const memId = split[0].slice(4);
    const serverId = split[1].slice(2);
    const server = bot.guilds.get(serverId);
    if (server && server.members && server.members.cache) {
      const member = server.members.cache.get(memId);
      return member;
    }
  }

  restoreMessage(value, bot) {
    const split = value.split("_");
    const msgId = split[0].slice(4);
    const channelId = split[1].slice(2);
    const channel = bot.channels.cache.get(channelId);
    if (channel && channel.messages && channel.messages.fetch) {
      return channel.messages.fetch(msgId);
    }
  }

  restoreTextChannel(value, bot) {
    const channelId = value.slice(3);
    return bot.channels.cache.get(channelId);
  }

  restoreVoiceChannel(value, bot) {
    const channelId = value.slice(3);
    return bot.channels.cache.get(channelId);
  }

  restoreRole(value, bot) {
    const split = value.split("_");
    const roleId = split[0].slice(2);
    const serverId = split[1].slice(2);
    const server = bot.guilds.cache.get(serverId);
    if (server && server.roles && server.roles.cache) {
      return server.roles.cache.get(roleId);
    }
  }

  restoreServer(value, bot) {
    const serverId = value.slice(2);
    return bot.guilds.cache.get(serverId);
  }

  restoreEmoji(value, bot) {
    const emojiId = value.slice(2);
    return bot.emojis.cache.get(emojiId);
  }

  restoreUser(value, bot) {
    const userId = value.slice(4);
    return bot.users.cache.get(userId);
  }
}
