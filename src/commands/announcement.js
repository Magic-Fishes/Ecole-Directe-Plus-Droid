const {
    EmbedBuilder,
    MessageFlags,
    SlashCommandBuilder,
} = require("discord.js");

module.exports = {
    command: new SlashCommandBuilder()
        .setName("announcement")
        .setDescription("Faire une annonce (sous forme d'embed)")
        .addStringOption((opt) =>
            opt
                .setName("titre")
                .setDescription("Titre de l'annonce")
                .setRequired(true)
        )
        .addStringOption((opt) =>
            opt
                .setName("description")
                .setDescription("Description de l'annonce")
                .setRequired(true)
        )
        .addBooleanOption((opt) =>
            opt
                .setName("anonyme")
                .setDescription("Faut-il vous annoncer ?")
                .setRequired(true)
        )
        .addStringOption((opt) =>
            opt
                .setName("couleur")
                .setDescription("Couleur de l'embed (défaut bleu)")
                .setChoices([
                    {
                        name: "Rouge foncé",
                        value: "#AA0000",
                    },
                    {
                        name: "Rouge",
                        value: "#FF5555",
                    },
                    {
                        name: "Doré",
                        value: "#FFAA00",
                    },
                    {
                        name: "Jaune",
                        value: "#FFFF55",
                    },
                    {
                        name: "Vert foncé",
                        value: "#00AA00",
                    },
                    {
                        name: "Vert",
                        value: "#55FF55",
                    },
                    {
                        name: "Bleu Clair",
                        value: "#55FFFF",
                    },
                    {
                        name: "Bleu Sombre",
                        value: "#00AAAA",
                    },
                    {
                        name: "Bleu foncé",
                        value: "#0000AA",
                    },
                    {
                        name: "Bleu",
                        value: "#5555FF",
                    },
                    {
                        name: "Violet Clair",
                        value: "#FF55FF",
                    },
                    {
                        name: "Violet foncé",
                        value: "#AA00AA",
                    },
                    {
                        name: "Blanc",
                        value: "#FFFFFF",
                    },
                    {
                        name: "Gris",
                        value: "#AAAAAA",
                    },
                    {
                        name: "Gris foncé",
                        value: "#555555",
                    },
                    {
                        name: "Noir",
                        value: "#000000",
                    },
                ])
                .setRequired(false)
        )
        .toJSON(),
    restricted: true,

    runSlash: async (client, interaction) => {
        let user = {
            username: null,
            displayAvatarURL: null,
        };

        if (!interaction.options.getBoolean("anonyme")) {
            user.username = interaction.user.username;
            user.displayAvatarURL = interaction.user.displayAvatarURL();
        } else {
            user.username = "Ecole Directe Plus";
            user.displayAvatarURL =
                "https://pbs.twimg.com/profile_images/1680302515097673729/x1cHA0q5_400x400.png";
        }

        const announcementEmbedContent = {
            title: interaction.options.getString("titre"),
            description: interaction.options.getString("description"),
            color: interaction.options.getString("couleur") || "#5555FF",
            author: {
                name: user.username,
                iconUrl: user.displayAvatarURL,
            },
        };

        const announcementEmbed = new EmbedBuilder()
            .setTitle(announcementEmbedContent.title)
            .setDescription(announcementEmbedContent.description)
            .setColor(announcementEmbedContent.color)
            .setAuthor({
                name: announcementEmbedContent.author.name,
                iconURL: announcementEmbedContent.author.iconUrl,
            });

        console.log(
            `[ANNOUNCEMENT] - Annonce de ${user.username} : "${announcementEmbedContent.title}", envoyée avec succès.`
        );
        await interaction.channel.send({ embeds: [announcementEmbed] });
        await interaction.reply({
            content: "Annonce envoyée avec succès.",
            flags: MessageFlags.Ephemeral,
        });
    },
};
