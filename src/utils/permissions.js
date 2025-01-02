module.exports = {
    isAllowed: function (interaction) {
        const modRoles = ["1323355831378640970y"]; // >
        const botDevs = ["744177952346079253", "899703183520182322"];

        const hasModRole = interaction.member.roles.cache.some(role => modRoles.includes(role.id));
        const isBotDev = botDevs.includes(interaction.member.id);

        if (!hasModRole && !isBotDev) {
            console.log("[PERMISSIONS] - Utilisateur non autorisé à exécuter la commande.");
            return false;
        }
        const reason = hasModRole ? `Rôle de modération (user = ${interaction.member.id})` : `Développeur du bot (user = ${interaction.member.id})`;
        console.log(`[PERMISSIONS] - Accès autorisé car ${reason}`);
        return true;
    }
}
