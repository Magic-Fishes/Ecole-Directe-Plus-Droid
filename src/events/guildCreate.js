module.exports = {
    name: "guildCreate",
    once: false,
    async execute(Client, guild) {
        guild.commands.set(Client.commands.map((cmd) => cmd));
    },
};
