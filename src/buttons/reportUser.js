const { EmbedBuilder } = require("discord.js");
const ctx = new (require("../global/context"))();
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "reportUser",
    async runInteraction(Client, interaction) {
        const guild = ctx.get("GUILD");
        const member = await guild.members.fetch(
            interaction.message.badMessageUserId
        );

        const warnDMEmbedContent = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/warnDM.json"),
                "utf8"
            )
        );

        const description = warnDMEmbedContent.description
            .replace("{message.link}", interaction.message.badMessageLinkID);

        const userWarnEmbed = new EmbedBuilder()
            .setTitle(warnDMEmbedContent.title)
            .setDescription(description)
            .setColor(warnDMEmbedContent.color)
            .setAuthor({
                name: warnDMEmbedContent.author.name,
                url:
                    warnDMEmbedContent.author.url ||
                    "https://www.ecole-directe.plus/",
                iconUrl: warnDMEmbedContent.author.icon_url,
            });

        await member.send({ embeds: [userWarnEmbed] });
    },
};

