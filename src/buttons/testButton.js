module.exports = {
    name: "testButton",
    async runInteraction(Client, interaction) {
        interaction.reply({
            content: `Here is your id : ${interaction.member.id}`,
            ephemeral: true,
        })
    }
}