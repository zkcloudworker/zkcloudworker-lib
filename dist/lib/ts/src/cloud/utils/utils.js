"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = exports.formatTime = exports.makeString = exports.sleep = void 0;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function makeString(length) {
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let outString = ``;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const inOptions = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
    for (let i = 0; i < length; i++) {
        outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
    }
    return outString;
}
exports.makeString = makeString;
function formatTime(ms) {
    if (ms === undefined)
        return "";
    if (ms < 1000)
        return ms.toString() + " ms";
    if (ms < 60 * 1000)
        return parseInt((ms / 1000).toString()).toString() + " sec";
    if (ms < 60 * 60 * 1000) {
        const minutes = parseInt((ms / 1000 / 60).toString());
        const seconds = parseInt(((ms - minutes * 60 * 1000) / 1000).toString());
        return minutes.toString() + " min " + seconds.toString() + " sec";
    }
    else {
        const hours = parseInt((ms / 1000 / 60 / 60).toString());
        const minutes = parseInt(((ms - hours * 60 * 60 * 1000) / 1000 / 60).toString());
        return hours.toString() + " h " + minutes.toString() + " min";
    }
}
exports.formatTime = formatTime;
class Memory {
    constructor() {
        Memory.rss = 0;
    }
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    static info(description = ``, fullInfo = false) {
        const memoryData = process.memoryUsage();
        const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024)} MB`;
        const oldRSS = Memory.rss;
        Memory.rss = Math.round(memoryData.rss / 1024 / 1024);
        const memoryUsage = fullInfo
            ? {
                step: `${description}:`,
                rssDelta: `${(oldRSS === 0
                    ? 0
                    : Memory.rss - oldRSS).toString()} MB -> Resident Set Size memory change`,
                rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated`,
                heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
                heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
                external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
            }
            : `RSS memory ${description}: ${formatMemoryUsage(memoryData.rss)}${oldRSS === 0
                ? ``
                : `, changed by ` + (Memory.rss - oldRSS).toString() + ` MB`}`;
        console.log(memoryUsage);
    }
}
exports.Memory = Memory;
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
Memory.rss = 0;
