const { promisify } = require("util");
const { glob } = require("glob");
const pGlob = promisify(glob);

module.exports = async Client => {
    (await pGlob(`${process.cwd()}/src/selects/**/*.js`)).map(async selectMenuFile => {
        const selectMenu = require(selectMenuFile)

        if (!selectMenu.name) return console.log(`[SLC] - Couldn't load selector : Typeerror (or no name) - File : ${eventFile}`);

        Client.selects.set(selectMenu.name, selectMenu);

        console.log(`[SLC] - Select Menu Loaded : ${selectMenu.name}`)
    })
}