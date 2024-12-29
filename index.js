const Discord = require("discord.js");
require("dotenv").config();

const Client = new Discord.Client({ partials: ["CHANNEL"], intents: 19992575 });

// Error handling 

process.on("exit", code => {console.log("Le processus s'est arrêté avec le code : " + code) });
process.on("uncaughtException", (err) => { console.log(`[UNCAUGHT_EXCEPTION] : ${err}\nAt :\n${err.stack}`)});
process.on("unhandledRejection", (reason) => { console.log(`[UNHANDLED_REJECTION] : ${err}\nAt :\n${reason.stack}`)});
process.on("warning", (...args) => { console.log("[WARNING] :", ...args)});

// Client.on("error", console.error);
// Client.on("warn", console.warn);

["commands", "cooldowns", "buttons", "selects"].forEach(x => Client[x] = new Discord.Collection());
require(`./src/utils/handlers/CommandUtil`)(Client);
require(`./src/utils/handlers/EventUtil`)(Client);
require(`./src/utils/handlers/ButtonUtil`)(Client);
require(`./src/utils/handlers/SelectMenuUtil`)(Client);

Client.login(process.env.TOKEN);
console.log(`BOT Running in ${process.env.NODE_ENV}`)