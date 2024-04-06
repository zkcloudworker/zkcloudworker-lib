import { __awaiter } from "tslib";
export { initBlockchain, Memory, makeString, sleep, accountBalance, accountBalanceMina, formatTime, currentNetwork, getNetworkIdHash, getDeployer, };
import { Mina, PrivateKey, UInt64, fetchAccount, CircuitString, } from "o1js";
import { networks, Local } from "./networks";
let currentNetwork = undefined;
function getNetworkIdHash() {
    if (currentNetwork === undefined) {
        throw new Error("Network is not initialized");
    }
    return currentNetwork.networkIdHash;
}
function getDeployer() {
    if (currentNetwork === undefined) {
        throw new Error("Network is not initialized");
    }
    return currentNetwork.keys[0].privateKey;
}
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
        const local = Mina.LocalBlockchain({
            proofsEnabled: true,
        });
        Mina.setActiveInstance(local);
        currentNetwork = {
            keys: local.testAccounts,
            network: Local,
            networkIdHash: CircuitString.fromString("local").hash(),
        };
        return currentNetwork;
    }
    const network = networks.find((n) => n.chainId === instance);
    if (network === undefined) {
        throw new Error("Unknown network");
    }
    const networkInstance = Mina.Network({
        mina: network.mina,
        archive: network.archive,
        lightnetAccountManager: network.accountManager,
    });
    Mina.setActiveInstance(networkInstance);
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
                const privateKey = PrivateKey.fromBase58(deployers[i]);
                const publicKey = privateKey.toPublicKey();
                keys.push({ publicKey, privateKey });
            }
        }
    }
    currentNetwork = {
        keys,
        network,
        networkIdHash: CircuitString.fromString(instance).hash(),
    };
    return currentNetwork;
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