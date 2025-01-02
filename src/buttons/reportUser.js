const { EmbedBuilder } = require("discord.js");
const ctx = new (require("../global/context"))();
const fs = require("fs");
const path = require("path");
module.exports = {
    name: "reportUser",
    async runInteraction(Client, interaction) {
        const warnDMEmbedContent = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/warnDM.json"),
                "utf8"
            )
        );

        const userWarnEmbed = new EmbedBuilder()
            .setTitle(warnDMEmbedContent.title)
            .setDescription(warnDMEmbedContent.description)
            .setColor(warnDMEmbedContent.color)
            .setAuthor({
                name: warnDMEmbedContent.author.name,
                url:
                    warnDMEmbedContent.author.url ||
                    "https://www.ecole-directe.plus/",
                iconURL: warnDMEmbedContent.author.iconUrl,
            });
        const member = ctx.get("MESSAGE_CREATE_MEMBER");
        await member.send({ embeds: [userWarnEmbed] });
    },
};

