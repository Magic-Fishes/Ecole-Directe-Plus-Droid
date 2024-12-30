const { glob } = require("glob");

module.exports = async (Client) => {
    const cwd = process.cwd();
    (await glob(`${cwd}/src/selectMenus/**/*.js`)).map(
        async (selectMenuFile) => {
            const selectMenu = require(`${cwd}/${selectMenuFile}`);

            if (!selectMenu.name)
                return console.log(
                    `[SLC] - Couldn't load selector : Typeerror (or no name) - File : ${eventFile}`
                );

            Client.selects.set(selectMenu.name, selectMenu);
            console.log(`[SLC] - Select menu ready : ${selectMenu.name}`);
        }
    );
};
