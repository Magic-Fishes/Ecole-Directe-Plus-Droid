const { 
  EmbedBuilder, 
  ButtonBuilder, 
  ActionRowBuilder, 
  PermissionsBitField,
  MessageFlags 
} = require('discord.js');
const config = require("../../config.json");
const embed = require("../embeds/ticket.json")

module.exports = {
  name: 'ticket',
  description: 'Créez un ticket pour obtenir de l\'aide.',
  options: [],
  restricted: false,

  runSlash: async (_, interaction) => {
    const displayname = interaction.user.displayName;
    const userId = interaction.user.id;
    const categoryId = config.real.ticketCategoryId;

    try {
      // Récupère la catégorie dans laquelle créer le salon de ticket
      const category = await interaction.guild.channels.fetch(categoryId);
      if (!category) {
        // Création de l'embed d'erreur avec conversion de couleur
        const errorEmbedData = embed.setup.ticketErrorEmbed;
        const errorColor = parseInt(errorEmbedData.color.replace("#", ""), 16);
        const errorEmbed = new EmbedBuilder(errorEmbedData)
          .setColor(errorColor)
          .setTimestamp();
        return interaction.reply({ 
          embeds: [errorEmbed], 
          flags: MessageFlags.Ephemeral 
        });
      }

      // Prépare les permissions pour le salon du ticket
      const permissions = [
        { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: userId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
      ];
      
      // Ajoute le rôle modérateur (vérifie qu'il est présent dans la guilde)
      const modRole = await interaction.guild.roles.fetch(config.real.mod_role);
      if (modRole) {
        permissions.push({
          id: modRole.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
        });
      }



      // Crée le salon du ticket
      const newChannel = await interaction.guild.channels.create({
        name: `ticket-${displayname}`,
        type: 0,
        parent: categoryId,
        permissionOverwrites: permissions
      });

      // Création de l'embed de ticket personnalisé
      let ticketEmbedData = embed.ticket.ticketEmbed;
      // Remplacements dynamiques pour {username} et {userId}
      ticketEmbedData = JSON.parse(JSON.stringify(ticketEmbedData)
        .replace('{username}', displayname)
        .replace('{userId}', userId)
      );
      const ticketColor = parseInt(ticketEmbedData.color.replace("#", ""), 16);
      const ticketEmbed = new EmbedBuilder(ticketEmbedData)
        .setColor(ticketColor)
        .setTimestamp();

      // Bouton pour fermer le ticket
      const closeButton = new ButtonBuilder()
        .setCustomId('close-ticket')
        .setLabel('Fermer le ticket')
        .setStyle(4);
      const closeRow = new ActionRowBuilder().addComponents(closeButton);

      // Envoie l'embed dans le nouveau salon
      await newChannel.send({ embeds: [ticketEmbed], components: [closeRow] });

      // Création de l'embed de confirmation de création du ticket
      let createdEmbedData = embed.setup.ticketCreatedEmbed;
      createdEmbedData = JSON.parse(JSON.stringify(createdEmbedData)
        .replace('{channelUrl}', newChannel.url)
      );
      const createdColor = parseInt(createdEmbedData.color.replace("#", ""), 16);
      const createdEmbed = new EmbedBuilder(createdEmbedData)
        .setColor(createdColor)
        .setTimestamp();

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          embeds: [createdEmbed], 
          flags: MessageFlags.Ephemeral 
        });
      } else {
        await interaction.followUp({ 
          embeds: [createdEmbed], 
          flags: MessageFlags.Ephemeral 
        });
      }
    } catch (error) {
      console.error(error);
      const errorEmbedData = embed.setup.ticketErrorEmbed;
      const errorColor = parseInt(errorEmbedData.color.replace("#", ""), 16);
      const errorEmbed = new EmbedBuilder(errorEmbedData)
        .setColor(errorColor)
        .setTimestamp();
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          embeds: [errorEmbed], 
          flags: MessageFlags.Ephemeral 
        });
      } else {
        await interaction.followUp({ 
          embeds: [errorEmbed], 
          flags: MessageFlags.Ephemeral 
        });
      }
    }
  }
};
