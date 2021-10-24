export default {
  name: 'Send Message',
  section: 'Messaging',
  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return
    return [data.varName2, 'Message']
  },

  fields: [
    'channel',
    'varName',
    'message',
    'storage',
    'varName2',
    'iffalse',
    'iffalseVal',
  ],

  /** @this {import("../utils/Actions.js").default} */
  async action(cache) {
    const data = cache.actions[cache.index]
    const channel = parseInt(data.channel, 10)
    const varName = this.evalMessage(data.varName, cache)
    const target = this.getSendTarget(channel, varName, cache)
    const { message } = data
    const { MessageActionRow, MessageButton } = (await import('discord.js')).default;
    //const { MessageActionRow, MessageButton } = require('discord.js')

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('primary')
        .setLabel('Primary')
        .setStyle('PRIMARY')
    )

    if (!target) {
      this.displayError(data, cache, 'You have to select a target channel')
      this.callNextAction(cache)
      return
    }

    if (!message) {
      this.displayError(data, cache, 'You have to enter a message')
      this.callNextAction(cache)
      return
    }

    if (Array.isArray(target)) {
      this.callListFunc(target, 'send', [
        this.evalMessage(message, cache),
      ]).then(msg => {
        const varName2 = this.evalMessage(data.varName2, cache)
        const storage = parseInt(data.storage, 10)
        this.storeValue(msg, storage, varName2, cache)
        this.callNextAction(cache)
      })
    } else if (target && target.send) {
      target
        .send({ content: this.evalMessage(message, cache), components: [row] })
        .then(msg => {
          const varName2 = this.evalMessage(data.varName2, cache)
          const storage = parseInt(data.storage, 10)
          this.storeValue(msg, storage, varName2, cache)
          this.callNextAction(cache)
        })
        .catch(() => {
          this.displayError(data, cache, 'Failed to send message')
          this.executeResults(false, data, cache)
        })
    } else {
      this.displayError(data, cache, 'Text Channel not found')
      this.callNextAction(cache)
    }
  },
}
