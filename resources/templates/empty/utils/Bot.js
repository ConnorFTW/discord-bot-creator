import DiscordJS from "discord.js";

const { Client } = DiscordJS;

export default class Bot {
  constructor() {
    this.$cmds = {};
    this.$icds = [];
    this.$regx = [];
    this.$anym = [];
    this.$evts = {};
    this.bot = null;

    /** @type {import("./Actions").default} */
    this.Actions = null;

    /** @type {import("./Audio").default} */
    this.Audio = null;
  }

  init() {
    this.initBot();
    this.reformatCommands();
    this.reformatEvents();
    this.initEvents();
    this.login();
  }

  initBot() {
    const { GUILDS, GUILD_MESSAGES, DIRECT_MESSAGES, GUILD_VOICE_STATES } =
      DiscordJS.Intents.FLAGS;
    this.bot = new Client({
      intents: [DIRECT_MESSAGES, GUILDS, GUILD_MESSAGES, GUILD_VOICE_STATES],
      partials: ["CHANNEL"],
    });
  }

  intents() {
    return DiscordJS.Intents.NON_PRIVILEGED;
  }

  onRawData(packet) {
    if (
      packet.t !== "MESSAGE_REACTION_ADD" ||
      packet.t !== "MESSAGE_REACTION_REMOVE"
    )
      return;

    const client = this.bot;
    const channel = client.channels.cache.get(packet.d.channel_id);
    if (channel.messages.cache.has(packet.d.message_id)) return;

    channel.messages.fetch(packet.d.message_id).then(function (message) {
      const emoji = packet.d.emoji.id
        ? `${packet.d.emoji.name}:${packet.d.emoji.id}`
        : packet.d.emoji.name;
      const reaction = message.reactions.cache.get(emoji);
      if (packet.t === "MESSAGE_REACTION_ADD") {
        client.emit(
          "messageReactionAdd",
          reaction,
          client.users.cache.get(packet.d.user_id)
        );
      }
      if (packet.t === "MESSAGE_REACTION_REMOVE") {
        client.emit(
          "messageReactionRemove",
          reaction,
          client.users.cache.get(packet.d.user_id)
        );
      }
    });
  }

  reformatCommands() {
    const data = this.Files.data.commands || [];
    this._caseSensitive = this.Files.data.settings.case === "true";

    data.forEach((cmd, i) => this.registerCommand(cmd, i));
  }

  registerCommand(command, position = 0, caseSensitive = this._caseSensitive) {
    if (!command) return;

    command.position = position;
    switch (command.comType) {
      case "1":
        return this.$icds.push(command);
      case "2":
        return this.$regx.push(command);
      case "3":
        return this.$anym.push(command);
      default:
        const name = caseSensitive ? command.name : command.name.toLowerCase();
        console.log(position);
        this.$cmds[name] = command;
        for (let alias of command._aliases || []) {
          if (caseSensitive) alias = alias.toLowerCase();
          this.$cmds[alias] = command;
        }
        break;
    }
  }

  reformatEvents() {
    const data = this.Files.data.events || [];
    data.forEach((evt, i) => this.registerEvent(evt, i));
  }

  registerEvent(event, position = 0) {
    if (!event) return;
    const type = event["event-type"];
    event.position = position;
    if (!this.$evts[type]) this.$evts[type] = [];
    this.$evts[type].push(event);
  }

  initEvents() {
    this.bot.on("raw", this.onRawData.bind(this));
    this.bot.on("ready", this.onReady.bind(this));
    this.bot.on("messageCreate", (msg) => this.onMessage(msg));
    this.Events.registerEvents(this.bot);
  }

  login() {
    this.bot.login(this.Files.data.settings.token);
  }

  onReady() {
    if (process.send) process.send("ready");
    console.log("Bot is ready!");
    this.restoreVariables();
    this.preformInitialization();
  }

  restoreVariables() {
    this.Files.restoreServerVariables();
    this.Files.restoreGlobalVariables();
  }

  preformInitialization() {
    const bot = this.bot;
    if (this.$evts["1"]) {
      this.Events.onInitialization(bot);
    }
    if (this.$evts["3"]) {
      this.Events.setupIntervals(bot);
    }
  }

  onMessage(msg) {
    if (msg.author.bot) return;
    try {
      if (this.checkCommand(msg)) return;
      this.onAnyMessage(msg);
    } catch (e) {
      console.error(e);
    }
  }

  onAnyMessage(msg) {
    this.checkIncludes(msg);
    this.checkRegExps(msg);
    if (msg.author.bot) return;
    if (this.$evts["2"]) {
      this.Events.callEvents("2", 1, 0, 2, false, "", msg);
    }
    const anym = this.$anym;
    for (let i = 0; i < anym.length; i++) {
      if (!anym[i]) continue;
      this.Actions.preformActions(msg, anym[i]);
    }
  }

  checkCommand(msg) {
    let command = this.checkPrefix(msg.content);
    if (command) {
      if (!this._caseSensitive) {
        command = command.toLowerCase();
      }
      const cmd = this.$cmds[command];
      if (cmd) {
        this.Actions.preformActions(msg, cmd);
      }
    }
  }

  checkPrefix(content) {
    const prefix = this.Files.data.settings.tag;
    const separator = this.Files.data.settings.separator || "\\s+";
    content = content.split(new RegExp(separator))[0];
    if (content.startsWith(prefix)) {
      return content.substring(prefix.length);
    }
    return null;
  }
  checkIncludes(msg) {
    const text = msg.content;
    if (!text) return;
    const icds = this.$icds;
    const icds_len = icds.length;
    for (let i = 0; i < icds_len; i++) {
      if (icds[i] && icds[i].name) {
        if (text.match(new RegExp("\\b" + icds[i].name + "\\b", "i"))) {
          this.Actions.preformActions(msg, icds[i]);
        } else if (icds[i]._aliases) {
          const aliases = icds[i]._aliases;
          const aliases_len = aliases.length;
          for (let j = 0; j < aliases_len; j++) {
            if (text.match(new RegExp("\\b" + aliases[j] + "\\b", "i"))) {
              this.Actions.preformActions(msg, icds[i]);
              break;
            }
          }
        }
      }
    }
  }

  checkRegExps(msg) {
    const text = msg.content;
    if (!text) return;
    const regx = this.$regx;
    const regx_len = regx.length;
    for (let i = 0; i < regx_len; i++) {
      if (regx[i] && regx[i].name) {
        if (text.match(new RegExp(regx[i].name, "i"))) {
          this.Actions.preformActions(msg, regx[i]);
        } else if (regx[i]._aliases) {
          const aliases = regx[i]._aliases;
          const aliases_len = aliases.length;
          for (let j = 0; j < aliases_len; j++) {
            if (text.match(new RegExp("\\b" + aliases[j] + "\\b", "i"))) {
              this.Actions.preformActions(msg, regx[i]);
              break;
            }
          }
        }
      }
    }
  }
}
