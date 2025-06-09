const { glob } = require("glob");
const logger = require("../../helpers/logger");
const ctx = new (require("../../global/context"))();

const eventList = [
    "apiRequest",
    "apiResponse",
    "applicationCommandCreate",
    "applicationCommandDelete",
    "applicationCommandUpdate",
    "channelCreate",
    "channelDelete",
    "channelPinsUpdate",
    "channelUpdate",
    "debug",
    "emojiCreate",
    "emojiDelete",
    "emojiUpdate",
    "error",
    "guildBanAdd",
    "guildBanRemove",
    "guildCreate",
    "guildDelete",
    "guildIntegrationsUpdate",
    "guildMemberAdd",
    "guildMemberAvailable",
    "guildMemberRemove",
    "guildMembersChunk",
    "guildMemberUpdate",
    "guildScheduledEventCreate",
    "guildScheduledEventDelete",
    "guildScheduledEventUpdate",
    "guildScheduledEventUserAdd",
    "guildScheduledEventUserRemove",
    "guildUnavailable",
    "guildUpdate",
    "interaction",
    "interactionCreate",
    "invalidated",
    "invalidRequestWarning",
    "inviteCreate",
    "inviteDelete",
    "message",
    "messageCreate",
    "messageDelete",
    "messageDeleteBulk",
    "messageReactionAdd",
    "messageReactionRemove",
    "messageReactionRemoveAll",
    "messageReactionRemoveEmoji",
    "messageUpdate",
    "presenceUpdate",
    "rateLimit",
    "ready",
    "roleCreate",
    "roleDelete",
    "roleUpdate",
    "shardDisconnect",
    "shardError",
    "shardReady",
    "shardReconnecting",
    "shardResume",
    "stageInstanceCreate",
    "stageInstanceDelete",
    "stageInstanceUpdate",
    "stickerCreate",
    "stickerDelete",
    "stickerUpdate",
    "threadCreate",
    "threadDelete",
    "threadListSync",
    "threadMembersUpdate",
    "threadMemberUpdate",
    "threadUpdate",
    "typingStart",
    "userUpdate",
    "voiceStateUpdate",
    "warn",
    "webhookUpdate",
];

module.exports = async (Client) => {
    const cwd = process.cwd();

    (await glob(`${cwd}/src/events/**/*.js`)).map(async (eventFile) => {
        const event = require(
            ctx.get("IS_WINDOWS") ? `${cwd}/${eventFile}` : `${eventFile}`
        );

        if (!eventList.includes(event.name) || !event.name) {
            return logger.error(
                `[EVT] - Couldn't load Event : This event may not exist or has no name - File : ${eventFile}`
            );
        }

        if (event.once) {
            Client.once(event.name, (...args) =>
                event.execute(Client, ...args)
            );
        } else {
            Client.on(event.name, (...args) => event.execute(Client, ...args));
        }
        const eventsList = ctx.get("EVENTS_LIST");
        eventsList.push(event.name);
        ctx.set("EVENTS_LIST", eventsList);
    });
};

