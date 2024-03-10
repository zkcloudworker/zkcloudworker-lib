"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetworkIdHash = exports.currentNetwork = exports.formatTime = exports.accountBalanceMina = exports.accountBalance = exports.sleep = exports.makeString = exports.Memory = exports.initBlockchain = void 0;
const o1js_1 = require("o1js");
const networks_1 = require("./networks");
let currentNetwork = undefined;
exports.currentNetwork = currentNetwork;
function getNetworkIdHash() {
    if (currentNetwork === undefined) {
        throw new Error("Network is not initialized");
    }
    return currentNetwork.networkIdHash;
}
exports.getNetworkIdHash = getNetworkIdHash;
/*function getNetworkIdHash(params: {
  chainId?: blockchain;
  verbose?: boolean;
}): Field {
  const { chainId, verbose } = params;
  if (chainId !== undefined) {
    if (verbose) console.log(`Chain ID: ${chainId}`);
    return CircuitString.fromString(chainId).hash();
  }
  const networkId = Mina.getNetworkId();
  if (verbose) console.log(`Network ID: ${networkId}`);
  if (networkId === "testnet")
    throw new Error(
      "Network ID is not set, please call initBlockchain() first"
    );

  if (networkId === "mainnet")
    return CircuitString.fromString("mainnet").hash();
  else {
    if (
      networkId.custom === undefined ||
      typeof networkId.custom !== "string"
    ) {
      throw new Error(
        "Network ID is not set, please call initBlockchain() first"
      );
    }
    return CircuitString.fromString(networkId.custom).hash();
  }
}
*/
function initBlockchain(instance, deployersNumber = 0) {
    if (instance === "mainnet") {
        throw new Error("Mainnet is not supported yet by zkApps");
    }
    if (instance === "local") {
        const local = o1js_1.Mina.LocalBlockchain({
            proofsEnabled: true,
        });
        o1js_1.Mina.setActiveInstance(local);
        exports.currentNetwork = currentNetwork = {
            keys: local.testAccounts,
            network: networks_1.Local,
            networkIdHash: o1js_1.CircuitString.fromString("local").hash(),
        };
        return currentNetwork;
    }
    const network = networks_1.networks.find((n) => n.chainId === instance);
    if (network === undefined) {
        throw new Error("Unknown network");
    }
    const networkInstance = o1js_1.Mina.Network({
        mina: network.mina,
        archive: network.archive,
        lightnetAccountManager: network.accountManager,
    });
    o1js_1.Mina.setActiveInstance(networkInstance);
    const keys = [];
    if (deployersNumber > 0) {
        if (instance === "lighnet") {
            throw new Error("Use await Lightnet.acquireKeyPair() to get keys for Lightnet");
        }
        else {
            const deployers = process.env.DEPLOYERS;
            if (deployers === undefined ||
                Array.isArray(deployers) === false ||
                deployers.length < deployersNumber)
                throw new Error("Deployers are not set");
            for (let i = 0; i < deployersNumber; i++) {
                const privateKey = o1js_1.PrivateKey.fromBase58(deployers[i]);
                const publicKey = privateKey.toPublicKey();
                keys.push({ publicKey, privateKey });
            }
        }
    }
    exports.currentNetwork = currentNetwork = {
        keys,
        network,
        networkIdHash: o1js_1.CircuitString.fromString(instance).hash(),
    };
    return currentNetwork;
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
