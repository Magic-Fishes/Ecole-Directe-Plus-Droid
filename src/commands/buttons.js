const { ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const permissions = require("../utils/permissions");

module.exports = {
    name: "button",
    description: "Buttons !",
    options: [],
    runSlash: (_, interaction) => {
        if (!permissions.isAllowed(interaction)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'exécuter cette commande.", ephemeral: true });
        }
        
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
