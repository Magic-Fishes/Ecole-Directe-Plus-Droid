const Discord = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
require("dotenv").config();
const client = new Discord.Client({ intents: 3276799 });

eventHandler(client);

client.login(process.env.TOKEN);