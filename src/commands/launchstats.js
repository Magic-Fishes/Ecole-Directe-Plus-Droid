module.exports = {
    name: "launchstats",
    description: "Lancer des statistiques",
    options: [],
    runSlash: async (_, interaction) => {
        await interaction.reply("Démarrer le lancement des statistiques");
        await interaction.editReply("lancement en cours...");
    },
};
