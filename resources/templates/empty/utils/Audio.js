import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection,
} from "@discordjs/voice";
import ytdl from "ytdl-core";

export default class Audio {
  constructor() {
    this.queue = [];
    /** @type {{ [key:string]: AudioResource } */
    this.resource = {};
    this.volumes = [];
    /** @type { VoiceConnection[] } */
    this.connections = [];
    /** @type { AudioPlayer[] } */
    this.players = [];

    this.playingnow = [];
    this.loopQueue = {};
    this.loopItem = {};
  }

  async init() {
    this.ytdl = this.ytdl || (await import("ytdl-core")).default;
  }
  isConnected(cache) {
    if (!cache.server) return false;
    const id = cache.server.id;
    return this.connections[id];
  }

  isPlaying(cache) {
    if (!cache.server) return false;
    const id = cache.server.id;
    return this.players[id];
  }

  setVolume(volume, cache) {
    if (!cache.server) {
      throw new Error("Cannot set volume. Server not found.");
    }

    const id = cache.server.id;
    const player = this.players[id];
    if (!player) throw new Error("Could not find player, to set the volume.");
    this.volumes[id] = volume;
    this.resource[id].volume.setVolume(volume);
    player.setVolumeLogarithmic(volume);
  }

  async connectToVoice(voiceChannel) {
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      selfDeaf: true,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    this.connections[voiceChannel.guild.id] = connection;
    connection.on(
      "disconnect",
      function () {
        this.connections[voiceChannel.guild.id] = null;
        this.volumes[voiceChannel.guild.id] = null;
      }.bind(this)
    );

    return connection;
  }

  addToQueue(item, cache) {
    if (!cache.server) {
      throw new Error(
        "Cannot figure out in which server this command was used."
      );
    }
    const { id } = cache.server;
    if (!this.queue[id]) {
      this.queue[id] = [];
      this.loopQueue[id] = false;
      this.loopItem[id] = false;
    }
    this.queue[id].push(item);
    this.playNext(id);
  }

  clearQueue(cache) {
    if (!cache.server) return;
    const id = cache.server.id;
    this.queue[id] = [];
  }

  /**
   * @param { string } id The server id
   * @param { boolean } forceSkip
   */
  playNext(id, forceSkip) {
    if (!this.connections[id]) {
      this.loopQueue[id] = false;
      this.loopItem[id] = false;
      return;
    }

    if (this.players[id] && !forceSkip) return;

    if (this.loopItem[id] === true) {
      const item = this.playingnow[id];
      this.playItem(item, id);
    } else if (this.loopQueue[id] === true) {
      const currentItem = this.playingnow[id];
      this.queue[id].push(currentItem);
      const nextItem = this.queue[id].shift();
      this.playItem(nextItem, id);
    } else if (this.queue[id] && this.queue[id].length > 0) {
      const item = this.queue[id].shift();
      this.playItem(item, id);
    } else {
      this.loopQueue[id] = false;
      this.loopItem[id] = false;
      this.connections[id].disconnect();
    }
  }

  playItem(item, id) {
    if (!this.connections[id]) {
      throw new Error("No connection to voice channel.");
    }
    if (this.players[id]) {
      this.players[id]._forceEnd = true;
      this.players[id].stop();
    }

    const type = item[0];
    let setupPlayer = false;

    switch (type) {
      case "file":
        setupPlayer = this.playFile(item[2], item[1], id);
        this.playingnow[id] = item;
        break;
      case "url":
        setupPlayer = this.playUrl(item[2], item[1], id);
        this.playingnow[id] = item;
        break;
      case "yt":
        setupPlayer = this.playYt(item[2], item[1], id);
        this.playingnow[id] = item;
        break;
    }

    if (setupPlayer && !this.players[id]._eventSetup) {
      player.on(AudioPlayerStatus.Idle, () => {
        const isForced = this.players[id]._forceEnd;
        this.players[id] = null;
        if (!isForced) this.playNext(id);
      });
      this.players[id]._eventSetup = true;
    } else {
      throw new Error("Bot is not connected to voice channel.");
    }
  }

  playFile(url, options, id) {
    this.players[id] = this.connections[id];

    const path = this.Actions.getLocalFile(url);
    const resource = createAudioResource(path, { inlineVolume: true });
    this.resource[id] = resource;

    if (this.players[id].playable) {
      this.players[id].play(resource);
    } else {
      const player = createAudioPlayer(resource);
      this.players[id] = player;
      this.connections[id].subscribe(player);
    }
    return true;
  }

  playUrl(url, options, id) {
    const resource = createAudioResource(url, { inlineVolume: true });
    const player = createAudioPlayer(resource);
    this.players[id] = player;
    this.resource[id] = resource;

    player.play(resource);
    this.connections[id].subscribe(player);

    return true;
  }

  async playYt(url, options, id) {
    if (!this.ytdl) throw new Error("ytdl not found.");
    const stream = ytdl(url, {
      filter: "audioonly",
    });

    const resource = createAudioResource(stream, { inlineVolume: true });
    const player = createAudioPlayer();
    this.players[id] = player;
    this.resource[id] = resource;

    player.play(resource);
    this.connections[id].subscribe(player);

    return true;
  }
}
