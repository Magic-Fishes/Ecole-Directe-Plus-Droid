const { ActivityType } = require("discord.js");

const setDroidStatus = (
    client,
    msg = "Sleepping 🌛",
    type = ActivityType.Custom
) => {
    if (!Object.values(ActivityType).includes(type)) {
        throw new Error("Invalid activity type");
    }
    client.user.setActivity({
        name: msg,
        type: type,
    });
};

module.exports = { setDroidStatus };
