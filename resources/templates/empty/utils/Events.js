import DiscordJS from "discord.js";
const { Client } = DiscordJS;

const data = [
  [],
  [],
  [],
  [],
  ["guildCreate", 0, 0, 1],
  ["guildDelete", 0, 0, 1],
  ["guildMemberAdd", 1, 0, 2],
  ["guildMemberRemove", 1, 0, 2],
  ["channelCreate", 1, 0, 2, true, "arg1.type !== 'text'"],
  ["channelDelete", 1, 0, 2, true, "arg1.type !== 'text'"],
  ["roleCreate", 1, 0, 2],
  ["roleDelete", 1, 0, 2],
  ["guildBanAdd", 3, 0, 1],
  ["guildBanRemove", 3, 0, 1],
  ["channelCreate", 1, 0, 2, true, "arg1.type !== 'voice'"],
  ["channelDelete", 1, 0, 2, true, "arg1.type !== 'voice'"],
  ["emojiCreate", 1, 0, 2],
  ["emojiDelete", 1, 0, 2],
  ["messageDelete", 1, 0, 2, true],
  ["guildUpdate", 1, 3, 3],
  ["guildMemberUpdate", 1, 3, 4],
  ["presenceUpdate", 1, 3, 4],
  ["voiceStateUpdate", 1, 3, 4],
  ["channelUpdate", 1, 3, 4, true],
  ["channelPinsUpdate", 1, 0, 2, true],
  ["roleUpdate", 1, 3, 4],
  ["messageUpdate", 1, 3, 4, true, "arg2.content.length === 0"],
  ["emojiUpdate", 1, 3, 4],
  [],
  [],
  ["messageReactionRemoveAll", 1, 0, 2, true],
  ["guildMemberAvailable", 1, 0, 2],
  ["guildMembersChunk", 1, 0, 3],
  ["guildMemberSpeaking", 1, 3, 2],
  [],
  [],
  ["guildUnavailable", 1, 0, 1],
  ["inviteCreate", 1, 0, 2],
  ["inviteDelete", 1, 0, 2],
  ["webhookUpdate", 1, 0, 1],
];

export default class Events {
  constructor() {
    this.data = data;
    this.$evts = null;
  }

  registerEvents(bot) {
    this.$evts = this.Bot.$evts;
    for (let i = 0; i < this.data.length; i++) {
      const d = this.data[i];
      if (d.length > 0 && this.$evts[String(i)]) {
        bot.on(
          d[0],
          this.callEvents.bind(this, String(i), d[1], d[2], d[3], !!d[4], d[5])
        );
      }
    }
    if (this.$evts["28"])
      bot.on("messageReactionAdd", this.onReaction.bind(this, "28"));
    if (this.$evts["29"])
      bot.on("messageReactionRemove", this.onReaction.bind(this, "29"));
    if (this.$evts["34"]) bot.on("typingStart", this.onTyping.bind(this, "34"));
    if (this.$evts["35"]) bot.on("typingStop", this.onTyping.bind(this, "35"));
  }

  callEvents(id, temp1, temp2, server, mustServe, condition, arg1, arg2) {
    if (mustServe) {
      if (temp1 > 0 && !arg1.guild) return;
      if (temp2 > 0 && !arg2.guild) return;
    }
    if (condition && eval(condition)) return;
    const events = this.$evts[id];
    if (!events) return;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const temp = {};
      if (event.temp) temp[event.temp] = this.getObject(temp1, arg1, arg2);
      if (event.temp2) temp[event.temp2] = this.getObject(temp2, arg1, arg2);
      this.Actions.invokeEvent(event, this.getObject(server, arg1, arg2), temp);
    }
  }

  getObject(id, arg1, arg2) {
    switch (id) {
      case 1:
        return arg1;
      case 2:
        return arg1.guild;
      case 3:
        return arg2;
      case 4:
        return arg2.guild;
    }
    return undefined;
  }

  /**
   * @param {Client} bot
   */
  onInitialization(bot, isNew) {
    const events = this.$evts["1"];
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const temp = {};
      const servers = Array.from(bot.guilds.cache.values());
      for (let i = 0; i < servers.length; i++) {
        const server = servers[i];
        if (server) {
          this.Actions.invokeEvent(event, server, temp);
        }
      }
    }
  }

  setupIntervals(bot) {
    const events = this.$evts["3"];
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const temp = {};
      const time = event.temp ? parseFloat(event.temp) : 60;
      bot.setInterval(
        function () {
          const servers = bot.guilds.cache.values();
          for (let i = 0; i < servers.length; i++) {
            const server = servers[i];
            if (server) {
              this.Actions.invokeEvent(event, server, temp);
            }
          }
        }.bind(this),
        time * 1000
      );
    }
  }

  onReaction(id, reaction, user) {
    const events = this.$evts[id];
    if (!events) return;
    if (!reaction.message || !reaction.message.guild) return;
    const server = reaction.message.guild;
    const member = server.member(user);
    if (!member) return;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const temp = {};
      if (event.temp) temp[event.temp] = reaction;
      if (event.temp2) temp[event.temp2] = member;
      this.Actions.invokeEvent(event, server, temp);
    }
  }

  onTyping(id, channel, user) {
    const events = this.$evts[id];
    if (!events) return;
    if (!channel.guild) return;
    const server = channel.guild;
    const member = server.member(user);
    if (!member) return;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const temp = {};
      if (event.temp) temp[event.temp] = channel;
      if (event.temp2) temp[event.temp2] = member;
      this.Actions.invokeEvent(event, server, temp);
    }
  }

  onError(text, text2, cache) {
    const events = this.$evts["37"];
    if (!events) return;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const temp = {};
      if (event.temp) temp[event.temp] = text;
      if (event.temp2) temp[event.temp2] = text2;
      this.Actions.invokeEvent(event, cache.server, temp);
    }
  }
}
