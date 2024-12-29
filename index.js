const Discord = require("discord.js");
require("dotenv").config();

const Client = new Discord.Client({ partials: ["CHANNEL"], intents: 19992575 });

// Error handling 

process.on("exit", code => {console.log("Le processus s'est arrêté avec le code : " + code) });
process.on("uncaughtException", (err, origin) => { console.log("[UNCAUGHT_EXCEPTION] : " + err, "Origine : " + origin)});
process.on("unhandledRejection", (reason, promise) => { console.log("[UNHANDLED_REJECTION] : " + reason, "Promise : " + promise)});
process.on("warning", (...args) => { console.log("[WARNING] :", ...args)});

Client.on("error", console.error);
Client.on("warn", console.warn);

["commands", "cooldowns", "buttons", "selects"].forEach(x => Client[x] = new Discord.Collection());
require(`./src/utils/handlers/CommandUtil`)(Client)
require(`./src/utils/handlers/EventUtil`)(Client)
require(`./src/utils/handlers/ButtonUtil`)(Client)
require(`./src/utils/handlers/SelectUtil`)(Client)

Client.login(process.env.TOKEN);
console.log(`BOT Running in ${process.env.NODE_ENV}`)