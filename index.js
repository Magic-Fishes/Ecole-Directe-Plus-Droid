const Discord = require("discord.js");
require("dotenv").config();
const ctx = new (require("./src/global/context"))();
const os = require("os");

const Client = new Discord.Client({ partials: ["CHANNEL"], intents: 53608447 });

const progInit = () => {
    ctx.set("BUTTONS_LIST", []);
    ctx.set("COMMANDS_LIST", []);
    ctx.set("EVENTS_LIST", []);
    ctx.set("SELECT_MENUS_LIST", []);
    ctx.set("AUTHORIZATIONS_LIST", []);

    const botVersion = "1.0.0";
    const authorizedArch = ["x64", "arm64", "ppc64", "s390x"];
    const osExecutionDetails = {
        platform: os.platform(),
        arch: os.arch(),
    };

    if (authorizedArch.includes(osExecutionDetails.arch)) {
        ctx.set("RUNNING_SYSTEM", osExecutionDetails);

        console.log(
            `[LAD] - Active running system is authorized and registered : ${osExecutionDetails.platform}`
        );
    } else {
        console.log("[LAD] - Active running system is unauthorized. Stopping.");
        process.abort();
    }

    // main devloppement system is WINDOWS ! so :

    switch (osExecutionDetails.platform) {
        case "linux":
            console.log("[LAD] - Active system is not Windows, registering.");
            ctx.set("IS_WINDOWS", false);
            break;
        case "win32":
            console.log("[LAD] - Active system is Windows, registering.");
            ctx.set("IS_WINDOWS", true);
        default:
            console.log("[ERR] - Unrecognized system");
    }
};

const loadComponents = () => {
    ["commands", "cooldowns", "buttons", "selects"].forEach(
        (x) => (Client[x] = new Discord.Collection())
    );
    require(`./src/utils/handlers/CommandUtil`)(Client);
    require(`./src/utils/handlers/EventUtil`)(Client);
    require(`./src/utils/handlers/ButtonUtil`)(Client);
    require(`./src/utils/handlers/SelectMenuUtil`)(Client);
};
// Error handling

process.on("exit", (code) => {
    console.log("Le processus s'est arrêté avec le code : " + code);
});
process.on("uncaughtException", (err) => {
    console.log(`[UNCAUGHT_EXCEPTION] : ${err}\nAt :\n${err.stack}`);
});
process.on("unhandledRejection", (reason) => {
    console.log(`[UNHANDLED_REJECTION] : ${reason}\nAt :\n${reason.stack}`);
});
process.on("warning", (...args) => {
    console.log("[WARNING] :", ...args);
});

// Client.on("error", console.error);
// Client.on("warn", console.warn);
console.log(`BOT Running in ${process.env.NODE_ENV}`);

progInit();
loadComponents();
Client.login(process.env.TOKEN);

