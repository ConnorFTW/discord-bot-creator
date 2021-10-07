import { GuildMember, Message, User } from "discord.js";
import fs from "fs";
import path from "path";
import Logger from "./Logger.js";

/**
 * @class
 * @classdesc This is a collection of functions that are used to perform actions on Discord.js objects.
 */
export default class Actions extends Logger {
  constructor() {
    super();
    this.actionsLocation = null;
    this.eventsLocation = null;
    this.extensionsLocation = null;

    this.server = {};
    this.global = {};
    this.timeStamps = [];

    /**
     * @type {import("./Files").default}
     * @public
     */
    this.Files = null;

    /**
     * @type {import("./Bot").default}
     * @public
     */
    this.DBM = null;
  }

  exists(action) {
    if (!action) return false;
    return typeof this[action] === "function";
  }

  getLocalFile(url) {
    return path.join(process.cwd(), url);
  }

  getDBM() {
    return this.DBM;
  }

  callListFunc(list, funcName, args) {
    return new Promise(function (resolve) {
      const max = list.length;
      let curr = 0;
      function callItem() {
        if (curr === max) {
          resolve.apply(this, arguments);
          return;
        }
        const item = list[curr++];
        if (typeof this.dest(item, funcName) === "function") {
          item[funcName].apply(item, args).then(callItem).catch(callItem);
        } else {
          callItem();
        }
      }
      callItem();
    });
  }

  getActionVariable(name, defaultValue) {
    if (this[name] === undefined && defaultValue !== undefined) {
      this[name] = defaultValue;
    }
    return this[name];
  }

