const { EmbedBuilder } = require("discord.js");
const permissions = require("../utils/permissions");

module.exports = {
    name: "dev-ping",
    description:
        "ping chaque dev sur dev général pour annoncer une recertification",
    options: [],
    runSlash: async (_, interaction) => {
        if (!permissions.isAllowed(interaction)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'exécuter cette commande.", ephemeral: true });
        }
        
        const devRole = interaction.guild.roles.cache.find(
            (role) => role.name === "Développeur"
        );
        const activeDevRole = interaction.guild.roles.cache.find(
            (role) => role.id === 1280907843238760451
        );

        const fs = require("fs");
        const path = require("path");
        const embedData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/devPing.json"),
                "utf8"
            )
        );

        const description = embedData.description
            .replace("{devRole}", devRole)
            .replace("{activeDevRole}", activeDevRole);

        const announcementEmbed = new EmbedBuilder()
            .setTitle(embedData.title)
            .setDescription(description)
            .setColor(embedData.color)
            .setAuthor({
                name: embedData.author.name,
                url: embedData.author.url || "https://www.ecole-directe.plus/",
                iconURL: embedData.author.iconUrl,
            });

        await interaction.reply({ embeds: [announcementEmbed] });
    },
};
