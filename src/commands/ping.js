module.exports = {
    name: "ping",
    description: "Répond avec Pong!",
    runSlash: async (client, interaction) => {
        await interaction.reply("Pong!");
    },
};
