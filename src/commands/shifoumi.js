const { SelectMenuBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    command: new SlashCommandBuilder()
        .setName("selects")
        .setDescription("Selects !")
        .toJSON(),
    restricted: true,

    runSlash: (_, interaction) => {
        interaction.reply({
            content: `wanna play ?`,
            components: [
                new ActionRowBuilder().addComponents(
                    new SelectMenuBuilder()
                        .setCustomId("testSelect")
                        .setPlaceholder("Play shifoumi with me")
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions([
                            {
                                label: "Pierre",
                                description: "Pierre",
                                value: "0",
                            },
                            {
                                label: "Paper",
                                description: "Papier",
                                value: "1",
                            },
                            {
                                label: "Ciseaux",
                                description: "Ciseaux",
                                value: "2",
                            },
                        ])
                ),
            ],
        });
    },
};
