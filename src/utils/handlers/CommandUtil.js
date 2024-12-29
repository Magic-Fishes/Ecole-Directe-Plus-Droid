const { glob } = require("glob");

module.exports = async Client => {
    const cwd = process.cwd();
    (await glob(`${cwd}/src/commands/**/*.js`)).map(async commandFile => {
        const command = require(`${cwd}/${commandFile}`);

        if (!command.name || !command.description) return console.log(`[CMD] - Couldn't load command : No name and/or description - File : ${commandFile}`);

        Client.commands.set(command.name, command);
        console.log(`[CMD] - Command ready : ${command.name}`);
    })
};
