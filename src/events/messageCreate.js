const {
    Events,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    MessageFlags,
} = require("discord.js");
const fs = require("fs");

const Groq = require("groq-sdk");
const path = require("path");
const ctx = new (require("../global/context"))();

const jsonConfig = require("../../config.json");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const getModels = async () => {
    return await groq.models.list();
};

const availableModels = [];

getModels()
    .then((response) => {
        let modelList;
        if (Array.isArray(response)) {
            modelList = response;
        } else if (response.data) {
            modelList = response.data;
        } else {
            modelList = [];
        }

        modelList.forEach((model) => {
            availableModels.push(model);
        });
        console.log("Available Groq models:", availableModels);
    })
    .catch((error) => {
        console.error("Error fetching Groq models:", error);
    });

const iaDetectionAndModeration = async (_, message) => {
    if (
        message.author.bot ||
        (message.content.endsWith(".safemsg") &&
            message.member.roles.cache.some((role) =>
                jsonConfig.op_role.includes(role.id)
            ))
    ) {
        const opEmbedData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/opBypass.json"),
                "utf8"
            )
        );

        const opEmbed = new EmbedBuilder()
            .setTitle(opEmbedData.title)
            .setDescription(opEmbedData.description)
            .setColor(opEmbedData.color)
            .setAuthor({
                name: opEmbedData.author.name,
                url:
                    opEmbedData.author.url || "https://www.ecole-directe.plus/",
                iconURL: opEmbedData.author.iconUrl,
            });

        try {
            if (message.author.bot) return;
            const replyMsg = await message.reply({
                embeds: [opEmbed],
                flags: MessageFlags.Ephemeral,
            });

            console.log("[AUTOMOD] - Utilisateur OP ignoré");

            setTimeout(() => {
                replyMsg
                    .delete()
                    .catch((err) =>
                        console.error(
                            "[AUTOMOD] - Erreur lors de la suppression du message :",
                            err
                        )
                    );
            }, 5000);
        } catch (error) {
            if (error.code === 50007) {
                console.log(
                    "[AUTOMOD] - Impossible d'envoyer un message privé à l'utilisateur."
                );
            }
        }
        console.log("[AUTOMOD] - Utilisateur OP ignoré");
        return;
    }

    const modRole = message.guild.roles.cache.find(
        (role) => role.id === jsonConfig.mod_role
    );
    const modChannel = message.guild.channels.cache.find(
        (channel) => channel.id === jsonConfig.mod_channel
    );
    const generalChannel = message.guild.channels.cache.find(
        (channel) => channel.id === jsonConfig.general_channel
    );
    const member = message.member;
    ctx.set("MESSAGE_CREATE_GENERAL_CHANNEL", generalChannel); // I can't be bothered to export message in the buttons so... :) -> in french "flm"
    ctx.set("MESSAGE_CREATE_MEMBER", member);
    const content = message.content.toLowerCase();

    let aiDetection = "pass";

    async function getGroqChatCompletion() {
        for (const model of availableModels) {
            try {
                console.log(
                    "Groq model " + model.id + " used for message detection."
                );
                return groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: jsonConfig.prompt,
                        },
                        {
                            role: "user",
                            content: content,
                        },
                    ],
                    model: model.id,
                    temperature: 0, // wtf
                    /* eslint-disable camelcase */
                    max_tokens: 1024,
                    top_p: 0,
                    /* eslint-enable camelcase */
                });
                break;
            } catch (error) {
                console.error(
                    "No tokens left for " + model.id + ": Switching..."
                );
            }
        }
    }

    const chatCompletion = await getGroqChatCompletion();
    aiDetection = chatCompletion.choices[0]?.message?.content;

    if (aiDetection === "block") {
        const modWarnEmbedContent = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/warnMod.json"),
                "utf8"
            )
        );
        let description = modWarnEmbedContent.description
            .replace("{message.author}", member.user.globalName)
            .replace("{message.author.name}", member.user.username)
            .replace("{message.content}", message.content)
            .replace("{serverId}", message.guildId)
            .replace("{channelId}", message.channelId)
            .replace("{messageId}", message.id);

        const modWarnEmbed = new EmbedBuilder()
            .setTitle(modWarnEmbedContent.title)
            .setDescription(description)
            .setColor(modWarnEmbedContent.color);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("warnCommunity")
                .setLabel("Prévenir la communauté")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("reportUser")
                .setLabel("Signaler l'utilisateur")
                .setStyle(ButtonStyle.Danger)
        );

        const modMessage = await modChannel.send({
            embeds: [modWarnEmbed],
            components: [row],
            content: `${modRole}`,
        });

        modMessage["badMessageUserId"] = message.author.id;
        modMessage["badMessageLinkID"] =
            `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`;

        /*
        
        Ok, j'explique le bordel qui est ici (1ligne mdr) en fr prcq c'est compliqué.
        Nous avons rencontré un problème, sur le pannel de modération (les 2 boutons)
        lorsqu'on signalait un utilisateur EN MP, c'était le dernier membre a avoir
        envoyé un message qui était report (et donc pas le farfadet en question).
        Ce qui est légèrement problématique (juste une modération qui ping un peu tout
        le monde mdr). Donc j'ai cherché très longtemps (5min je crois) une solution
        et la voilà... une ligne :)
        En fait l'idée est d'injecter l'id du farfadet dans l'objet de l'embed du message
        (oui là ça se corse...) et ainsi pouvoir récupérer dans le code du bouton, soit
        dans l'interraction. Donc dans la case message de l'interraction, on y retrouve
        l'id du farfadet et donc, pour chaque message (tant que le bot n'est pas déchargé)
        l'id de la personne qui semble chiante est stocké directement dans le message qui
        est récupérable dans l'interraction du bouton dans lequel il est chargé.
        Voilà, ce message est bcp trop long mais j'espère que c'est clair. Allez faire
        un tour du coté du code du bouton.

         */

        const filter = (i) =>
            i.customId === "warnCommunity" || i.customId === "reportUser";

        const collector = modMessage.createMessageComponentCollector({
            filter,
            time: 3600000,
        });

        collector.on("collect", async (collectorInteraction) => {
            await collectorInteraction.deferUpdate();

            const userMention = `<@${collectorInteraction.user.id}>`;
            let actionMessage;

            if (collectorInteraction.customId === "warnCommunity") {
                const previousContent =
                    modMessage.content === `<@&${jsonConfig.mod_role}>`
                        ? ""
                        : modMessage.content;
                actionMessage = `|| ${userMention} a prévenu la communauté". ||`;

                await collectorInteraction.followUp({
                    content: "La communauté a été prévenue.",
                    flags: MessageFlags.Ephemeral,
                });

                const newComponents = modMessage.components
                    .map((row) => {
                        const filteredComponents = row.components.filter(
                            (component) =>
                                component.customId !== "warnCommunity"
                        );

                        return filteredComponents.length > 0
                            ? new ActionRowBuilder().addComponents(
                                  filteredComponents
                              )
                            : null;
                    })
                    .filter(Boolean);
                const updatedContent =
                    `${previousContent}\n${actionMessage}`.trim();
                await modMessage.edit({
                    components: newComponents,
                    content: updatedContent,
                });
            } else if (collectorInteraction.customId === "reportUser") {
                const previousContent =
                    modMessage.content === `<@&${jsonConfig.mod_role}>`
                        ? ""
                        : modMessage.content;

                actionMessage = `|| ${userMention} a signalé l'utilisateur". ||`;

                try {
                    await collectorInteraction.followUp({
                        content: "L'utilisateur a été signalé.",
                        flags: MessageFlags.Ephemeral,
                    });

                    const newComponents = modMessage.components
                        .map((row) => {
                            const filteredComponents = row.components.filter(
                                (component) =>
                                    component.customId !== "reportUser"
                            );

                            return filteredComponents.length > 0
                                ? new ActionRowBuilder().addComponents(
                                      filteredComponents
                                  )
                                : null;
                        })
                        .filter(Boolean);
                    const updatedContent =
                        `${previousContent}\n${actionMessage}`.trim();
                    await modMessage.edit({
                        components: newComponents,
                        content: updatedContent,
                    });
                } catch (error) {
                    if (error.code === 50007) {
                        console.log(
                            "[AUTOMOD] - Impossible d'envoyer un message privé à l'utilisateur."
                        );
                    }
                }
            }
        });

        console.log("[AUTOMOD] - Opération de modération effectuée.");
        return;
    }
};

module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {
        iaDetectionAndModeration(client, message);
    },
};

