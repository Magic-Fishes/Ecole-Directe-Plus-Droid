const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "welcome",
    description: "send a welcome message to a user",
    callback: async (client, interaction) => {
        const member = interaction.member;
        const memberCount = member.guild.memberCount;

        const embedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../utils/embeds/welcome.json'), 'utf8'));

        const description = embedData.description.replace("{member_count}", memberCount)

        const welcomingEmbed = new EmbedBuilder()
            .setTitle(embedData.title)
            .setDescription(description)
            .setColor(embedData.color)
            .setAuthor({
                name: embedData.author.name,
                url: embedData.author.url || "https://www.ecole-directe.plus/",
                iconURL: embedData.author.icon_url,
            })

        await interaction.reply({ embeds: [welcomingEmbed] });
    }
}