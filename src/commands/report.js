const jsonConfig = require("../../config.json");
const { EmbedBuilder, MessageFlags } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "report",
    description: "Signaler un utilisateur",
    options: [
        {
            name: "user",
            description: "Select a user",
            type: 6,
            required: true,
        },
        {
            name: "reason",
            description: "Raison du report",
            type: 3,
            required: true,
        },
    ],
    restricted: false,

    async runSlash(client, interaction) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        const reportEmbedContent = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/report.json"),
                "utf8"
            )
        );

        const description = reportEmbedContent.description
            .replaceAll("{member.globalName}", interaction.user.globalName)
            .replace("{reportedUser}", user.globalName)
            .replace("{report.reason}", reason);

        const reportEmbed = new EmbedBuilder()
            .setTitle(reportEmbedContent.title)
            .setDescription(description)
            .setColor(reportEmbedContent.color);

        const channel = await client.channels.fetch(jsonConfig.mod_channel);
        await channel.send({ content: `<@&${jsonConfig.mod_role}>` });
        await channel.send({ embeds: [reportEmbed] });
        await interaction.reply({
            content: "Votre signalement a été envoyé aux modérateurs.",
            flags: [MessageFlags.Ephemeral]
        });
    },
};
