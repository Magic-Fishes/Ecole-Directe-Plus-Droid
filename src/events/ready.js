const Context = require("../global/data");
const ctx = new Context();

const fs = require("fs");

const readWordList = async () => {
    const authorizedWords = [];
    try {
        const data = await fs.promises.readFile(
            `${process.cwd()}/src/events/wordlist/excludedWords.txt`,
            "utf8"
        );
        const lignes = data.split("\n");
        lignes.forEach((ligne) => {
            authorizedWords.push(ligne.trim());
        });

        ctx.set("WORD_LIST", authorizedWords);
    } catch (err) {
        console.error("Erreur lors de la lecture du fichier:", err);
    }
};

module.exports = {
    name: "ready",
    once: true,
    async execute(Client) {
        await readWordList();

        const wordList = ctx.get("WORD_LIST");
        if (wordList) {
        } else {
            console.error(
                "La liste des mots n'a pas été chargée correctement."
            );
        }

        // Configuration des commandes
        Client.guilds.cache.forEach((guild) =>
            guild.commands.set(Client.commands.map((cmd) => cmd))
        );

        console.log("Bot ON");
    },
};
