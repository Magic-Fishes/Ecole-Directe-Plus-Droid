module.exports = {
    name: "ping",
    description: "Répond avec Pong!",
    restricted: true,
    runSlash: async (client, interaction) => {
        await interaction.reply("Pong!");
        // console.log(ctx.get());
    },
};

