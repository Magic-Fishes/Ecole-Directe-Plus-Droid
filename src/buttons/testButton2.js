module.exports = {
    name: "testButton2",
    async runInteraction(Client, interaction) {
        interaction.reply({
            content: `:+1:`,
            ephemeral: true,
        });
    },
};
