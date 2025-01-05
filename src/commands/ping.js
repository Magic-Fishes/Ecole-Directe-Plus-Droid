const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    command: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Répond avec Pong !")
        .toJSON(),
    restricted: true,
    runSlash: async (client, interaction) => {
        await interaction.reply("Pong!");
    },
};
