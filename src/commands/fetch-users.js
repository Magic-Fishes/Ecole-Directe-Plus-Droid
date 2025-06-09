const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "fetch-users",
    description: "Récupère les membres d'un rôle spécifique",
    options: [
        {
            name: "role",
            description: "Rôle dont vous voulez récupérer les membres",
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
    ],
    restricted: true,

    runSlash: async (_, interaction) => {
        const role = interaction.options.getRole("role");

        const members = interaction.guild.members.cache.filter(member => 
            member.roles.cache.has(role.id)
        );

        const memberList = members.map(member => 
            `• ${member.user.username} (<@${member.id}>)`
        ).join("\n");

        const fetchEmbed = new EmbedBuilder()
            .setTitle(`Membres avec le rôle ${role.name}`)
            .setDescription(memberList)
            .setColor("Random")
            .setFooter({ 
                text: `Total: ${members.size} membre(s)` 
            });

        await interaction.reply({ 
            embeds: [fetchEmbed],
            allowedMentions: { users: [] } 
        });
    },
};
