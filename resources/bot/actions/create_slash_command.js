const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const clientId = '123456789012345678';
const guildId = '876543210987654321';
const token = 'sxsxscd'

export default {
    name: "Create Slash Command",

    section: "Bot Commands",

    fields: ["nameField", "description", "options"],

    action(cache) {
        const data = cache.actions[cache.index];
        const name = this.evalMessage(data.nameField, cache);
        const description = this.evalMessage(data.description, cache);
        const options = this.evalMessage(data.options, cache);

        if (!name) return this.callNextAction(cache);

        let command = new SlashCommandBuilder()
            .setName(name)
            .setDescription(description)

        options.forEach(element => {
            command = command.addStringOption(option =>
                option.setName(element.name)
                    .setDescription(element.description)
                    .setRequired(element.required))
        });

        const rest = new REST({ version: '9' }).setToken(token);

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');

                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: command },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();

    }
}