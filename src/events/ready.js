const { setDroidStatus } = require("../utils/handlers/setDroidStatus");

const ctx = new (require("../global/context"))();
require("dotenv").config();

const getAuthorizations = async (client) => {
    const guild = client.guilds.cache.find(
        (s) => s.id === process.env.MAIN_SERVER_ID
    );
    if (!guild) {
        console.log(`The bot is not in ${process.env.MAIN_SERVER_ID}.`);
        process.abort();
    }

    const botMember = await guild.members.fetch(client.user.id);

    const botPermissions = botMember.permissions.toArray().sort();

    ctx.set("AUTHORIZATIONS_LIST", botPermissions);
};

module.exports = {
    name: "ready",
    once: true,
    async execute(Client) {
        Client.guilds.cache.forEach((guild) =>
            guild.commands.set(Client.commands.map((cmd) => cmd))
        );

        await getAuthorizations(Client);

        // console.log(ctx.get("BUTTONS_LIST"));
        // console.log(ctx.get("COMMANDS_LIST"));
        // console.log(ctx.get("EVENTS_LIST"));
        // console.log(ctx.get("SELECT_MENUS_LIST"));

        const loadedComponents = {
            Buttons: ctx.get("BUTTONS_LIST"),
            Commands: ctx.get("COMMANDS_LIST"),
            Events: ctx.get("EVENTS_LIST"),
            "Select Menus": ctx.get("SELECT_MENUS_LIST"),
            // Permissions: ctx.get("AUTHORIZATIONS_LIST"), // uncomment this to see permissions of bot in server
        };
        // console.log(ctx.get()); // uncomment this to see context content

        const maxLength = Math.max(
            ...Object.values(loadedComponents).map((list) => list.length)
        );

        const tableData = Array.from({ length: maxLength }, (_, index) => {
            const row = {};
            Object.keys(loadedComponents).forEach((category) => {
                row[category] = loadedComponents[category][index] || "";
            });
            return row;
        });
        console.log("LOADED COMPONENTS:");
        console.table(tableData);
        setDroidStatus(Client);
        console.log(
            "Beep boop! I'm alive and ready to take over the world... or just do my job."
        );
        process.env.NODE_ENV === "development"
            ? console.log(`BOT Running in ${process.env.NODE_ENV}`)
            : null;
    },
};

