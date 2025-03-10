const { EmbedBuilder } = require("discord.js");

const fs = require("fs");
const path = require("path");

module.exports = {
    name: "dev-ping",
    description:
        "ping chaque dev sur dev général pour annoncer une recertification",
    options: [],
    restricted: true,

    runSlash: async (_, interaction) => {
        const devRole = interaction.guild.roles.cache.find(
            (role) => role.name === "Développeur"
        );
        const activeDevRole = interaction.guild.roles.cache.find(
            (role) => role.id === 1280907843238760451
        );
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

