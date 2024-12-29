const { Events, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, guildMember) {
        const channel = guildMember.guild.channels.cache.get(
            "1323040960501776496"
        ); // real: 1130436200591794231

        const embedData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/welcome.json"),
                "utf8"
            )
        );

        const description = embedData.description
            .replace("{member_count}", guildMember.guild.memberCount)
            .replace("{member}", guildMember.user.globalName);

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
            if (channel && channel.isTextBased()) {
                await channel.send({ embeds: [welcomingEmbed] });
            } else {
                console.error("Channel not found or not a text channel.");
            }
        } catch (error) {
            console.error(
                `Action denided : couldn't send a private message to ${client.user.tag}`
            );
        }
    },
};
