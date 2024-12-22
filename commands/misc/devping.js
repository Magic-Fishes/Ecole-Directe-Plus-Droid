const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "dev-ping",
    description: "ping every dev on dev general to announce a recertification",
    callback: async (client, interaction) => {
        const devRole = interaction.guild.roles.cache.find(role => role.name === 'Développeur');
        const active_dev_role = interaction.guild.roles.cache.find(role => role.id === 1280907843238760451);

        const embedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../utils/embeds/dev_ping.json'), 'utf8'));

        const description = embedData.description.replace("{dev_role}", devRole).replace("{active_dev_role}", active_dev_role);

        const announcementEmbed = new EmbedBuilder()
            .setTitle(embedData.title)
            .setDescription(description)
            .setColor(embedData.color)
            .setAuthor({
                name: embedData.author.name,
                url: embedData.author.url || "https://www.ecole-directe.plus/",
                iconURL: embedData.author.icon_url,
            });

        await interaction.reply({ embeds: [announcementEmbed] });
    }
}