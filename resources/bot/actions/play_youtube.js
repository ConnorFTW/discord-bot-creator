export default {
  name: "Play YouTube Video",
  section: "Audio Control",

  requiresAudioLibraries: true,

  fields: ["url", "seek", "volume", "passes", "bitrate", "type"],
  init() {},

  /** @this {import("../utils/Actions.js").default} */
  async action(cache) {
    const data = cache.actions[cache.index];
    const { Audio } = this.getDBM();
    const Mods = this.getMods();
    /** @type {import("discordi").default} */
    const youtubei = await Mods.require("youtubei");
    console.log(youtubei, youtubei.Client);
    console.log(Object.keys(youtubei));
    const youtube = new youtubei.Client();
    const url = this.evalMessage(data.url, cache);
    const { msg } = cache;
    const options = {};

    if (url) {
      if (data.seek) {
        options.seek = parseInt(this.evalMessage(data.seek, cache), 10);
      }
      if (data.volume) {
        options.volume =
          parseInt(this.evalMessage(data.volume, cache), 10) / 100;
      } else if (cache.server) {
        options.volume = Audio.volumes[cache.server.id] || 0.5;
      } else {
        options.volume = 0.5;
      }
      if (data.passes) {
        options.passes = parseInt(this.evalMessage(data.passes, cache), 10);
      }
      if (data.bitrate) {
        options.bitrate = parseInt(this.evalMessage(data.bitrate, cache), 10);
      } else {
        options.bitrate = "auto";
      }
      if (msg) options.requester = msg.author;

      try {
        const video = await youtube.getVideo(url);

        options.title = video.title;
        options.duration = video.duration;
        options.thumbnail = video.thumbnails[video.thumbnails.length - 1].url;

        const info = ["yt", options, url];
        if (data.type === "0") {
          Audio.addToQueue(info, cache);
        } else if (cache.server && cache.server.id !== undefined) {
          Audio.playItem(info, cache.server.id);
        } else {
          this.displayError(
            data,
            cache,
            "Could not determine the server to play on."
          );
        }
      } catch (err) {
        return this.displayError(data, cache, err);
      }
    } else {
      return this.displayError(data, cache, "URL Missing");
    }

    this.callNextAction(cache);
  },

  mod() {},
};
