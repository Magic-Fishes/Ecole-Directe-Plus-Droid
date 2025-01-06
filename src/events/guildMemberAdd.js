const { Events, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const ctx = new (require("../global/context"))();
const jsonConfig = require("../../config.json");
module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, guildMember) {
        const channel = guildMember.guild.channels.cache.get(
            jsonConfig.welcome_channel
        );

        const embedDataMP = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/welcome.json"),
                "utf8"
            )
        );

        const description = embedDataMP.description
            .replace("{memberCount}", guildMember.guild.memberCount)
            .replace("{member}", guildMember.user.globalName);

        const welcomingEmbedMP = new EmbedBuilder()
            .setTitle(embedDataMP.title)
            .setDescription(description)
            .setColor(embedDataMP.color)
            .setAuthor({
                name: embedDataMP.author.name,
                url:
                    embedDataMP.author.url || "https://www.ecole-directe.plus/",
                iconURL: embedDataMP.author.iconUrl,
            });
        const embedData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/comWelcomeAlert.json"),
                "utf8"
            )
        );

        const comDescription = embedData.description
            .replace("{member.name}", guildMember.user.globalName)
            .replace("{guild.member.count}", guildMember.guild.memberCount);

        const comWelcomingEmbed = new EmbedBuilder()
            .setTitle(embedData.title)
            .setDescription(comDescription)
            .setColor(embedData.color)
            .setAuthor({
                name: embedData.author.name,
                url: embedData.author.url || "https://www.ecole-directe.plus/",
                iconURL: embedData.author.icon_url,
            })
            .setImage(guildMember.user.displayAvatarURL());
        try {
            if (channel && channel.isTextBased()) {
                const sentMessage = await channel.send({
                    embeds: [comWelcomingEmbed],
                    content: `|| <@${guildMember.user.id}> ||`,
                });
                setTimeout(async () => {
                    await sentMessage.edit({
                        embeds: [comWelcomingEmbed],
                        content: "",
                    });
                }, 1000);
            }
            const sentMessage = await guildMember.send({
                embeds: [welcomingEmbedMP],
                content: `|| <@${guildMember.user.id}> ||`,
            });

            setTimeout(async () => {
                await sentMessage.edit({
                    embeds: [welcomingEmbedMP],
                    content: "",
                });
            }, 1000);
        } catch (error) {
            console.error(
                `Action denied: couldn't send a message to ${client.user.tag}`
            );
        }
    },
};