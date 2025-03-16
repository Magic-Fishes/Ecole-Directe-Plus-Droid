
# Canard Droïd 

Canard Droïd is the new **Discord bot** of **Ecole Directe Plus** platform !


---

## New Features 🎉

- 100% automatic moderation to prevent suspicious comportements
- All Ecole Directe Plus statistics, member count, daily usage, bests platforms, ...
- Beautiful welcome message sended to new users
- Easy pannel to moderate more specificly
- Do announcements in one command with custom embed !
- A lot of other things...!



## How to use 📘​

**Go to [Ecole Directe Plus Discord](https://discord.gg/AKAqXfTgvE) server**

Say Hello 👋​ to others peoples and start to use the bot, start with `/help` command to see all available commands
## Contributing 🖇️​

Contributions are always welcome!

To contribute at this discord.JS project, start to clone this repo on your computer by following theses steps:



- Clone the repo on your local machine

    > ```git clone https://github.com/Magic-Fishes/Ecole-Directe-Plus-Droid ```

- Run these commands
    > ``` cd Ecole-Directe-Plus-Droid```
    
    >```npm i```
    
    >```echo TOKEN=<YOUR PRIVATE TOKEN> > .env```
    
    

Now go to the [Discord Devlopper Portal](https://discord.com/developers/applications) and create new app, go to "Bot" section and clic on "Reset Token" to get your token, copy it and **do not share it with anyone it's PRIVATE !**

Now go back in your CLONE, go into the `.env` file, normaly you will find a key named `TOKEN`, after `=`, paste your private discord bot token.

We're almost there...

Always in `.env`, paste theses lines next to your `TOKEN`

```SOCKET_URL=wss://ecole-directe.plus/ws:7890
GROQ_API_KEY=<YOUR GROQ API KEY>
NODE_ENV=developpment
MAIN_SERVER_ID=<YOUR SERVER ID>
```

Complete your Groq api key in the `GROQ_API_KEY`.

To get your server ID, start by activate devlopper mode on your account by [following this guide](https://www.howtogeek.com/714348/how-to-enable-or-disable-developer-mode-on-discord/)
After that, go to your server, right clic on the top banner with your server name, and clic "Copy Server ID" with de `ID` icon.

Paste it in the `MAIN_SERVER_ID` in your `.env`

Congrats  🎉 🎉 🎉

You can start edit files and run your bot by execute this in your projet folder `npm run dev` !
## Environment Variables 🌳​

To run this project, you will need to add the following environment variables to your .env file

`TOKEN` > Your discord bot token available in the [Discord Devlopper Portal](https://discord.com/developers/applications/)

`GROQ_API_KEY` > Your Groq API Key to enable Auto-Moderation

`NODE_ENV` > Don't touch that

`MAIN_SERVER_ID` > Your discord server ID


## Support 📞​

#### For support, go on the [Ecole Directe Plus Discord Server](https://discord.gg/AKAqXfTgvE) to get help, we will be happy to answer you !

#

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Authors 🪶

[![License: MIT](https://img.shields.io/badge/As_de_Pique-@as2pick-3CB371)](https://github.com/as2pick)

[![License: MIT](https://img.shields.io/badge/Ewalwi-@ewalwi-00BFFF)](https://github.com/Ewalwi)
