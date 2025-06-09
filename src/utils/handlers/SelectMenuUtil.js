const { glob } = require("glob");
const logger = require("../../helpers/logger");
const ctx = new (require("../../global/context"))();

module.exports = async (Client) => {
    const cwd = process.cwd();
    (await glob(`${cwd}/src/selectMenus/**/*.js`)).map(
        async (selectMenuFile) => {
            const selectMenu = require(
                ctx.get("IS_WINDOWS")
                    ? `${cwd}/${selectMenuFile}`
                    : `${selectMenuFile}`
            );

            if (!selectMenu.name)
                return logger.error(
                    `[SLC] - Couldn't load selector : Typeerror (or no name) - File : ${eventFile}`
                );

            Client.selects.set(selectMenu.name, selectMenu);
            const selectMenus = ctx.get("SELECT_MENUS_LIST");
            selectMenus.push(selectMenu.name);
            ctx.set("SELECT_MENUS_LIST", selectMenus);
        }
    );
};

