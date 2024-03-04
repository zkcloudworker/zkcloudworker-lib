import { __awaiter } from "tslib";
export { initBlockchain, Memory, makeString, sleep, accountBalance, accountBalanceMina, formatTime, };
import { Mina, UInt64, fetchAccount } from "o1js";
import { Berkeley, TestWorld2, Lightnet as Lightnet, } from "./networks";
function initBlockchain(instance) {
    if (instance === "local") {
        const Local = Mina.LocalBlockchain({ proofsEnabled: true });
        Mina.setActiveInstance(Local);
        return { keys: Local.testAccounts };
    }
    else if (instance === "berkeley") {
        const network = Mina.Network({
            mina: Berkeley.mina,
            archive: Berkeley.archive,
        });
        Mina.setActiveInstance(network);
        return { keys: [], url: Berkeley };
    }
    else if (instance === "testworld2") {
        const network = Mina.Network({
            mina: TestWorld2.mina,
            archive: TestWorld2.archive,
        });
        Mina.setActiveInstance(network);
        return { keys: [], url: TestWorld2 };
    }
    else if (instance === "lighnet") {
        const network = Mina.Network({
            mina: Lightnet.mina,
            archive: Lightnet.archive,
            lightnetAccountManager: Lightnet.accountManager,
        });
        Mina.setActiveInstance(network);
        return { keys: [], url: Lightnet };
    }
    else {
        throw new Error("Mainnet is not supported yet by zkApps");
    }
}
function accountBalance(address) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetchAccount({ publicKey: address });
        if (Mina.hasAccount(address))
            return Mina.getBalance(address);
        else
            return UInt64.from(0);
    });
}
function accountBalanceMina(address) {
    return __awaiter(this, void 0, void 0, function* () {
        return Number((yield accountBalance(address)).toBigInt()) / 1e9;
    });
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
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
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
Memory.rss = 0;
//# sourceMappingURL=mina.js.map