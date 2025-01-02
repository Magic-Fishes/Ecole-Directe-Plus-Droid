const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

module.exports = {
    name: "clear",
    description:
        "Supprime des messages dans le salon, optionnellement pour un utilisateur spécifique.",
    options: [
        {
            name: "amount",
            type: ApplicationCommandOptionType.Integer,
            description:
                "Le nombre de messages à supprimer (1-100). Laissez vide pour tout supprimer.",
            required: false,
        },
        {
            name: "user",
            type: ApplicationCommandOptionType.User,
            description:
                "L'utilisateur dont les messages doivent être supprimés.",
            required: false,
        },
    ],
    restricted: true,

    runSlash: async (_, interaction) => {
        const amount = interaction.options.getInteger("amount");
        const user = interaction.options.getUser("user");

        try {
            if (user) {
                const fetchedMessages =
                    await interaction.channel.messages.fetch({
                        limit: amount || 100,
                    });
                const userMessages = fetchedMessages.filter(
                    (msg) => msg.author.id === user.id
                );

                if (userMessages.size === 0) {
                    return interaction.reply({
                        content: `Aucun message trouvé pour l'utilisateur ${user.tag}.`,
                        flags: MessageFlags.Ephemeral,
                    });
                }

                await interaction.channel.bulkDelete(userMessages, true);
                return interaction.reply({
                    content: `✅ ${userMessages.size} message(s) supprimé(s) de l'utilisateur ${user.globalName}.`,
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                const messagesToDelete = amount || 100;

                if (messagesToDelete < 1 || messagesToDelete > 100) {
                    return interaction.reply({
                        content:
                            "Vous devez spécifier un nombre entre 1 et 100.",
                        flags: MessageFlags.Ephemeral,
                    });
                }

                const deletedMessages = await interaction.channel.bulkDelete(
                    messagesToDelete,
                    true
                );
                return interaction.reply({
                    content: `✅ ${deletedMessages.size} message(s) supprimé(s).`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content:
                    "Une erreur est survenue lors de la suppression des messages.",
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};

