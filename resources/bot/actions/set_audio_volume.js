export default {
  name: "Set Audio Volume",

  section: "Audio Control",

  subtitle: function (data) {
    return `Set Volume to ${data.volume}`;
  },

  fields: ["volume"],

  html: function (isEvent, data) {
    return `
<div style="float: left; width: 80%;">
	Volume (0 = min; 100 = max):<br>
	<input id="volume" class="round" value="50">
</div>`;
  },

  init: function () {},

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const Audio = this.getDBM().Audio;
    const server = cache.server;
    if (server) {
      const volume = parseInt(this.evalMessage(data.volume, cache)) / 100;
      Audio.setVolume(volume, cache);
    }
    this.callNextAction(cache);
  },

  mod: function () {},
};
