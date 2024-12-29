const { Events, EmbedBuilder } = require("discord.js");
const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");

const op_members = [899703183520182322, 574179685999837194, 536576560992616468]; // ewalwi, AlexandreIII, Truite

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {
        if (
            message.author.id === client.user.id ||
            (message.content.endsWith(".safemsg") &&
                op_members.includes(message.author.id))
        ) {
            const op_embed_data = JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, "../embeds/op_bypass.json"),
                    "utf8"
                )
            );

            const op_embed = new EmbedBuilder()
                .setTitle(op_embed_data.title)
                .setDescription(op_embed_data.description)
                .setColor(op_embed_data.color)
                .setAuthor({
                    name: op_embed_data.author.name,
                    url:
                        op_embed_data.author.url ||
                        "https://www.ecole-directe.plus/",
                    iconURL: op_embed_data.author.icon_url,
                });

            try {
                await message.author.send({ embeds: [op_embed] });
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
        const mod_role = message.guild.roles.cache.find(
            (role) => role.id === "1319230810691207209"
        ); // reel: "1170362568297164820"
        const mod_channel = message.guild.channels.cache.find(
            (channel) => channel.id === "1318947548563636324"
        ); // reel: "1170356329722949652"
        const general_channel = message.guild.channels.cache.find(
            (channel) => channel.id === "1318947548563636324"
        ); // reel: "1170357852846686228"
        const member = message.member;
        const content = message.content.toLowerCase();

        let ai_detection = "pass";

        async function getGroqChatCompletion() {
            return groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content:
                            "je vais t'envoyer des messages, Vérifie les en fonction des règles suivantes : Aucun contenu sexuellement explicite. Aucun contenu pornographique. Aucun contenu NSFW. Aucun contenu illégal. Pas de modding. Pas de piratage. Aucune publication d'informations personnelles (y compris les vrais noms, adresses, e-mails, mots de passe, informations de compte bancaire et de carte de crédit, etc.). Aucune attaque personnelle. Pas de harcèlement. Pas de sexisme. Pas de racisme. Pas de discours de haine. Pas de langage offensant. Pas de discussions religieuses. Pas de discussions politiques. Pas de discussions sexuelles. Pas de spam. Pas de message excessif (briser une idée dans de nombreux messages au lieu de tout écrire dans un seul article). Pas de murs de texte (que ce soit dans des messages séparés ou comme un seul message). Pas de verrouillage des majuscules. Pas d'emojis abusifs. Pas de réactions abusives. Les modérateurs se réservent le droit de supprimer tout message. Les modérateurs se réservent le droit de modifier n'importe quel message. Pas de publicité sans permission. Aucun lien vers d'autres serveurs. Le bot commande uniquement sous #robots. Réponds par 'block' si le message enfreint ces règles, et par 'pass' s'il les respecte.",
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
        ai_detection = chatCompletion.choices[0]?.message?.content;

        if (ai_detection === "block") {
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
                    iconURL: userWarnEmbedContent.author.icon_url,
                });

            try {
                await member.send({ embeds: [userWarnEmbed] });
            } catch (error) {
                if (error.code === 50007) {
                    console.log(
                        "Impossible d'envoyer un message privé à l'utilisateur."
                    );
                }
            }

            const modWarnEmbedContent = JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, "../embeds/warn_mod.json"),
                    "utf8"
                )
            );
            let description = modWarnEmbedContent.description
                .replace("{modos.mention}", mod_role.tag)
                .replace("{message.author}", member.user.username)
                .replace("{message.author.name}", member.user.globalName)
                .replace("{message.content}", message.content);

            const modWarnEmbed = new EmbedBuilder()
                .setTitle(modWarnEmbedContent.title)
                .setDescription(description)
                .setColor(modWarnEmbedContent.color);

            await mod_channel.send({ embeds: [modWarnEmbed] });

            const comAlertEmbedContent = JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, "../embeds/warn_com.json"),
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
                    iconURL: comAlertEmbedContent.author.icon_url,
                });

            await general_channel.send({ embeds: [comAlertEmbed] });

            console.log("Opération de modération effectuée.");
        }
    },
};
