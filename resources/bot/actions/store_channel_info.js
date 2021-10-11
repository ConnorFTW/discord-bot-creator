export default {
  name: "Store Channel Info",

  section: "Channel Control",

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    const info = parseInt(data.info);
    let dataType = "Unknown Type";
    switch (info) {
      case 0:
        dataType = "Channel";
        break;
      case 1:
        dataType = "Channel ID";
        break;
      case 2:
      case 3:
        dataType = "Text";
        break;
      case 4:
        dataType = "Message";
        break;
      case 5:
        dataType = "Number";
        break;
      case 6:
      case 7:
      case 8:
        dataType = "Boolean";
        break;
      case 10:
        dataType = "Category ID";
        break;
      case 11:
        dataType = "Date";
        break;
      case 12:
        dataType = "Timestamp";
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ["channel", "varName", "info", "storage", "varName2"],

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const DiscordJS = this.getDBM().DiscordJS;
    const channel = parseInt(data.channel);
    const varName = this.evalMessage(data.varName, cache);
    const info = parseInt(data.info);
    /** @type {TextChannel} */
    const targetChannel = this.getChannel(channel, varName, cache);
    if (!targetChannel) {
      this.callNextAction(cache);
      return;
    }
    let result;
    switch (info) {
      case 0:
        result = targetChannel;
        break;
      case 1:
        result = targetChannel.id;
        break;
      case 2:
        result = targetChannel.name;
        break;
      case 3:
        result = targetChannel.topic;
        break;
      case 5:
        result = targetChannel.position;
        break;
      case 6:
        result = targetChannel.nsfw;
        break;
      case 7:
        result = targetChannel instanceof DiscordJS.DMChannel;
        break;
      case 8:
        result = targetChannel.deletable;
        break;
      case 9:
      case 11:
        result = targetChannel.createdAt;
        break;
      case 10:
        result = targetChannel.parentID;
        break;
      case 12:
        result = targetChannel.createdTimestamp;
        break;
      default:
        break;
    }
    if (info === 4) {
      targetChannel.messages
        .fetch(targetChannel.lastMessageID)
        .then(
          function (resultMessage) {
            const storage = parseInt(data.storage);
            const varName2 = this.evalMessage(data.varName2, cache);
            this.storeValue(resultMessage, storage, varName2, cache);
            this.callNextAction(cache);
          }.bind(this)
        )
        .catch(this.displayError.bind(this, data, cache));
    } else if (result !== undefined) {
      const storage = parseInt(data.storage);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
      this.callNextAction(cache);
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function () {},
};
