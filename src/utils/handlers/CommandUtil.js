const { glob } = require("glob");
const logger = require("../../helpers/logger");
const ctx = new (require("../../global/context"))();

module.exports = async (Client) => {
    const cwd = process.cwd();

    (await glob(`${cwd}/src/commands/**/*.js`)).map(async (commandFile) => {
        const command = require(
            ctx.get("IS_WINDOWS") ? `${cwd}/${commandFile}` : `${commandFile}`
        );

        if (!command.name || !command.description)
            return logger.error(
                `[CMD] - Couldn't load command : No name and/or description - File : ${commandFile}`
            );

        Client.commands.set(command.name, command);
        const commandsList = ctx.get("COMMANDS_LIST");
        commandsList.push(command.name);
        ctx.set("COMMANDS_LIST", commandsList);
    });
};

