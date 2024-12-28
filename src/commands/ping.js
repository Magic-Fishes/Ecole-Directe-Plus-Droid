module.exports = {
    name: "ping",
    description: "PING :ping_pong:",
    options: [],
    runSlash: (_, interaction) => {
        interaction.reply({
            "content": `Pong to ${interaction.user} :ping_pong: !`
        })
    }
}