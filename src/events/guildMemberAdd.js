const { Events, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const memberCount = member.guild.memberCount;

        const embedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../embeds/welcome.json'), 'utf8'));

        const description = embedData.description.replace("{member_count}", memberCount).replace("{member}", member.user.tag);

        const welcomingEmbed = new EmbedBuilder()
            .setTitle(embedData.title)
            .setDescription(description)
            .setColor(embedData.color)
            .setAuthor({
                name: embedData.author.name,
                url: embedData.author.url || "https://www.ecole-directe.plus/",
                iconURL: embedData.author.icon_url,
            });

        try {
            await member.send({ embeds: [welcomingEmbed] });
        } catch (error) {
            console.error(`Action denided : couldn't send a private message to ${member.user.tag}`);
        }
    },
};
