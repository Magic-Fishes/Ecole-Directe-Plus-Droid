const logger = require("../helpers/logger");

module.exports = {
    name: "launchstats",
    description: "Lancer des statistiques",
    options: [],
    restricted: true,

    runSlash: async (_, interaction) => {
        await interaction.reply("Démarrer le lancement des statistiques");
        await interaction.editReply("lancement en cours...");
        logger.info("statistics command was called");
    },
};

