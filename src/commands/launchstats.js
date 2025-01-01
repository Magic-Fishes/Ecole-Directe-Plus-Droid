const permissions = require("../utils/permissions");

module.exports = {
    name: "launchstats",
    description: "Lancer des statistiques",
    options: [],
    runSlash: async (_, interaction) => {
        if (!permissions.isAllowed(interaction)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'exécuter cette commande.", ephemeral: true });
        }
        
        await interaction.reply("Démarrer le lancement des statistiques");
        await interaction.editReply("lancement en cours...");
    },
};
