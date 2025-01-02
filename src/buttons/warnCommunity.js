const { EmbedBuilder } = require("discord.js");
const ctx = new (require("../global/context"))();
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "warnCommunity",
    async runInteraction(Client, interaction) {
        const generalChannel = ctx.get("MESSAGE_CREATE_GENERAL_CHANNEL");
        const member = ctx.get("MESSAGE_CREATE_MEMBER");
        const comAlertEmbedContent = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/warnCom.json"),
                "utf8"
            )
        );

        const description = comAlertEmbedContent.description
            .replace("{message.author}", member.user.tag)
            .replace("{message.globalName}", member.user.globalName);

        const comAlertEmbed = new EmbedBuilder()
            .setTitle(comAlertEmbedContent.title)
            .setDescription(description)
            .setColor(comAlertEmbedContent.color)
            .setAuthor({
                name: comAlertEmbedContent.author.name,
                url:
                    comAlertEmbedContent.author.url ||
                    "https://www.ecole-directe.plus/",
                iconURL: comAlertEmbedContent.author.iconUrl,
            });

        await generalChannel.send({ embeds: [comAlertEmbed] });
    },
};

