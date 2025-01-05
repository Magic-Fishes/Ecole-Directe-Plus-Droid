const jsonConfig = require("../../config.json");
const { MessageFlags } = require("discord.js");

const handleCommandsPermissions = async (Client, interaction) => {
    if (!interaction.isCommand()) return;
    const command = Client.commands.get(interaction.commandName);
    if (!command) return;

    if (!command.restricted) {
        try {
            return await command.runSlash(Client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content:
                    "Une erreur est survenue lors de l'exécution de la commande.",
                flags: MessageFlags.Ephemeral,
            });
        }
    }

    const isBotDev = jsonConfig.bot_devs.includes(interaction.member.id); // mega op person
    const hasModRole = interaction.member.roles.cache.some((role) =>
        jsonConfig.mod_role.includes(role.id)
    );

    if (!hasModRole && !isBotDev) {
        console.log(
            "[PERMISSIONS] - Utilisateur non autorisé à exécuter la commande."
        );

        return interaction.reply({
            content:
                ":x: Vous n'avez pas les permissions nécessaires pour utiliser cette commande.",
            flags: MessageFlags.Ephemeral,
        });
    }
    try {
        await command.runSlash(Client, interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content:
                "Une erreur est survenue lors de l'exécution de la commande.",
            flags: MessageFlags.Ephemeral,
        });
    }
};

const handleComponents = async (Client, interaction) => {
    if (interaction.isButton()) {
        const button = Client.buttons.get(interaction.customId);
        // console.log(Client.buttons);
        // console.log(Client.selects);
        if (!button) return interaction.reply("Ce bouton n'existe pas");
        button.runInteraction(Client, interaction);
    } else if (interaction.isStringSelectMenu()) {
        // console.log(Client.buttons);
        // console.log(Client.selects);
        const select = Client.selects.get(interaction.customId);
        if (!select)
            return interaction.reply("Ce menu de séléction n'existe pas");

        select.runInteraction(Client, interaction);
    }
};

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(Client, interaction) {
        await handleCommandsPermissions(Client, interaction);
        await handleComponents(Client, interaction);
    },
};
