const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Displays a list of available commands.',
    options: [],
    restricted: false,

    runSlash: async (_, interaction) => {
        const embed = new EmbedBuilder()
            .setColor('#0004ff')
            .setTitle('Liste des commandes disponibles')
            .setDescription('Pitite liste juste ici ! 👇')
            .addFields(
                { name: '/announcement', value: 'Faire une annonce (sous forme d\'embed). 📣' },
                { name: '/clear', value: 'Supprime des messages dans le salon. 🧹' },
                { name: '/dev-ping', value: 'Ping chaque dev sur dev généraux pour annoncer une recertification. 📢' },
                { name: '/fetch-users', value: 'Récupère les membres d\'un rôle spécifique. 📊' },
                { name: '/launchstats', value: 'Récuperer les stats du site. 📊' },
                { name: '/ping', value: 'Répond avec Pong! 📢' },
                { name: '/prompt', value: '<DevReserved/> Fetch AIDetection Prompt 🤖' },
                { name: '/report', value: 'Signaler un utilisateur. 🚨' },
                { name: '/shifoumi', value: 'Lance un shifoumi en 1 manche. 🎲' },
                { name: '/welcome', value: 'Souhaite la bienvenue à un utilisateur spécifique. 🎉' },
                { name: '/botinfo', value: 'Affiche toutes les informations du bot. 🤖' }
            )

        await interaction.reply({ embeds: [embed] });
    },
};