const { EmbedBuilder } = require("discord.js");
const fs = require('fs');


const packageData = JSON.parse(fs.readFileSync('package.json', 'utf8'));


const version = packageData.version;
const as_de_pique = '<@744177952346079253>';
const ewalwi = '<@899703183520182322>'
const théo = '<@1326235827541381180>'


module.exports = {
    name: 'botinfo',
    description: 'Displays all the bot informations.',
    options: [],
    restricted: false,

    runSlash: async (_, interaction) => {
        const embed = new EmbedBuilder()
            .setColor('#0004ff')
            .setTitle('Informations de "Ecole-Directe-Plus-Droid"')
            .setDescription('Les informations me concernant :')
            .addFields(
                { name: 'Nom :', value: 'Ecole-Directe-Plus-Droid', inline: true },
                { name: 'Développeurs :', value: 'Mes développeurs sont : ' + as_de_pique + ', ' + ewalwi + ' et ' + théo + ' ! 🤖' },
                { name: 'Version :', value: 'Ma version est la ' + version + ' ! ⚙️' },
                { name: 'Open-Source :', value: 'Je suis un bot Open-Source, c\'est à dire que tout le monde peut voir mon code source [ici](https://github.com/Magic-Fishes/Ecole-Directe-Plus-Droid/) !' },
            )
            .setAuthor({
                name: 'Ecole-Directe-Plus',
                iconURL: 'https://pbs.twimg.com/profile_images/1680302515097673729/x1cHA0q5_400x400.png',
                url: 'https://ecole-directe.plus'
              });

        await interaction.reply({ embeds: [embed] });
    },
};
