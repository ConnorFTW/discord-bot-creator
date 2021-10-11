export default {
  name: "Play File",

  section: "Audio Control",

  requiresAudioLibraries: true,

  subtitle: function (data) {
    return `${data.url}`;
  },

  fields: ["url", "seek", "volume", "passes", "bitrate", "type"],

  html: function (isEvent, data) {
    return `
<div>
	Local URL:<br>
	<input id="url" class="round" type="text" value="resources/"><br>
</div>
<div style="float: left; width: 50%;">
	Seek Position:<br>
	<input id="seek" class="round" type="text" value="0"><br>
	Passes:<br>
	<input id="passes" class="round" type="text" value="1">
</div>
<div style="float: right; width: 50%;">
	Volume (0 = min; 100 = max):<br>
	<input id="volume" class="round" type="text" placeholder="Leave blank for automatic..."><br>
	Bitrate:<br>
	<input id="bitrate" class="round" type="text" placeholder="Leave blank for automatic...">
</div><br><br><br><br><br><br><br>
<div>
	Play Type:<br>
	<select id="type" class="round" style="width: 90%;">
		<option value="0" selected>Add to Queue</option>
		<option value="1">Play Immediately</option>
	</select>
</div>`;
  },

  init: function () {},

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const Audio = this.getDBM().Audio;
    const options = {};
    if (data.seek) {
      options.seek = parseInt(this.evalMessage(data.seek, cache));
    }
    if (data.volume) {
      options.volume = parseInt(this.evalMessage(data.volume, cache)) / 100;
    } else if (cache.server) {
      options.volume = Audio.volumes[cache.server.id] || 0.5;
    } else {
      options.volume = 0.5;
    }
    if (data.passes) {
      options.passes = parseInt(this.evalMessage(data.passes, cache));
    }
    if (data.bitrate) {
      options.bitrate = parseInt(this.evalMessage(data.bitrate, cache));
    } else {
      options.bitrate = "auto";
    }
    const url = this.evalMessage(data.url, cache);
    if (url) {
      const info = ["file", options, url];
      if (data.type === "0") {
        Audio.addToQueue(info, cache);
      } else if (cache.server && cache.server.id !== undefined) {
        Audio.playItem(info, cache.server.id);
      }
    }
    this.callNextAction(cache);
  },

  mod: function () {},
};
