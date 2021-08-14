export default {
  name: "Join Voice Channel",
  section: "Audio Control",
  fields: ["channel", "varName"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const Audio = this.getDBM().Audio;
    const type = parseInt(data.channel);
    const varName = this.evalMessage(data.varName, cache);
    const channel = this.getVoiceChannel(type, varName, cache);
    if (channel !== undefined) {
      Audio.connectToVoice(channel).then(() => this.callNextAction(cache));
    } else {
      this.displayError(data, cache, "Voice Channel does not exist");
      this.callNextAction(cache);
    }
  },

  requiresAudioLibraries: true,

  mod: function () {},
};
