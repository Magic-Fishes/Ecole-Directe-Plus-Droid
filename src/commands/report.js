const jsonConfig = require("../../config.json");
const {
    EmbedBuilder,
    MessageFlags,
    SlashCommandBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    command: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Signaler un utilisateur")
        .addUserOption((opt) =>
            opt
                .setName("user")
                .setDescription("Select a user")
                .setRequired(true)
        )
        .addStringOption((opt) =>
            opt
                .setName("reason")
                .setDescription("Raison du report")
                .setRequired(true)
        )
        .toJSON(),
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
            flags: MessageFlags.Ephemeral,
        });
    },
};
