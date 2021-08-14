import path from "path";
import crypto from "crypto";
import fs from "fs";
import { GuildMember } from "discord.js";
import fstorm from "fstorm";
import { Guild } from "discord.js";

export default class Storage {
  constructor() {
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

  verifyDirectory(dir) {
    return typeof dir === "string" && fs.existsSync(dir);
  }

  readData(callback) {
    let max = this.dataFiles.length;
    let cur = 0;
    for (let i = 0; i < max; i++) {
      const filePath = path.join(process.cwd(), "data", this.dataFiles[i]);
      if (!fs.existsSync(filePath)) continue;
      fs.readFile(
        filePath,
        function (error, content) {
          const filename = this.dataFiles[i].slice(0, -5);
          let data;
          try {
            if (typeof content !== "string" && content.toString)
              content = content.toString();
            data = JSON.parse(this.decrypt(content));
          } catch (e) {
            console.error(`There was issue parsing ${this.dataFiles[i]}!`);
            return;
          }
          this.data[filename] = data;
          if (++cur === max) {
            callback();
          }
        }.bind(this)
      );
    }
  }

  saveData(file, callback) {
    const data = this.data[file];
    if (!this.writers[file]) {
      this.writers[file] = fstorm(
        path.join(process.cwd(), "data", file + ".json")
      );
    }
    this.writers[file].write(
      this.encrypt(JSON.stringify(data)),
      function () {
        if (callback) {
          callback();
        }
      }.bind(this)
    );
  }

  initEncryption() {
    try {
      this.password = ""; // require("discord-bot-maker");
    } catch (e) {
      this.password = "";
    }
  }

  encrypt(text) {
    if (this.password.length === 0) return text;
    const cipher = this.crypto.createCipher("aes-128-ofb", this.password);
    let crypted = cipher.update(text, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
  }

  decrypt(text) {
    if (this.password.length === 0) return text;
    const decipher = this.crypto.createDecipher("aes-128-ofb", this.password);
    let dec = decipher.update(text, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
  }

  convertItem(item) {
    if (Array.isArray(item)) {
      const result = [];
      const length = item.length;
      for (let i = 0; i < length; i++) {
        result[i] = this.convertItem(item[i]);
      }
      return result;
    } else if (typeof item !== "object") {
      let result = "";
      try {
        result = JSON.stringify(item);
      } catch {}
      if (result !== "{}") {
        return item;
      }
    } else if (item.convertToString) {
      return item.convertToString();
    }
    return null;
  }

  restoreValue(value, bot) {
    return new Promise(
      function (resolve, reject) {
        if (typeof value === "string") {
          if (value.startsWith("mem-")) {
            return resolve(this.restoreMember(value, bot));
          } else if (value.startsWith("msg-")) {
            return this.restoreMessage(value, bot).then(resolve).catch(reject);
          } else if (value.startsWith("tc-")) {
            return resolve(this.restoreTextChannel(value, bot));
          } else if (value.startsWith("vc-")) {
            return resolve(this.restoreVoiceChannel(value, bot));
          } else if (value.startsWith("r-")) {
            return resolve(this.restoreRole(value, bot));
          } else if (value.startsWith("s-")) {
            return resolve(this.restoreServer(value, bot));
          } else if (value.startsWith("e-")) {
            return resolve(this.restoreEmoji(value, bot));
          } else if (value.startsWith("usr-")) {
            return resolve(this.restoreUser(value, bot));
          }
          resolve(value);
        } else if (Array.isArray(value)) {
          const result = [];
          const length = value.length;
          let curr = 0;
          for (let i = 0; i < length; i++) {
            this.restoreValue(value[i], bot)
              .then(function (item) {
                result[i] = item;
                if (++curr >= length) {
                  resolve(result);
                }
              })
              .catch(function () {
                if (++curr >= length) {
                  resolve(result);
                }
              });
          }
        } else {
          resolve(value);
        }
      }.bind(this)
    );
  }

  /**
   * Tries to find a storage entry for the member variable but defaults to defaultValue if not found
   * @param {GuildMember} member
   * @param {string} name
   * @param {any} defaultValue
   * @returns {any | null}
   */
  getMemberData(member, name, defaultValue) {
    const id = member.id;
    const data = this.data.players;

    if (data[id] === undefined) {
      if (defaultValue === undefined) {
        return null;
      } else {
        data[id] = {};
      }
    }

    if (data[id][name] === undefined && defaultValue !== undefined) {
      data[id][name] = defaultValue;
    }

    return data[id][name];
  }

  /**
   * Tries to find a storage entry for the server variable but defaults to defaultValue if not found
   * @param {Guild} server
   * @param {string} name
   * @param {any} defaultValue
   * @returns {any | null}
   */
  getServerData(server, name, defaultValue) {
    const id = server.id;
    const data = this.data.servers;
    if (data[id] === undefined) {
      if (defaultValue === undefined) {
        return null;
      } else {
        data[id] = {};
      }
    }
    if (data[id][name] === undefined && defaultValue !== undefined) {
      data[id][name] = defaultValue;
    }
    return data[id][name];
  }

  /**
   * Sets a storage entry for the member variable
   * @param {GuildMember} member
   * @param {string} name
   * @param {any} value
   * @returns {undefined}
   */
  setMemberData(member, name, value) {
    const id = member.id;
    const data = this.data.players;

    if (data[id] === undefined) {
      data[id] = {};
    }

    data[id][name] = value;
    this.saveData("players", null);
  }

  /**
   * Sets a storage entry for the server variable
   * @param {Guild} server
   * @param {string} name
   * @param {any} value
   * @returns {undefined}
   */
  setServerData(server, name, value) {
    const id = server.id;
    const data = this.data.servers;

    if (data[id] === undefined) {
      data[id] = {};
    }

    data[id][name] = value;
    this.saveData("servers", null);
  }

  /**
   * Adds to the storage entry for the member variable
   * @param {GuildMember} member
   * @param {string} name
   * @param {any} value
   * @returns {undefined}
   */
  addMemberData(member, name, value) {
    const id = member.id;
    const data = this.data.players;

    if (data[id] === undefined) {
      data[id] = {};
    }

    if (data[id][name] === undefined) {
      this.setMemberData(member, name, value);
    } else {
      this.setMemberData(member, name, data[id][name] + value);
    }
  }

  /**
   * Adds to the storage entry for the server variable
   * @param {Guild} server
   * @param {string} name
   * @param {any} value
   * @returns {undefined}
   */
  addServerData(server, name, value) {
    const id = server.id;
    const data = this.data.servers;
    if (data[id] === undefined) {
      data[id] = {};
    }
    if (data[id][name] === undefined) {
      this.setServerData(server, name, value);
    } else {
      this.setServerData(server, name, data[id][name] + value);
    }
  }

  convertMemberToString(member) {
    return `usr-${member.id}`;
  }

  convertServerToString(server) {
    return `s-${server.id}`;
  }
}
