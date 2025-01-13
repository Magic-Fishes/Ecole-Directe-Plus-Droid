const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

let discordChannel = null;

function formatMessage(args) {
    return args.map(arg => {
        if (typeof arg === 'object') {
            return '```json\n' + JSON.stringify(arg, null, 2) + '\n```';
        }
        return String(arg);
    }).join(' ');
}

function initializeLogger(channel) {
    discordChannel = channel;

    console.log = function (...args) {
        originalConsoleLog.apply(console, args);
        if (discordChannel) {
            const message = formatMessage(args);
            discordChannel.send(`📝 **Log**: ${message}`).catch(err => {
                originalConsoleError('Error sending log to Discord:', err);
            });
        }
    };

    console.error = function (...args) {
        originalConsoleError.apply(console, args);
        if (discordChannel) {
            const message = formatMessage(args);
            discordChannel.send(`❌ **Error**: ${message}`).catch(err => {
                originalConsoleError('Error sending error to Discord:', err);
            });
        }
    };

    console.warn = function (...args) {
        originalConsoleWarn.apply(console, args);
        if (discordChannel) {
            const message = formatMessage(args);
            discordChannel.send(`⚠️ **Warning**: ${message}`).catch(err => {
                originalConsoleError('Error sending warning to Discord:', err);
            });
        }
    };
}

module.exports = { initializeLogger };
