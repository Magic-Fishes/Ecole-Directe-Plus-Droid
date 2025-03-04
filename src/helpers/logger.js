const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const logger = createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.Console(),
        new DailyRotateFile({
            filename: "application-%DATE%.log",
            datePattern: "YYYY-MM-DD-HH",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
        }),
    ],
});

module.exports = logger;

