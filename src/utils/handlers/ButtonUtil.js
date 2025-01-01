const { glob } = require("glob");
const ctx = new (require("../../global/context"))();

module.exports = async (Client) => {
    const cwd = process.cwd();
    (await glob(`${cwd}/src/buttons/**/*.js`)).map(async (buttonFile) => {
        const button = require(
            ctx.get("IS_WINDOWS") ? `${cwd}/${buttonFile}` : `${buttonFile}`
        );

        if (!button.name) {
            console.log(
                `[BTN] - Couldn't load button: No name - File: ${buttonFile}`
            );
            return;
        }

        Client.buttons.set(button.name, button);
        const buttonsList = ctx.get("BUTTONS_LIST");
        buttonsList.push(button.name);
        ctx.set("BUTTONS_LIST", buttonsList);
    });
};

