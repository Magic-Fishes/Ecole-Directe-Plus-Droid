const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'setup-ticket',
    description: 'Configurer le système de tickets.',
    options: [],
    restricted: false,

    runSlash: async (_, interaction) => {
        const displayname = interaction.user.displayName;

        // ID de la catégorie où les tickets seront créés
        const categoryId = '1336225429857636352';

        // Créer un bouton pour créer un ticket
        const button = new ButtonBuilder()
            .setCustomId('create-ticket') // ID du bouton pour identifier l'action
            .setLabel('Créer un ticket')
            .setStyle(1); // Style du bouton (couleur)

        const row = new ActionRowBuilder().addComponents(button); // Ajouter le bouton à une ligne

        // Embed pour informer que le système de ticket est prêt
        const embed = new EmbedBuilder()
            .setColor('#0004ff')
            .setTitle('Système de Ticket')
            .setDescription('Cliquez sur le bouton ci-dessous pour créer un ticket. Un membre de notre équipe viendra vous aider dès que possible.')
            .setAuthor({
                name: 'Ecole-Directe-Plus',
                iconURL: 'https://pbs.twimg.com/profile_images/1680302515097673729/x1cHA0q5_400x400.png',
                url: 'https://ecole-directe.plus'
            });

        // Envoyer le message avec l'embed et le bouton
        const channel = interaction.channel

        await interaction.reply({ content: 'Le message des tickets a été setup ici !!!', ephemeral: true })

        await channel.send({
            embeds: [embed],
            components: [row]
        });
    },
};

// Écouter les interactions de boutons
module.exports.handleButtonClick = async (interaction) => {
    if (interaction.customId === 'create-ticket') {
        const displayname = interaction.user.displayName;

        const categoryId = '1336225429857636352';

        try {
            // Vérifier que la catégorie existe
            const category = await interaction.guild.channels.fetch(categoryId);
            if (!category) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ff0000')
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

            // Créer un canal de texte pour le ticket
            const newChannel = await interaction.guild.channels.create({
                name: `ticket-${displayname}`,
                type: 0, // Canal texte (GUILD_TEXT)
                parent: categoryId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                ],
            });

            const embedSuccess = new EmbedBuilder()
                .setColor('#0004ff')
                .setTitle('Ticket Créé avec Succès 🎫')
                .setDescription(`Bonjour ${displayname}, votre ticket a été créé avec succès. Un membre de notre équipe viendra vous aider dès que possible.`)
                .addFields(
                    { name: 'Ticket ID', value: `ticket-${displayname}`, inline: true },
                    { name: 'Statut', value: 'Ouvert', inline: true }
                )
                .setAuthor({
                    name: 'Ecole-Directe-Plus',
                    iconURL: 'https://pbs.twimg.com/profile_images/1680302515097673729/x1cHA0q5_400x400.png',
                    url: 'https://ecole-directe.plus'
                });

            // Envoyer un message dans le salon créé avec l'embed
            await newChannel.send({ embeds: [embedSuccess] });

            // Envoyer un message à l'utilisateur dans le salon où l'interaction a eu lieu
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#0004ff')
                        .setTitle('Ticket Créé 🎫')
                        .setDescription(`Le ticket a été créé avec succès [ici](${newChannel.url}) ! 🎉`)
                        .setTimestamp()
                        .setAuthor({
                            name: 'Ecole-Directe-Plus',
                            iconURL: 'https://pbs.twimg.com/profile_images/1680302515097673729/x1cHA0q5_400x400.png',
                            url: 'https://ecole-directe.plus'
                        })
                ],
                ephemeral: true // Rendre le message éphémère
            });

        } catch (error) {
            console.error(error);

            // Si une erreur survient, envoyer un message d'erreur dans le salon où l'interaction a eu lieu
            await interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('Erreur')
                        .setDescription('Une erreur est survenue lors de la création du ticket.')
                        .setAuthor({
                            name: 'Ecole-Directe-Plus',
                            iconURL: 'https://pbs.twimg.com/profile_images/1680302515097673729/x1cHA0q5_400x400.png',
                            url: 'https://ecole-directe.plus'
                        })
                ]
            });
        }
    }
};
