const { promisify } = require("util");
const { glob } = require("glob");
const pGlob = promisify(glob);

module.exports = async Client => {
    const commandFiles = await pGlob(`${process.cwd()}/src/commands/**/*.js`);
    
    console.log(`[CMD] - Fichiers de commandes trouvés : ${commandFiles.length}`);

    for (const cmdFile of commandFiles) {
        const cmd = require(cmdFile);
        
        console.log(`[CMD] - Chargement de la commande : ${cmdFile}`);

        if (!cmd.name || !cmd.description) {
            console.log(`[CMD] - Couldn't load command : No name and/or description - File : ${cmdFile}`);
            continue;
        }
        
        Client.commands.set(cmd.name, cmd);
        console.log(`[CMD] - Commande chargée : ${cmd.name}`);
    }
};