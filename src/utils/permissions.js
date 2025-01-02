const config = require('../global/config');

module.exports = {
    isAllowed: function (interaction) {

        const hasModRole = interaction.member.roles.cache.some(role => config.mod_role.includes(role.id));
        const isBotDev = config.bot_devs.includes(interaction.member.id);

        if (!hasModRole && !isBotDev) {
            console.log("[PERMISSIONS] - Utilisateur non autorisé à exécuter la commande.");
            return false;
        }
        const reason = hasModRole ? `Rôle de modération (user = ${interaction.member.id})` : `Développeur du bot (user = ${interaction.member.id})`;
        console.log(`[PERMISSIONS] - Accès autorisé car ${reason}`);
        return true;
    }
}
