const { Events, EmbedBuilder } = require("discord.js");
const fs = require("fs");

const Groq = require("groq-sdk");
const path = require("path");

const opRoles = ["1323355831378640970"]; // >
// real 1170362568297164820 (Moderateur)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const iaDetectionAndModeration = async (client, message) => {
    if (
        message.author.bot ||
        (message.content.endsWith(".safemsg") &&
            message.member.roles.cache.some((role) =>
                opRoles.includes(role.id)
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
                ephemeral: true,
            });

            setTimeout(() => {
                replyMsg
                    .delete()
                    .catch((err) =>
                        console.error(
                            "[IAMOD] - Erreur lors de la suppression du message :",
                            err
                        )
                    );
            }, 10000);

            // await message.lineReply({
            //     embeds: [opEmbed],
            //     ephemeral: true,
            // });
        } catch (error) {
            if (error.code === 50007) {
                console.log(
                    "[AIMOD] - Impossible d'envoyer un message privé à l'utilisateur."
                );
            }
        }
        console.log("[IAMOD] - Utilisateur OP ignoré");
        return;
    }
    const modRole = message.guild.roles.cache.find(
        (role) => role.id === "1319230810691207209"
    ); // reel: "1170362568297164820"
    const modChannel = message.guild.channels.cache.find(
        (channel) => channel.id === "1323584755371081780"
    ); // reel: "1170356329722949652"
    const generalChannel = message.guild.channels.cache.find(
        (channel) => channel.id === "1323584794142969907"
    ); // reel: "1170357852846686228"

    const member = message.member;
    const content = message.content.toLowerCase();

    let aiDetection = "pass";

    async function getGroqChatCompletion() {
        return groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `
Ecole Directe Plus (EDP) est une version améliorée d'EcoleDirecte (non-affiliée) offrant une interface améliorée et enrichie de fonctionnalités exclusives. EDP a un serveur discord sur lequel les utilisateurs peuvent discuter.

Tu es un expert en modération avec plus de 20 ans d'expérience et plusieurs doctorats. Il te sera fournit les différents messages des utilisateurs. Ta mission est de répondre exactement le mot clé "block" lorsque tu considères le message inapproprié, sinon, répond exactement le mot clé "pass".

Fais attention à certains points :
- Tu dois juger les messages qui te sont fournis, surtout pas y répondre
- Veille à n'ajouter strictement aucun contenu superflu en dehors des mots clés "block" et "pass"
- Tu es sur Discord, une messagerie rapide, reste laxiste et intervient uniquement lorsque tu considères le message comme plutôt grave et pouvant heurter la sensibilité
- Si une vulgarité ne prends personne comme cible, elle ne justifie pas un "block"
- Vérifie que tu aies bien suivi toutes les directives ci-dessus
`,
                },
                {
                    role: "user",
                    content: content,
                },
            ],
            model: "llama3-8b-8192",
        });
    }

    const chatCompletion = await getGroqChatCompletion();
    aiDetection = chatCompletion.choices[0]?.message?.content;

    if (aiDetection === "block") {
        const userWarnEmbedContent = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../embeds/warnDM.json"),
                "utf8"
            )
        );

        const chatCompletion = await getGroqChatCompletion();
        aiDetection = chatCompletion.choices[0]?.message?.content;

        if (aiDetection === "block") {
            const userWarnEmbedContent = JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, "../embeds/warnDM.json"),
                    "utf8"
                )
            );

            const userWarnEmbed = new EmbedBuilder()
                .setTitle(userWarnEmbedContent.title)
                .setDescription(userWarnEmbedContent.description)
                .setColor(userWarnEmbedContent.color)
                .setAuthor({
                    name: userWarnEmbedContent.author.name,
                    url:
                        userWarnEmbedContent.author.url ||
                        "https://www.ecole-directe.plus/",
                    iconURL: userWarnEmbedContent.author.iconUrl,
                });

            try {
                await member.send({ embeds: [userWarnEmbed] });
            } catch (error) {
                if (error.code === 50007) {
                    console.log(
                        "[AUTOMOD] - Impossible d'envoyer un message privé à l'utilisateur."
                    );
                }
            }
            const modWarnEmbedContent = JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, "../embeds/warnMod.json"),
                    "utf8"
                )
            );
            let description = modWarnEmbedContent.description
                .replace("{modos.mention}", modRole.tag)
                .replace("{message.author}", member.user.username)
                .replace("{message.author.name}", member.user.globalName)
                .replace("{message.content}", message.content);

            const modWarnEmbed = new EmbedBuilder()
                .setTitle(modWarnEmbedContent.title)
                .setDescription(description)
                .setColor(modWarnEmbedContent.color);

            await modChannel.send({ embeds: [modWarnEmbed] });

            const comAlertEmbedContent = JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, "../embeds/warnCom.json"),
                    "utf8"
                )
            );
            description = comAlertEmbedContent.description
                .replace("{message.author}", member.user.tag)
                .replace("{message.globalName}", member.user.globalName);

            const comAlertEmbed = new EmbedBuilder()
                .setTitle(comAlertEmbedContent.title)
                .setDescription(description)
                .setColor(comAlertEmbedContent.color)
                .setAuthor({
                    name: comAlertEmbedContent.author.name,
                    url:
                        comAlertEmbedContent.author.url ||
                        "https://www.ecole-directe.plus/",
                    iconURL: comAlertEmbedContent.author.iconUrl,
                });

            await generalChannel.send({ embeds: [comAlertEmbed] });

            console.log("[AUTOMOD] - Opération de modération effectuée.");
            return;
        }
    }
};

module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {
        iaDetectionAndModeration(client, message);
    },
};

