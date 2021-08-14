export default {
  name: "Leave Voice Channel",

  section: "Audio Control",

  subtitle: function (data) {
    return "The bot leaves voice channel.";
  },

  fields: [],

  html: function (isEvent, data) {
    return "";
  },

  init: function () {},

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const server = cache.server;
    if (this.dest(server, "me", "voice", "channel")) {
      server.me.voice.channel.leave();
    }
    this.callNextAction(cache);
  },

  mod: function () {},
};
