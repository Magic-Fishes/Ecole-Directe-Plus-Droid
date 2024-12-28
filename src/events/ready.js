module.exports = {
    name: "ready",
    once: true,
    async execute(Client) {
        Client.guilds.cache.forEach(guild => guild.commands.set(Client.commands.map(cmd => cmd)));
        console.log("Bot ON");
    }
}