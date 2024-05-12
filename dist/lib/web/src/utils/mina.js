export { initBlockchain, accountBalance, accountBalanceMina, currentNetwork, getNetworkIdHash, getCurrentNetwork, getDeployer, };
import { Mina, PrivateKey, UInt64, fetchAccount, Encoding, Poseidon, Lightnet, } from "o1js";
import { networks, Local } from "../networks";
let currentNetwork = undefined;
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
async function initBlockchain(instance, deployersNumber = 0) {
    if (instance === "mainnet") {
        throw new Error("Mainnet is not supported yet by zkApps");
    }
    if (currentNetwork !== undefined) {
        if (currentNetwork?.network.chainId === instance) {
            return currentNetwork;
        }
        else {
            throw new Error(`Network is already initialized to different chain ${currentNetwork.network.chainId}, cannot initialize to ${instance}`);
        }
    }
    const networkIdHash = Poseidon.hash(Encoding.stringToFields(instance));
    // await used for compatibility with future versions of o1js
    if (instance === "local") {
        const local = await Mina.LocalBlockchain({
            proofsEnabled: true,
        });
        Mina.setActiveInstance(local);
        if (deployersNumber > local.testAccounts.length)
            throw new Error("Not enough test accounts");
        currentNetwork = {
            keys: local.testAccounts,
            network: Local,
            networkIdHash,
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
        if (instance === "lightnet") {
            for (let i = 0; i < deployersNumber; i++) {
                const keyPair = await Lightnet.acquireKeyPair();
                const key = Mina.TestPublicKey(keyPair.privateKey);
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
                const privateKey = PrivateKey.fromBase58(deployers[i]);
                const key = Mina.TestPublicKey(privateKey);
                keys.push(key);
            }
        }
    }
    currentNetwork = {
        keys,
        network,
        networkIdHash,
    };
    return currentNetwork;
}
async function accountBalance(address) {
    await fetchAccount({ publicKey: address });
    if (Mina.hasAccount(address))
        return Mina.getBalance(address);
    else
        return UInt64.from(0);
}
async function accountBalanceMina(address) {
    return Number((await accountBalance(address)).toBigInt()) / 1e9;
}
//# sourceMappingURL=mina.js.map