const { glob } = require("glob");

module.exports = async Client => {
    const cwd = process.cwd();
    (await glob(`${cwd}/src/buttons/**/*.js`)).map(async buttonFile => {
        const button = require(`${cwd}/${buttonFile}`);

        if (!button.name) return console.log(`[BTN] - Couldn't load button : No name - File : ${buttonFile}`)
        Client.buttons.set(button.name, button)
        console.log(`[BTN] - Bouton ready : ${button.name}`)
    })
}