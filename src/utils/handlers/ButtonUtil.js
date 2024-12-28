const { promisify } = require("util");
const { glob } = require("glob");
const pGlob = promisify(glob);

module.exports = async Client => {
    (await pGlob(`${process.cwd()}/src/buttons/**/*.js`)).map(async btnFile => {
        const btn = require(btnFile)

        if (!btn.name) return console.log(`[BTN] - Couldn't load button : No name - File : ${btnFile}`)
        Client.buttons.set(btn.name, btn)
        console.log(`[BTN] - Bouton chargé : ${btn.name}`)
    })
}