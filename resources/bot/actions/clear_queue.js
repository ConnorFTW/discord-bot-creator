export default {
  name: "Clear Queue",

  section: "Audio Control",

  subtitle: function (data) {
    return "The queue is cleared.";
  },

  fields: [],

  html: function (isEvent, data) {
    return "";
  },

  init: function () {},

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const Audio = this.getDBM().Audio;
    const server = cache.server;
    if (server) {
      Audio.queue[server.id] = [];
    }
    this.callNextAction(cache);
  },

  mod: function () {},
};
