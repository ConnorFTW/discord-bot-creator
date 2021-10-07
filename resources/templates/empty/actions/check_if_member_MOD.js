export default {
  name: "Check If Member",
  section: "Conditions",

  fields: [
    "member",
    "varName",
    "info",
    "varName2",
    "iftrue",
    "iftrueVal",
    "iffalse",
    "iffalseVal",
  ],

  /** @this {import("../utils/Actions.js").default} */
  async action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.member, 10);
    const varName = this.evalMessage(data.varName, cache);
    const member = this.getMember(type, varName, cache);
    const info = parseInt(data.info, 10);
    const { Files } = this.getDBM();
    const { msg } = cache;

    let result = false;
    switch (info) {
      case 0:
        result = this.dest(member.user, "bot") || member.bot;
        break;
      case 1:
        result = member.bannable;
        break;
      case 2:
        result = member.kickable;
        break;
      case 3:
        result = Boolean(this.dest(member.voice, "speaking"));
        break;
      case 4:
        result = Boolean(this.dest(member.voice, "channel"));
        break;
      case 5:
        result = member.manageable;
        break;
      case 6: {
        const fs = (await import("fs")).default;
        const filePath = (await import("path")).default.join(
          process.cwd(),
          "data",
          "multiple_bot_owners.json"
        );
        result = !fs.existsSync(filePath) ? member.id === Files.data.settings.ownerId : JSON.parse(fs.readFileSync(filePath, "utf8")).includes(member.id) ||
            member.id === Files.data.settings.ownerId;
        break;
      }
      case 7:
        result = Boolean(this.dest(member.voice, "mute"));
        break;
      case 8:
        result = Boolean(this.dest(member.voice, "deaf"));
        break;
      case 9:
        result = member.id === msg.author.id;
        break;
      case 10:
        result = member.id === msg.guild.ownerID;
        break;
      default:
        console.log(
          'Please check your "Check if Member" action! There is something wrong...'
        );
        break;
    }
    this.executeResults(result, data, cache);
  },
};
