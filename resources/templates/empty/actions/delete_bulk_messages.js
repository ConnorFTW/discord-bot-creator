export default {
  name: "Delete Bulk Messages",

  section: "Messaging",

  subtitle: function (data) {
    const channels = [
      "Same Channel",
      "Mentioned Channel",
      "1st Server Channel",
      "Temp Variable",
      "Server Variable",
      "Global Variable",
    ];
    return `Delete ${data.count} messages from ${
      channels[parseInt(data.channel)] || "Nothing"
    }`;
  },

  fields: ["channel", "count", "condition", "custom", "varName"],

  html: function (isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source Channel:<br>
		<select id="channel" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
			${data.channels[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Amount to Delete:<br>
	<input id="count" class="round" type="text" style="width: 90%;"><br>
</div>
<div>
	<div style="float: left; width: 35%;">
		Delete Condition:<br>
		<select id="condition" class="round" onchange="glob.onChange2(this)">
			<option value="0" selected>None</option>
			<option value="1">Has Author</option>
			<option value="2">Custom</option>
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Code:<br>
		<input id="custom" class="round" type="text"><br>
	</div>
</div>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.onChange2 = function (event) {
      const value = parseInt(event.value);
      const varNameInput = document.getElementById("varNameContainer2");
      if (value === 0) {
        varNameInput.style.display = "none";
      } else {
        varNameInput.style.display = null;
      }
    };

    glob.channelChange(document.getElementById("channel"), "varNameContainer");
    glob.onChange2(document.getElementById("condition"));
  },

  /** @this {import("../utils/Actions.js").default} */
  action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    let source;
    const channel = parseInt(data.channel);
    const msg = cache.msg;
    const varName = this.evalMessage(data.varName, cache);
    switch (channel) {
      case 0:
        if (msg) {
          source = msg.channel;
        }
        break;
      case 1:
        if (msg && msg.mentions) {
          source = msg.mentions.channels.first();
        }
        break;
      case 2:
        if (server) {
          source = server.channels.cache.first();
        }
        break;
      case 3:
        source = cache.temp[varName];
        break;
      case 4:
        if (server && this.server[server.id]) {
          source = this.server[server.id][varName];
        }
        break;
      case 5:
        source = this.global[varName];
        break;
    }
    if (this.dest(source, "messages", "fetch")) {
      const count = Math.min(
        parseInt(this.evalMessage(data.count, cache)),
        100
      );
      source.messages
        .fetch({ limit: count, before: msg.id })
        .then(
          function (messages) {
            const condition = parseInt(data.condition);
            if (condition === 1) {
              let author;
              try {
                author = this.eval(data.custom, cache);
              } catch (e) {
                this.displayError(data, cache, e);
                author = null;
              }
              if (author) {
                messages = messages.filter((m) => m.author.id === author.id);
              }
            } else if (condition === 2) {
              const cond = data.custom;
              messages = messages.filter(function (message) {
                let result = false;
                try {
                  result = !!this.eval(cond, cache);
                } catch {}
                return result;
              }, this);
            }
            source
              .bulkDelete(messages)
              .then(() => this.callNextAction(cache))
              .catch(this.displayError.bind(this, data, cache));
          }.bind(this)
        )
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod: function (DBM) {},
};
