const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'ticket',
    description: 'Crée un ticket.',
    options: [],
    restricted: false,

    runSlash: async (_, interaction) => {
        const displayname = interaction.user.displayName;
        const id = interaction.user.id

        // const categoryId = '1315779992915017738';
        const categoryId = '1336225429857636352';

        try {
            const category = await interaction.guild.channels.fetch(categoryId);
            if (!category) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#0004ff')
                            .setTitle('Erreur')
                            .setDescription('La catégorie spécifiée n\'existe pas.')
                            .setTimestamp()
                            .setAuthor({
                                name: 'Ecole-Directe-Plus',
                                iconURL: 'https://pbs.twimg.com/profile_images/1680302515097673729/x1cHA0q5_400x400.png',
                                url: 'https://ecole-directe.plus'
                            })
                    ]
                });
            }

            const newChannel = await interaction.guild.channels.create({
                name: `ticket-${displayname}`,
                type: 0, // Utilisation correcte du type pour un canal de texte (GUILD_TEXT)
                parent: categoryId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel], // Utilisation correcte de PermissionsBitField
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], // Utilisation correcte de PermissionsBitField
                    },
                ],
            });

            const embedSuccess = new EmbedBuilder()
                .setColor('#0004ff')
                .setTitle(`Ticket de ${displayname}`)
                .setDescription(`Bonjour <@${id}>, votre ticket a été créé avec succès. Un membre de l'équipe de [Ecloe Directe Plus](https://ecole-directe.plus) viendra vous aider dès que possible.`)
                .setTimestamp()
                .setAuthor({
                    name: 'Ecole-Directe-Plus',
                    iconURL: 'https://pbs.twimg.com/profile_images/1680302515097673729/x1cHA0q5_400x400.png',
                    url: 'https://ecole-directe.plus'
                });

            await newChannel.send({ embeds: [embedSuccess] });

            const embedReply = new EmbedBuilder()
                .setColor('#0004ff')
                .setTitle('Ticket Créé 🎫')
                .setDescription(`Le ticket a été créé avec succès sous le nom **ticket-${displayname}** ! 🎉`)
                .setTimestamp()
                .setAuthor({
                    name: 'Ecole-Directe-Plus',
                    iconURL: 'https://pbs.twimg.com/profile_images/1680302515097673729/x1cHA0q5_400x400.png',
                    url: 'https://ecole-directe.plus'
                });

            await interaction.reply({ embeds: [embedReply] });
        } catch (error) {
            console.error(error);

            const embedError = new EmbedBuilder()
                .setColor('#0004ff')
                .setTitle('Erreur')
                .setDescription('Une erreur est survenue lors de la création du ticket.')
                .setTimestamp()
                .setAuthor({
                    name: 'Ecole-Directe-Plus',
                    iconURL: 'https://pbs.twimg.com/profile_images/1680302515097673729/x1cHA0q5_400x400.png',
                    url: 'https://ecole-directe.plus'
                });

            await interaction.reply({ embeds: [embedError] });
        }
    },
};
