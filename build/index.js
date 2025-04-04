"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const dimensions_1 = require("dimensions");
const configloader_1 = require("dimensions/configloader");
const winston = require("winston");
let fileFormat = winston.format.json();
if (((_a = configloader_1.ConfigSettings.options.log.format) === null || _a === void 0 ? void 0 : _a.file) === "PlainText") {
    fileFormat = winston.format.combine(winston.format.colorize(), winston.format.printf(info => {
        return `${info.message}`;
    }));
}
let consoleFormat = fileFormat = winston.format.combine(winston.format.colorize(), winston.format.printf(info => {
    return `${info.message}`;
}));
if (((_b = configloader_1.ConfigSettings.options.log.format) === null || _b === void 0 ? void 0 : _b.console) === "JSON") {
    consoleFormat = winston.format.json();
}
let logging = winston.createLogger({
    level: 'info',
    transports: []
});
if (configloader_1.ConfigSettings.options.log.outputToFile) {
    logging.add(new winston.transports.File({ filename: 'dimensions.log', level: 'info', format: fileFormat }));
    logging.add(new winston.transports.File({ filename: 'error.log', level: 'error', format: fileFormat }));
}
if (configloader_1.ConfigSettings.options.log.outputToConsole) {
    logging.add(new winston.transports.Console({
        format: consoleFormat
    }));
}
process.on('unhandledRejection', (reason, _promise) => {
    logging.error('unhandledRejection Reason: ' + reason.stack);
});
process.on('uncaughtException', function (e) {
    logging.error(e, e.stack);
});
var dimensions = new dimensions_1.default(logging);
process.once('SIGTERM', () => {
    dimensions.close();
});
process.once('SIGINT', () => {
    dimensions.close();
});
