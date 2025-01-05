const { ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle, SlashCommandBuilder } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");

module.exports = {
    command: new SlashCommandBuilder()
        .setName("button")
        .setDescription("Buttons !")
        .toJSON(),
    restricted: true,

    runSlash: (_, interaction) => {
        interaction.reply({
            content: `Click !!!`,
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("testButton")
                        .setLabel("hi !")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("testButton2")
                        .setLabel("hey !")
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setLabel("See this !")
                        .setURL("https://saumon-brule.dev")
                        .setStyle(ButtonStyle.Link)
                ),
            ],
        });
    },
};
