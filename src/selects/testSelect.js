const Discord = require("discord.js");

module.exports = {
    name: "testSelect",
    async runInteraction(Client, interaction) {
        const shifoumi = ["Pierre", "Papier", "Ciseaux"];
        interaction.reply(`${shifoumi[(interaction.values[0] + 1) % 3]}\nJ'ai gagné`);
    }
}