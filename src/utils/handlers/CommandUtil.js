const { promisify } = require("util");
const { glob } = require("glob");
const pGlob = promisify(glob);

module.exports = async Client => {
    (await pGlob(`${process.cwd()}/src/commands/**/*.js`)).map(async cmdFile => {
        const cmd = require(cmdFile)

        if (!cmd.name || !cmd.description) return console.log(`[CMD] - Couldn't load command : No name and/or description - File : ${cmdFile}`)
        Client.commands.set(cmd.name, cmd)
        console.log(`[CMD] - Commande chargé : ${cmd.name}`)
    })
}