const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const moment = require("moment");

const customTimestampFormat = format((info, opts) => {
    info.timestamp = moment().format("YYYY-MM-DD_HH-mm-ss");
    return info;
});

const logger = createLogger({
    level: "info",
    format: format.combine(customTimestampFormat(), format.json()),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "combined.log" }),
    ],
});

module.exports = logger;