  eval(content, cache) {
    if (!content) return false;
    const DBM = this.getDBM();
    const tempVars = this.getActionVariable.bind(cache.temp);
    let serverVars = null;
    if (cache.server) {
      serverVars = this.getActionVariable.bind(this.server[cache.server.id]);
    }
    const globalVars = this.getActionVariable.bind(this.global);
    const msg = cache.msg;
    const server = cache.server;
    const client = DBM.Bot.bot;
    const bot = DBM.Bot.bot;
    const me = server ? server.me : null;
    let user = "",
      member = "",
      mentionedUser = "",
      mentionedChannel = "",
      defaultChannel = "";
    if (msg) {
      user = msg.author;
      member = msg.member;
      if (msg.mentions) {
        mentionedUser = msg.mentions.users.first() || "";
        mentionedChannel = msg.mentions.channels.first() || "";
      }
    }
    if (server?.getDefaultChannel) {
      defaultChannel = server.getDefaultChannel();
    }
    try {
      return eval(content);
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  /**
   * Given a string from an user input field, this function will return the resolved value.
   * @param {string} content - The string to resolve.
   * @param {object} cache - The cache object.
   * @returns {string}
   * @example `${member.displayName} is cool` => `Michael is cool`
   */
  evalMessage(content, cache) {
    if (!content) return "";
    // If it doesn't have a variable in it, just return the content
    if (!content.match(/\$\{.*\}/im)) return content;
    // Escape backticks for eval
    return this.eval("`" + content.replace(/`/g, "\\`") + "`", cache);
  }

  initMods() {
    this.modDirectories().forEach(
      function (dir) {
        fs.readdirSync(dir).forEach(
          (async (file) => {
            if (file.match(/\.js/i)) {
              let filePath = path
                .join(dir, file)
                .split(path.sep)
                .slice(-2)
                .join("/");
              filePath = "../" + filePath;
              const action = (await import(filePath)).default;
              if (action?.action) {
                this[action.name] = action.action;
              }
              if (action?.mod) {
                try {
                  action.mod(this.DBM);
                } catch (e) {
                  console.error(e);
                }
              }
            }
          }).bind(this)
        );
      }.bind(this)
    );
  }

  modDirectories() {
    const result = [this.actionsLocation];
    if (this.Files.verifyDirectory(this.eventsLocation)) {
      result.push(this.eventsLocation);
    }
    if (this.Files.verifyDirectory(this.extensionsLocation)) {
      result.push(this.extensionsLocation);
    }
    return result;
  }

  preformActions(msg, cmd) {
    if (this.checkConditions(msg, cmd) && this.checkTimeRestriction(msg, cmd)) {
      this.invokeActions(msg, cmd);
    }
  }

  checkConditions(msg, cmd) {
    const isServer = Boolean(msg.guild && msg.member);
    const restriction = parseInt(cmd.restriction);
    const permissions = cmd.permissions;
    switch (restriction) {
      case 0:
        return isServer ? this.checkPermissions(msg, permissions) : true;
      case 1:
        return isServer && this.checkPermissions(msg, permissions);
      case 2:
        return isServer && msg.guild.ownerID === msg.member.id;
      case 3:
        return !isServer;
      case 4:
        return (
          this.Files.data.settings.ownerId &&
          msg.author.id === this.Files.data.settings.ownerId
        );
      default:
        return true;
    }
  }

  checkTimeRestriction(msg, cmd) {
    if (!cmd._timeRestriction) return true;
    if (!msg.member) return false;
    const mid = msg.member.id;
    const cid = cmd._id;
    if (!this.timeStamps[cid]) {
      this.timeStamps[cid] = [];
      this.timeStamps[cid][mid] = Date.now();
      return true;
    } else if (!this.timeStamps[cid][mid]) {
      this.timeStamps[cid][mid] = Date.now();
      return true;
    } else {
      const time = Date.now();
      const diff = time - this.timeStamps[cid][mid];
      if (cmd._timeRestriction <= Math.floor(diff / 1000)) {
        this.timeStamps[cid][mid] = time;
        return true;
      } else {
        const remaining = cmd._timeRestriction - Math.floor(diff / 1000);
        Events.callEvents(
          "38",
          1,
          3,
          2,
          false,
          "",
          msg.member,
          this.generateTimeString(remaining)
        );
      }
    }
  }

  generateTimeString(miliSeconds) {
    let remaining = miliSeconds;
    const times = [];

    const days = Math.floor(remaining / 60 / 60 / 24);
    if (days > 0) {
      remaining -= days * 60 * 60 * 24;
      times.push(days + (days === 1 ? " day" : " days"));
    }
    const hours = Math.floor(remaining / 60 / 60);
    if (hours > 0) {
      remaining -= hours * 60 * 60;
      times.push(hours + (hours === 1 ? " hour" : " hours"));
    }
    const minutes = Math.floor(remaining / 60);
    if (minutes > 0) {
      remaining -= minutes * 60;
      times.push(minutes + (minutes === 1 ? " minute" : " minutes"));
    }
    const seconds = Math.floor(remaining);
    if (seconds > 0) {
      remaining -= seconds;
      times.push(seconds + (seconds === 1 ? " second" : " seconds"));
    }

    let result = "";
    if (times.length === 1) {
      result = times[0];
    } else if (times.length === 2) {
      result = times[0] + " and " + times[1];
    } else if (times.length === 3) {
      result = times[0] + ", " + times[1] + ", and " + times[2];
    } else if (times.length === 4) {
      result =
        times[0] + ", " + times[1] + ", " + times[2] + ", and " + times[3];
    }
    return result;
  }

  checkPermissions(msg, permissions) {
    const author = msg.member;
    if (!author) return false;
    if (permissions === "NONE") return true;
    if (msg.guild.ownerID === author.id) return true;
    return author.permissions.has([permissions]);
  }

  invokeActions(msg, cmd) {
    const actions = cmd.actions || [];
    const act = actions[0];
    if (!act) return;
    const cache = {
      actions,
      index: 0,
      temp: {},
      server: msg.guild,
      msg: msg,
      command: cmd,
    };
    if (this.exists(act.name)) {
      try {
        this[act.name](cache);
      } catch (e) {
        this.displayError(act, cache, e);
      }
    } else {
      console.error(act.name + " does not exist!");
      this.callNextAction(cache);
    }
  }

  invokeEvent(event, server, temp) {
    const actions = event.actions;
    const act = actions[0];
    if (!act) return;
    const cache = {
      actions,
      index: 0,
      temp,
      server,
      event,
    };
    if (this.exists(act.name)) {
      try {
        this[act.name](cache);
      } catch (e) {
        this.displayError(act, cache, e);
      }
    } else {
      console.error(act.name + " does not exist!");
      this.callNextAction(cache);
    }
  }

  callNextAction(cache) {
    cache.index++;
    cache.handlerIndex = (cache.command ?? cache.event)?.position;
    const index = cache.index;
    const handlerIndex = cache.handlerIndex;
    const actions = cache.actions;
    const act = actions[index];
    const isCommand = typeof cache.command !== "undefined";

    if (!act) return cache.callback?.();
    if (this.exists(act.name)) {
      try {
        process.send?.(
          `${isCommand ? "command" : "event"}:${handlerIndex}:${cache.index}`
        );

        this[act.name](cache);
      } catch (e) {
        this.displayError(act, cache, e);
      }
    } else {
      console.error(act.name + " does not exist!");
      this.callNextAction(cache);
    }
  }

  getSendTarget(type, varName, cache) {
    const msg = cache.msg;
    const server = cache.server;
    switch (type) {
      case 0:
        if (msg) {
          return msg.channel;
        }
        break;
      case 1:
        if (msg) {
          return msg.author;
        }
        break;
      case 2:
        if (msg && msg.mentions) {
          return msg.mentions.users.first();
        }
        break;
      case 3:
        if (msg && msg.mentions) {
          return msg.mentions.channels.first();
        }
        break;
      case 4:
        if (server?.getDefaultChannel) {
          return server.getDefaultChannel();
        }
        break;
      case 5:
        return cache.temp[varName];
      case 6:
        if (server && this.server[server.id]) {
          return this.server[server.id][varName];
        }
        break;
      case 7:
        return this.global[varName];
      default:
        break;
    }
    return false;
  }

  /**
   * Gets the value of a variable depending on the type parameter.
   * @param {Number} type a number from 0-4
   * @param {String} varName a variable name
   * @param {Object} cache a cache object
   * @returns {GuildMember | User | undefined | false}
   * @example type: 0 => GuildMember
   * @example type: 1 => GuildMember | User | undefined
   * @example type: 2 => GuildMember | User | undefined
   * @example type: 3 => GuildMember | User | undefined
   * @example type: 4 => GuildMember | User | undefined
   * @example type: 5+ => false
   */
  getMember(type, varName, { msg, server, temp }) {
    switch (type) {
      case 0:
        return msg?.mentions?.members?.first();
      case 1:
        return msg?.member || msg?.author;
      case 2:
        return temp[varName];
      case 3:
        return this.server[server?.id]?.[varName];
      case 4:
        return this.global[varName];
      default:
        return false;
    }
  }

  /**
   * @returns {Message}
   */
  getMessage(type, varName, cache) {
    const msg = cache.msg;
    const server = cache.server;
    switch (type) {
      case 0:
        if (msg) {
          return msg;
        }
        break;
      case 1:
        return cache.temp[varName];
      case 2:
        if (server && this.server[server.id]) {
          return this.server[server.id][varName];
        }
        break;
      case 3:
        return this.global[varName];
      default:
        break;
    }
    return false;
  }

  getServer(type, varName, cache) {
    const server = cache.server;
    switch (type) {
      case 0:
        if (server) {
          return server;
        }
        break;
      case 1:
        return cache.temp[varName];
      case 2:
        if (server && this.server[server.id]) {
          return this.server[server.id][varName];
        }
        break;
      case 3:
        return this.global[varName];
      default:
        break;
    }
    return false;
  }

  getRole(type, varName, cache) {
    const msg = cache.msg;
    const server = cache.server;
    switch (type) {
      case 0:
        if (msg && msg.mentions && msg.mentions.roles) {
          return msg.mentions.roles.first();
        }
        break;
      case 1:
        if (msg && msg.member && msg.member.roles) {
          return msg.member.roles.cache.first();
        }
        break;
      case 2:
        if (server && server.roles) {
          return server.roles.cache.first();
        }
        break;
      case 3:
        return cache.temp[varName];
      case 4:
        if (server && this.server[server.id]) {
          return this.server[server.id][varName];
        }
        break;
      case 5:
        return this.global[varName];
      default:
        break;
    }
    return false;
  }

  getChannel(type, varName, cache) {
    const msg = cache.msg;
    const server = cache.server;
    switch (type) {
      case 0:
        if (msg) {
          return msg.channel;
        }
        break;
      case 1:
        if (msg && msg.mentions) {
          return msg.mentions.channels.first();
        }
        break;
      case 2:
        if (server?.getDefaultChannel) {
          return server.getDefaultChannel();
        }
        break;
      case 3:
        return cache.temp[varName];
      case 4:
        if (server && this.server[server.id]) {
          return this.server[server.id][varName];
        }
        break;
      case 5:
        return this.global[varName];
      default:
        break;
    }
    return false;
  }

  getVoiceChannel(type, varName, cache) {
    const msg = cache.msg;
    const server = cache.server;

    switch (type) {
      case 0:
        return msg?.member?.voice.channel;
      case 1:
        return msg?.mentions?.members?.first() && msg.member.voice?.channel;
      case 2:
        return server?.getDefaultVoiceChannel();
      case 3:
        return cache.temp[varName];
      case 4:
        return this.server[server?.id]?.[varName];
      case 5:
        return this.global[varName];
      default:
        return false;
    }
  }

  getList(type, varName, cache) {
    const msg = cache.msg;
    const server = cache.server;
    switch (type) {
      case 0:
        if (server) {
          return server.members.cache.values();
        }
        break;
      case 1:
        if (server) {
          return server.channels.cache.values();
        }
        break;
      case 2:
        if (server) {
          return server.roles.cache.values();
        }
        break;
      case 3:
        if (server) {
          return server.emojis.cache.values();
        }
        break;
      case 4:
        return Bot.bot.guilds.cache.values();
      case 5:
        if (msg && msg.mentions && msg.mentions.members) {
          return msg.mentions.members.first().roles.cache.values();
        }
        break;
      case 6:
        if (msg && msg.member) {
          return msg.member.roles.cache.values();
        }
        break;
      case 7:
        return cache.temp[varName];
      case 8:
        if (server && this.server[server.id]) {
          return this.server[server.id][varName];
        }
        break;
      case 9:
        return this.global[varName];
      default:
        break;
    }
    return false;
  }

  getVariable(type, varName, cache) {
    const server = cache.server;
    switch (type) {
      case 1:
        return cache.temp[varName];
      case 2:
        if (server && this.server[server.id]) {
          return this.server[server.id][varName];
        }
        break;
      case 3:
        return this.global[varName];
      default:
        break;
    }
    return false;
  }

  storeValue(value, type, varName, cache) {
    const server = cache.server;
    switch (type) {
      case 1:
        cache.temp[varName] = value;
        break;
      case 2:
        if (server) {
          if (!this.server[server.id]) this.server[server.id] = {};
          this.server[server.id][varName] = value;
        }
        break;
      case 3:
        this.global[varName] = value;
        break;
      default:
        break;
    }
  }

  executeResults(result, data, cache) {
    if (result) {
      const type = parseInt(data.iftrue);
      switch (type) {
        case 0:
          this.callNextAction(cache);
          break;
        case 2:
          const val = parseInt(this.evalMessage(data.iftrueVal, cache));
          const index = Math.max(val - 1, 0);
          if (cache.actions[index]) {
            cache.index = index - 1;
            this.callNextAction(cache);
          }
          break;
        case 3:
          const amnt = parseInt(this.evalMessage(data.iftrueVal, cache));
          const index2 = cache.index + amnt + 1;
          if (cache.actions[index2]) {
            cache.index = index2 - 1;
            this.callNextAction(cache);
          }
          break;
        default:
          break;
      }
    } else {
      const type = parseInt(data.iffalse);
      switch (type) {
        case 0:
          this.callNextAction(cache);
          break;
        case 2:
          const val = parseInt(this.evalMessage(data.iffalseVal, cache));
          const index = Math.max(val - 1, 0);
          if (cache.actions[index]) {
            cache.index = index - 1;
            this.callNextAction(cache);
          }
          break;
        case 3:
          const amnt = parseInt(this.evalMessage(data.iffalseVal, cache));
          const index2 = cache.index + amnt + 1;
          if (cache.actions[index2]) {
            cache.index = index2 - 1;
            this.callNextAction(cache);
          }
          break;
        default:
          break;
      }
    }
  }

  dest(obj, ...props) {
    if (typeof obj !== "object") return obj;

    let main = obj;
    for (const prop of props) {
      if (!main || !prop) return main;
      main = main[prop];
    }

    return main;
  }
}
