const jsonConfig = require("../../config.json");

module.exports = {
    name: "prompt",
    description: "Fetch AIDetection Prompt",
    options: [],
    restricted: true,

    async runSlash(client, interaction) {
        await interaction.reply({ content: jsonConfig.prompt });
    },
}