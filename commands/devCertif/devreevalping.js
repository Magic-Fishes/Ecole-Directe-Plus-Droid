const EmbedBuilder = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "dev_reeval_ping",
    description: "ping every dev on dev general to announce a recertification",
    run: async (client, interaction) => {
        const devRole = interaction.guild.roles.cache.find(role => role.name === 'Développeur');
        const active_dev_role = interaction.guild.roles.cache.find(role => role.id === 1280907843238760451);
        const devChannel = interaction.guild.channels.cache.find(channel => channel.name === 'général-dev');

        const embedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../utils/embeds/dev_reeval_ping.json'), 'utf8'));

        const description = embedData.description.replace("{dev_role}", devRole).replace("{active_dev_role}", active_dev_role);

        const announcementEmbed = new EmbedBuilder()
            .setTitle(embedData.title)
            .setDescription(embedData.description)
            .setColor(embedData.color)
            .setAuthor({
                name: embedData.author.name,
                url: embedData.author.url || "https://www.ecole-directe.plus/",
                iconURL: embedData.author.icon_url,
            });

        await devChannel.send({ embeds: [announcementEmbed] });
    }
}