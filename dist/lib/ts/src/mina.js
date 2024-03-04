"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime = exports.accountBalanceMina = exports.accountBalance = exports.sleep = exports.makeString = exports.Memory = exports.initBlockchain = void 0;
const o1js_1 = require("o1js");
const networks_1 = require("./networks");
function initBlockchain(instance) {
    if (instance === "local") {
        const Local = o1js_1.Mina.LocalBlockchain({ proofsEnabled: true });
        o1js_1.Mina.setActiveInstance(Local);
        return { keys: Local.testAccounts };
    }
    else if (instance === "berkeley") {
        const network = o1js_1.Mina.Network({
            mina: networks_1.Berkeley.mina,
            archive: networks_1.Berkeley.archive,
        });
        o1js_1.Mina.setActiveInstance(network);
        return { keys: [], url: networks_1.Berkeley };
    }
    else if (instance === "testworld2") {
        const network = o1js_1.Mina.Network({
            mina: networks_1.TestWorld2.mina,
            archive: networks_1.TestWorld2.archive,
        });
        o1js_1.Mina.setActiveInstance(network);
        return { keys: [], url: networks_1.TestWorld2 };
    }
    else if (instance === "lighnet") {
        const network = o1js_1.Mina.Network({
            mina: networks_1.Lightnet.mina,
            archive: networks_1.Lightnet.archive,
            lightnetAccountManager: networks_1.Lightnet.accountManager,
        });
        o1js_1.Mina.setActiveInstance(network);
        return { keys: [], url: networks_1.Lightnet };
    }
    else {
        throw new Error("Mainnet is not supported yet by zkApps");
    }
}
exports.initBlockchain = initBlockchain;
async function accountBalance(address) {
    await (0, o1js_1.fetchAccount)({ publicKey: address });
    if (o1js_1.Mina.hasAccount(address))
        return o1js_1.Mina.getBalance(address);
    else
        return o1js_1.UInt64.from(0);
}
exports.accountBalance = accountBalance;
async function accountBalanceMina(address) {
    return Number((await accountBalance(address)).toBigInt()) / 1e9;
}
exports.accountBalanceMina = accountBalanceMina;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function makeString(length) {
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let outString = ``;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const inOptions = `abcdefghijklmnopqrstuvwxyz0123456789`;
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
    if (ms < 60 * 60 * 1000)
        return parseInt((ms / 1000 / 60).toString()).toString() + " min";
    return parseInt((ms / 1000 / 60 / 60).toString()).toString() + " h";
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
