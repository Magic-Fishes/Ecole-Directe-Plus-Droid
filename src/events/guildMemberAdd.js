const { Events, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, guildMember) {
        const channel = guildMember.guild.channels.cache.get(
            "1323207153535680594"
        ); // real: 1130436200591794231

        const embedData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/welcome.json"),
                "utf8"
            )
        );

        const description = embedData.description
            .replace("{memberCount}", guildMember.guild.memberCount)
            .replace("{member}", guildMember.user.globalName);

        const welcomingEmbed = new EmbedBuilder()
            .setTitle(embedData.title)
            .setDescription(description)
            .setColor(embedData.color)
            .setAuthor({
                name: embedData.author.name,
                url: embedData.author.url || "https://www.ecole-directe.plus/",
                iconURL: embedData.author.iconUrl,
            });

        try {
            if (channel && channel.isTextBased()) {
                const sentMessage = await channel.send({
                    embeds: [welcomingEmbed],
                    content: `|| <@${guildMember.user.id}> ||`,
                });

                setTimeout(async () => {
                    await sentMessage.edit({
                        embeds: [welcomingEmbed],
                        content: "",
                    });
                }, 1000);
            } else {
                console.error("Channel not found or not a text channel.");
            }
        } catch (error) {
            console.error(
                `Action denied: couldn't send a message to ${client.user.tag}`
            );
        }
    },
};

