const { EmbedBuilder } = require("discord.js");
const permissions = require("../utils/permissions");

module.exports = {
    name: "announcement",
    description: "Faire une annonce (sous forme d'embed)",
    options: [
        {
            name: "titre",
            description: "titre de l'annonce",
            type: 3,
            required: true,
        },
        {
            name: "description",
            description: "description de l'annonce",
            type: 3,
            required: true,
        },
        {
            name: "auteur",
            description: "Faut-il vous annoncer ?",
            type: 5,
            required: true,
        },
        {
            name: "couleur",
            description: "couleur de l'embed (défaut bleu)",
            type: 3,
            required: false,
        }
    ],

    runSlash: async (client, interaction) => {
        if (!permissions.isAllowed(interaction)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'exécuter cette commande.", ephemeral: true });
        }
        
        let user = {
            username: null,
            displayAvatarURL: null,
        };

        if (interaction.options.getBoolean("auteur")) {
            user.username = interaction.user.username;
            user.displayAvatarURL = interaction.user.displayAvatarURL();
        } else {
            user.username = "Ecole Directe Plus";
            user.displayAvatarURL = "https://pbs.twimg.com/profile_images/1680302515097673729/x1cHA0q5_400x400.png";
        }

        const announcementEmbedContent = {
            title: interaction.options.getString("titre"),
            description: interaction.options.getString("description"),
            color: interaction.options.getString("couleur") || "#0000FF",
            author: {
                name: user.username,
                iconUrl: user. displayAvatarURL,
            }
        };

        const announcementEmbed = new EmbedBuilder()
            .setTitle(announcementEmbedContent.title)
            .setDescription(announcementEmbedContent.description)
            .setColor(announcementEmbedContent.color)
            .setAuthor({
                name: announcementEmbedContent.author.name,
                iconURL: announcementEmbedContent.author.iconUrl,
            });

        console.log(`[ANNOUNCEMENT] - Annonce de ${user.username} : "${announcementEmbedContent.title}", envoyée avec succès.`);
        await interaction.channel.send({ embeds: [announcementEmbed] });
        await interaction.reply({ content: "Annonce envoyée avec succès.", ephemeral: true });
    },
};
