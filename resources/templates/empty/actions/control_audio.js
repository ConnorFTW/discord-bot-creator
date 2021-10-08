export default {
  name: "Control Audio",
  section: "Audio Control",
  fields: ["action"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const Audio = this.getDBM().Audio;
    const server = cache.server;
    const player = Audio.players[server?.id];

    if (!server) {
      this.displayError(data, cache, "Couldn't find the server.");
      this.callNextAction(cache);
      return;
    }

    if (!player) {
      this.displayError(data, cache, "Couldn't find the player.");
      this.callNextAction(cache);
      return;
    }

    const action = parseInt(data.action);

    switch (action) {
      case 0:
        player._forceEnd = true;
        player.stop();
        
        break;
      case 1:
        player.pause();
        break;
      case 2:
        player.unpause();
        break;
    }

    this.callNextAction(cache);
  },

  mod: function () {},
};
