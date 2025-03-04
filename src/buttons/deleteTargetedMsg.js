const { EmbedBuilder } = require("discord.js");
const ctx = new (require("../global/context"))();
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "deleteMessage",
    async runInteraction(Client, interaction) {
        const badMessageLinkID = interaction.message.badMessageLinkID;
        const [guildId, channelId, messageId] = badMessageLinkID
            .split("/")
            .slice(-3);

        const channel = await Client.channels.fetch(channelId);
        const message = await channel.messages.fetch(messageId);

        await message.delete();
    },
};

