const { MessageFlags } = require("discord.js");

module.exports = {
    name: "testButton2",
    async runInteraction(Client, interaction) {
        interaction.reply({
            content: `:+1:`,
            flags: MessageFlags.Ephemeral,
        });
    },
};

