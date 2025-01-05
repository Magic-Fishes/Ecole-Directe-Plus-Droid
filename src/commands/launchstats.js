const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    command: new SlashCommandBuilder()
        .setName("launchstats")
        .setDescription("Lancer des statistiques")
        .toJSON(),
    restricted: true,

    runSlash: async (_, interaction) => {
        await interaction.reply("Démarrer le lancement des statistiques");
        await interaction.editReply("lancement en cours...");
    },
};
