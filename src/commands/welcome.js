const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    command: new SlashCommandBuilder()
        .setName("welcome")
        .setDescription("Bienvenue à un utilisateur")
        .addUserOption((opt) =>
            opt
                .setName("user")
                .setDescription("Select a user")
                .setRequired(false)
        )
        .toJSON(),
    restricted: true,

    runSlash: async (_, interaction) => {
        const member = interaction.member;
        const memberCount = member.guild.memberCount;

        let embedData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/welcome.json"),
                "utf8"
            )
        );

        let description = embedData.description
            .replace("{memberCount}", memberCount)
            .replace("{member}", member.user.globalName);

        const welcomingEmbed = new EmbedBuilder()
            .setTitle(embedData.title)
            .setDescription(description)
            .setColor(embedData.color)
            .setAuthor({
                name: embedData.author.name,
                url: embedData.author.url || "https://www.ecole-directe.plus/",
                iconURL: embedData.author.icon_url,
            });

        embedData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/comWelcomeAlert.json"),
                "utf8"
            )
        );

        description = embedData.description
            .replace("{member.name}", member.user.globalName)
            .replace("{guild.member.count}", memberCount);

        const comWelcomingEmbed = new EmbedBuilder()
            .setTitle(embedData.title)
            .setDescription(description)
            .setColor(embedData.color)
            .setAuthor({
                name: embedData.author.name,
                url: embedData.author.url || "https://www.ecole-directe.plus/",
                iconURL: embedData.author.icon_url,
            })
            .setImage(member.user.displayAvatarURL());

        await interaction.reply({
            embeds: [welcomingEmbed, comWelcomingEmbed],
        });
    },
};
