"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentNetwork = void 0;
exports.initBlockchain = initBlockchain;
exports.accountBalance = accountBalance;
exports.accountBalanceMina = accountBalanceMina;
exports.getNetworkIdHash = getNetworkIdHash;
exports.getCurrentNetwork = getCurrentNetwork;
exports.getDeployer = getDeployer;
const o1js_1 = require("o1js");
const cloud_1 = require("../../cloud");
let currentNetwork = undefined;
exports.currentNetwork = currentNetwork;
function getNetworkIdHash() {
    if (currentNetwork === undefined) {
        throw new Error("Network is not initialized");
    }
    return currentNetwork.networkIdHash;
}
function getCurrentNetwork() {
    if (currentNetwork === undefined) {
        throw new Error("Network is not initialized");
    }
    return currentNetwork;
}
function getDeployer() {
    if (currentNetwork === undefined) {
        throw new Error("Network is not initialized");
    }
    if (currentNetwork.keys.length < 1)
        return undefined;
    return currentNetwork.keys[0];
}
/**
 * Initializes the Mina blockchain network
 * Due to the limitations of the Mina SDK, only one network can be initialized at a time
 * This function should be called before any other Mina functions
 * @param instance the blockchain instance to initialize
 * @param deployersNumber the number of deployers to use for the network (only for local and lightnet networks)
 * @returns the Mina network instance
 */
async function initBlockchain(instance, deployersNumber = 0) {
    /*
    if (instance === "mainnet") {
      throw new Error("Mainnet is not supported yet by zkApps");
    }
    */
    if (currentNetwork !== undefined) {
        if (currentNetwork?.network.chainId === instance) {
            return currentNetwork;
        }
        else {
            throw new Error(`Network is already initialized to different chain ${currentNetwork.network.chainId}, cannot initialize to ${instance}`);
        }
    }
    const networkIdHash = o1js_1.CircuitString.fromString(instance).hash();
    // await used for compatibility with future versions of o1js
    if (instance === "local") {
        const local = await o1js_1.Mina.LocalBlockchain({
            proofsEnabled: true,
        });
        o1js_1.Mina.setActiveInstance(local);
        if (deployersNumber > local.testAccounts.length)
            throw new Error("Not enough test accounts");
        exports.currentNetwork = currentNetwork = {
            keys: local.testAccounts,
            network: cloud_1.Local,
            networkIdHash,
        };
        return currentNetwork;
    }
    const network = cloud_1.networks.find((n) => n.chainId === instance);
    if (network === undefined) {
        throw new Error("Unknown network");
    }
    const networkInstance = o1js_1.Mina.Network({
        mina: network.mina,
        archive: network.archive,
        lightnetAccountManager: network.accountManager,
        networkId: instance === "mainnet" ? "mainnet" : "testnet",
    });
    o1js_1.Mina.setActiveInstance(networkInstance);
    const keys = [];
    if (deployersNumber > 0) {
        if (instance === "lightnet") {
            for (let i = 0; i < deployersNumber; i++) {
                const keyPair = await o1js_1.Lightnet.acquireKeyPair();
                const key = o1js_1.Mina.TestPublicKey(keyPair.privateKey);
                keys.push(key);
            }
        }
        else {
            const deployers = process.env.DEPLOYERS;
            if (deployers === undefined ||
                Array.isArray(deployers) === false ||
                deployers.length < deployersNumber)
                throw new Error("Deployers are not set");
            for (let i = 0; i < deployersNumber; i++) {
                const privateKey = o1js_1.PrivateKey.fromBase58(deployers[i]);
                const key = o1js_1.Mina.TestPublicKey(privateKey);
                keys.push(key);
            }
        }
    }
    exports.currentNetwork = currentNetwork = {
        keys,
        network,
        networkIdHash,
    };
    return currentNetwork;
}
/**
 * Fetches the account balance for a given public key
 * @param address the public key
 * @returns the account balance
 */
async function accountBalance(address) {
    await (0, o1js_1.fetchAccount)({ publicKey: address });
    if (o1js_1.Mina.hasAccount(address))
        return o1js_1.Mina.getBalance(address);
    else
        return o1js_1.UInt64.from(0);
}
/**
 * Fetches the account balance for a given public key and returns it in Mina
 * @param address the public key
 * @returns the account balance in MINA
 */
async function accountBalanceMina(address) {
    return Number((await accountBalance(address)).toBigInt()) / 1e9;
}
