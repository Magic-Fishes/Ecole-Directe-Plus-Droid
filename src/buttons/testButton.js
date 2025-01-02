const { MessageFlags } = require("discord.js");

module.exports = {
    name: "testButton",
    async runInteraction(Client, interaction) {
        interaction.reply({
            content: `Here is your id : ${interaction.member.id}`,
            flags: MessageFlags.Ephemeral,
        });
    },
};

