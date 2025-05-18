const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const fs = require("fs");
const path = require("path");
const config = require("../../config.json");

module.exports = {
  name: 'setup-ticket',
  description: 'Configurer le système de tickets.',
  options: [],
  restricted: false,

  runSlash: async (_, interaction) => {
    const hasAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
    const hasMod = interaction.member.roles.cache.has(config.real.mod_role);
    const isDev = config.real.bot_devs.includes(interaction.user.id);

    if (!hasAdmin && !hasMod && !isDev) {
      return interaction.reply({
        content: '❌ Vous n\'avez pas la permission d\'utiliser cette commande.',
        ephemeral: true
      });
    }

    const displayname = interaction.user.displayName;

    const button = new ButtonBuilder()
      .setCustomId('create-ticket')
      .setLabel('Créer un ticket')
      .setStyle(1);
    const row = new ActionRowBuilder().addComponents(button);

    const ticketJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../embeds/ticket.json"), "utf8")
    );
    const embedData = ticketJson.setup.setupEmbed;

    // Corrige couleur string -> int
    if (embedData.color && typeof embedData.color === "string" && embedData.color.startsWith("#")) {
      embedData.color = parseInt(embedData.color.replace("#", ""), 16);
    }

    const embed = new EmbedBuilder(embedData);

    await interaction.reply({
      content: ticketJson.setup.setupReply.content,
      ephemeral: ticketJson.setup.setupReply.ephemeral
    });

    await interaction.channel.send({ embeds: [embed], components: [row] });
  },

  handleButtonClick: async (interaction) => {
    const displayname = interaction.user.displayName;
    const id = interaction.user.id;
    const categoryId = config.real.ticketCategoryId;

    try {
      const category = await interaction.guild.channels.fetch(categoryId);
      if (!category) {
        const ticketJson = JSON.parse(
          fs.readFileSync(path.join(__dirname, "../embeds/ticket.json"), "utf8")
        );
        const errorEmbedData = ticketJson.setup.ticketErrorEmbed;

        if (errorEmbedData.color && typeof errorEmbedData.color === "string" && errorEmbedData.color.startsWith("#")) {
          errorEmbedData.color = parseInt(errorEmbedData.color.replace("#", ""), 16);
        }

        const errorEmbed = new EmbedBuilder(errorEmbedData).setTimestamp();
        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      const permissions = [
        { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
        { id: config.real.mod_role, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
      ];


      const newChannel = await interaction.guild.channels.create({
        name: `ticket-${displayname}`,
        type: 0,
        parent: categoryId,
        permissionOverwrites: permissions
      });

      const ticketJson = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../embeds/ticket.json"), "utf8")
      );
      const rawEmbed = ticketJson.ticket.ticketEmbed;
      const ticketEmbedData = { ...rawEmbed };

      ticketEmbedData.title = ticketEmbedData.title.replace('{username}', displayname);
      ticketEmbedData.description = ticketEmbedData.description.replace('{userId}', id);

      if (ticketEmbedData.color && typeof ticketEmbedData.color === "string" && ticketEmbedData.color.startsWith("#")) {
        ticketEmbedData.color = parseInt(ticketEmbedData.color.replace("#", ""), 16);
      }

      const embedSuccess = new EmbedBuilder(ticketEmbedData).setTimestamp();

      const closeButton = new ButtonBuilder()
        .setCustomId('close-ticket')
        .setLabel('Fermer le ticket')
        .setStyle(4);
      const closeRow = new ActionRowBuilder().addComponents(closeButton);

      await newChannel.send({ embeds: [embedSuccess], components: [closeRow] });

      let createdEmbedData = { ...ticketJson.setup.ticketCreatedEmbed };
      createdEmbedData.description = createdEmbedData.description.replace('{channelUrl}', newChannel.url);

      if (createdEmbedData.color && typeof createdEmbedData.color === "string" && createdEmbedData.color.startsWith("#")) {
        createdEmbedData.color = parseInt(createdEmbedData.color.replace("#", ""), 16);
      }

      const createdEmbed = new EmbedBuilder(createdEmbedData).setTimestamp();

      await interaction.reply({ embeds: [createdEmbed], ephemeral: true });
    } catch (error) {
      console.error(error);
      const ticketJson = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../embeds/ticket.json"), "utf8")
      );
      const errorEmbedData = ticketJson.setup.ticketErrorEmbed;

      if (errorEmbedData.color && typeof errorEmbedData.color === "string" && errorEmbedData.color.startsWith("#")) {
        errorEmbedData.color = parseInt(errorEmbedData.color.replace("#", ""), 16);
      }

      const errorEmbed = new EmbedBuilder(errorEmbedData).setTimestamp();
      await interaction.channel.send({ embeds: [errorEmbed] });
    }
  },

  handleCloseButtonClick: async (interaction) => {
    const ticketJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../embeds/ticket.json"), "utf8")
    );
    const confirmationEmbedData = ticketJson.ticket.ticketCloseEmbed;

    if (confirmationEmbedData.color && typeof confirmationEmbedData.color === "string" && confirmationEmbedData.color.startsWith("#")) {
      confirmationEmbedData.color = parseInt(confirmationEmbedData.color.replace("#", ""), 16);
    }

    const confirmationEmbed = new EmbedBuilder(confirmationEmbedData).setTimestamp();

    const yesButton = new ButtonBuilder()
      .setCustomId('confirm-close-ticket')
      .setLabel('Oui, fermer le ticket')
      .setStyle(4);
    const noButton = new ButtonBuilder()
      .setCustomId('cancel-close-ticket')
      .setLabel('Non, garder le ticket ouvert')
      .setStyle(2);
    const buttonRow = new ActionRowBuilder().addComponents(yesButton, noButton);

    await interaction.reply({
      embeds: [confirmationEmbed],
      components: [buttonRow],
      ephemeral: true
    });
  },

  handleConfirmCloseButtonClick: async (interaction) => {
    const channel = interaction.channel;
    const userId = interaction.user.id;
    const displayname = interaction.user.displayName;
    try {
      await channel.setName(`ferme-${displayname}`);
      await channel.permissionOverwrites.edit(userId, { ViewChannel: false });
      await interaction.reply({
        content: `🔒 Ticket fermé par <@${userId}>.`,
        ephemeral: false
      });
      await channel.delete()
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ Une erreur est survenue lors de la fermeture du ticket.',
        ephemeral: true
      });
    }
  },

  handleCancelCloseButtonClick: async (interaction) => {
    await interaction.reply({
      content: 'La fermeture du ticket a été annulée.',
      ephemeral: true
    });
  }
};
