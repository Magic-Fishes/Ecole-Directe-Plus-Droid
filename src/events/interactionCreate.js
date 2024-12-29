module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(Client, interaction) {
        if (interaction.isCommand()) {
            const command = Client.commands.get(interaction.commandName);
            if (!command)
                return interaction.reply("Cette commande n'existe pas.");

            command.runSlash(Client, interaction);
        } else if (interaction.isButton()) {
            const button = Client.buttons.get(interaction.customId);
            // console.log(Client.buttons);
            // console.log(Client.selects);
            if (!button) return interaction.reply("Ce bouton n'existe pas");

            button.runInteraction(Client, interaction);
        } else if (interaction.isSelectMenu()) {
            // console.log(Client.buttons);
            // console.log(Client.selects);
            const select = Client.selects.get(interaction.customId);
            if (!select)
                return interaction.reply("Ce menu de séléction n'existe pas");

            select.runInteraction(Client, interaction);
        }
    },
};
