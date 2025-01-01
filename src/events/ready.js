const ctx = new (require("../global/context"))();

module.exports = {
    name: "ready",
    once: true,
    async execute(Client) {
        // Configuration des commandes
        Client.guilds.cache.forEach((guild) =>
            guild.commands.set(Client.commands.map((cmd) => cmd))
        );

        console.log(
            "Beep boop! I'm alive and ready to take over the world... or just do my job."
        );
    },
};

