const { SelectMenuBuilder } = require("@discordjs/builders");
const { ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "selects",
    description: "Selects !",
    options: [],
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
