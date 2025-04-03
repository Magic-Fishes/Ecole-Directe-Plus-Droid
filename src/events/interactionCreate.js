const jsonConfig = require("../../config.json");
const { MessageFlags } = require("discord.js");
const logger = require("../helpers/logger");
const { handleButtonClick } = require("../commands/setup-ticket"); // Importer la logique du bouton de création de ticket

const handleCommandsPermissions = async (Client, interaction) => {
    if (!interaction.isCommand()) return;
    const command = Client.commands.get(interaction.commandName);
    if (!command) return;

    if (!command.restricted) {
        try {
            return await command.runSlash(Client, interaction);
        } catch (error) {
            logger.error(error);
            await interaction.reply({
                content:
                    "Une erreur est survenue lors de l'exécution de la commande. Inscrit dans les logs",
                flags: MessageFlags.Ephemeral,
            });
        }
    }

    const isBotDev = jsonConfig.bot_devs.includes(interaction.member.id); // mega op person
    const hasModRole = interaction.member.roles.cache.some((role) =>
        jsonConfig.mod_role.includes(role.id)
    );

    if (!hasModRole && !isBotDev) {
        return interaction.reply({
            content:
                "❌ Vous n'avez pas les permissions nécessaires pour utiliser cette commande.",
            flags: MessageFlags.Ephemeral,
        });
    }
    try {
        await command.runSlash(Client, interaction);
    } catch (error) {
        logger.error(error);
        await interaction.reply({
            content:
                "Une erreur est survenue lors de l'exécution de la commande. Inscrit dans les logs",
            flags: MessageFlags.Ephemeral,
        });
    }
};

const handleComponents = async (Client, interaction) => {
    if (interaction.isButton()) {
        // Gérer les interactions des boutons
        if (interaction.customId === 'create-ticket') {
            // Appeler la fonction de gestion du bouton pour créer un ticket
            await handleButtonClick(interaction);  // Assure-toi que cette fonction est correctement définie dans ton fichier de gestion des tickets
        } else {
            const button = Client.buttons.get(interaction.customId);
            if (!button) return interaction.reply("Ce bouton n'existe pas");
            button.runInteraction(Client, interaction);
        }
    } else if (interaction.isStringSelectMenu()) {
        const select = Client.selects.get(interaction.customId);
        if (!select)
            return interaction.reply("Ce menu de sélection n'existe pas");

        select.runInteraction(Client, interaction);
    }
};

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(Client, interaction) {
        if (interaction.isCommand()) {
            await handleCommandsPermissions(Client, interaction);
        } else {
            await handleComponents(Client, interaction);
        }
    },
};
