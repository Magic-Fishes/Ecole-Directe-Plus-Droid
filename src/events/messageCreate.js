const { Events, EmbedBuilder } = require("discord.js");
const fs = require("fs");

const Groq = require("groq-sdk");
const path = require("path");

const opRoles = ["1319230810691207209"]; // >
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const iaDetectionAndModeration = async (client, message) => {
    console.log(
        message.content.endsWith(".safemsg") &&
            opRoles.includes(message.author.id)
    );

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
                    opEmbedData.author.url ||
                    "https://www.ecole-directe.plus/",
                iconURL: opEmbedData.author.iconUrl,
            });
        console.log("ARRIVED HERE");
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
                            "Erreur lors de la suppression du message :",
                            err
                        )
                    );
            }, 5000);

            // await message.lineReply({
            //     embeds: [opEmbed],
            //     ephemeral: true,
            // });
        } catch (error) {
            if (error.code === 50007) {
                console.log(
                    "Impossible d'envoyer un message privé à l'utilisateur."
                );
            }
        }
        console.log("Utilisateur OP ignoré");
        return;
    }
    const modRole = message.guild.roles.cache.find(
        (role) => role.id === "1319230810691207209"
    ); // reel: "1170362568297164820"
    const modChannel = message.guild.channels.cache.find(
        (channel) => channel.id === "1323219598010744842"
    ); // reel: "1170356329722949652"
    const generalChannel = message.guild.channels.cache.find(
        (channel) => channel.id === "1300721888586235905"
    ); // reel: "1170357852846686228"

    const member = message.member;
    const content = message.content.toLowerCase(); // message content

    let aiDetection = "pass";

    async function getGroqChatCompletion() {
        return groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "Je vais t'envoyer des messages. Si l'un de ces messages est méchant, offensant, impertinent ou trop long, réponds simplement par 'block'. Si le message est approprié et respecte les normes de communication, réponds par 'pass'. Sois souple dans ton évaluation, mais garde à l'esprit ces critères.",
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
            // console.log(member);
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
        // console.log(member);
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

        console.log("Opération de modération effectuée.");
    }
};

module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {
        iaDetectionAndModeration(client, message);
    },
};

