const itemList = [
  { name: "Volume (1-100)", type: "Number" },
  { name: "Is Playing", type: "Boolean" },
  { name: "Start Time (Seconds)", type: "Seconds" },
  { name: "Queue URL List", type: "List" },
  { name: "Next Song URL In Queue", type: "Url" },
  { name: "Queue Length", type: "Number" },
  { name: "Bitrate", type: "Number" },
  { name: "This option was removed", type: "null" },
  { name: "Current Seek Position (Seconds)", type: "Seconds" },
  { name: "Current Song URL", type: "Url" },
  { name: "Requester of Next Song URL", type: "User" },
  { name: "Requester of Current Song URL", type: "User" },
  { name: "Title of Next Song URL", type: "Title String" },
  { name: "Title of Current Song URL", type: "Title String" },
  { name: "Duration of Current Song URL", type: "Duration" },
  { name: "Current Song Thumbnail URL", type: "Url" },
];

export default {
  name: "Store Audio Info",
  section: "Audio Control",

  fields: ["server", "info", "storage", "varName", "varName2"],

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [
      data.varName,
      itemList[parseInt(data.info, 10)].type || "Unknown Type",
    ];
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const server = parseInt(data.server, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    const TimeFormat = this.getMods().require("hh-mm-ss");
    const info = parseInt(data.info, 10);
    const { Audio } = this.getDBM();
    const targetServer = this.getServer(server, varName2, cache);

    if (!targetServer || !Audio) return this.callNextAction(cache);

    let result;
    switch (info) {
      case 0:
        result =
          (Audio.volumes[targetServer.id] &&
            parseInt(Audio.volumes[targetServer.id], 10) * 100) ||
          50; // volume
        break;
      case 1:
        result = Boolean(Audio.players[targetServer.id]); // is playing
        break;
      case 2:
        result = this.dest(Audio.players[targetServer.id], "startTime") || 0; // when the music first started playing
        break;
      case 3:
        result =
          Audio.queue[targetServer.id] &&
          Audio.queue[targetServer.id].map((q) => q[2]); // the queue list
        break;
      case 4:
        result =
          Audio.queue[targetServer.id] &&
          Audio.queue[targetServer.id].map((q) => q[2])[0]; // next item in queue
        break;
      case 5:
        result = this.dest(Audio.queue[targetServer.id], "length"); // queue length
        break;
      case 6:
        result =
          this.dest(
            Audio.players[targetServer.id],
            "streams",
            "opus",
            "_options",
            "rate"
          ) || 0; // bitrate
        break;
      case 8:
        result =
          this.dest(
            Audio.players[targetServer.id],
            "player",
            "streamingData",
            "timestamp"
          ) || 0; // seek position
        break;
      case 9:
        result = this.dest(Audio.playingnow[targetServer.id], 2); // Current song url
        break;
      case 10:
        result =
          Audio.queue[targetServer.id] &&
          Audio.queue[targetServer.id].map((q) => q[1])[0].requester; // Requested person of next song in queue
        break;
      case 11:
        result = this.dest(Audio.playingnow[targetServer.id], 1, "requester"); // Requested person of current song
        break;
      case 12:
        result =
          Audio.queue[targetServer.id] &&
          Audio.queue[targetServer.id].map((q) => q[1])[0].title; // Title of next song in queue
        break;
      case 13:
        result = this.dest(Audio.playingnow[targetServer.id], 1, "title"); // Title of current song
        break;
      case 14:
        result = TimeFormat.fromS(
          this.dest(Audio.playingnow[targetServer.id], 1, "duration")
        ); // Current song duration
        break;
      case 15:
        result = this.dest(Audio.playingnow[targetServer.id], 1, "thumbnail"); // Current Song Thumbnail URL
        break;
      default:
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },
};
