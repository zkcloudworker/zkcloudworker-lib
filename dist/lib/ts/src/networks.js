"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Local = exports.Lightnet = exports.TestWorld2 = exports.Zeko = exports.Berkeley = exports.Mainnet = exports.getNetworkIdHash = exports.networks = void 0;
const o1js_1 = require("o1js");
function getNetworkIdHash(chainId = undefined) {
    if (chainId === undefined && o1js_1.Mina.getNetworkId().toString() === "testnet")
        throw new Error("Network ID is not set");
    return o1js_1.CircuitString.fromString(chainId ?? o1js_1.Mina.getNetworkId().toString()).hash();
}
exports.getNetworkIdHash = getNetworkIdHash;
const Mainnet = {
    mina: [],
    archive: [],
    chainId: "mainnet",
};
exports.Mainnet = Mainnet;
const Local = {
    mina: [],
    archive: [],
    chainId: "local",
};
exports.Local = Local;
const Berkeley = {
    mina: [
        "https://api.minascan.io/node/berkeley/v1/graphql",
        "https://proxy.berkeley.minaexplorer.com/graphql",
    ],
    archive: [
        "https://api.minascan.io/archive/berkeley/v1/graphql",
        "https://archive.berkeley.minaexplorer.com",
    ],
    explorerAccountUrl: "https://minascan.io/berkeley/account/",
    explorerTransactionUrl: "https://minascan.io/berkeley/tx/",
    chainId: "berkeley",
    name: "Berkeley",
};
exports.Berkeley = Berkeley;
const Zeko = {
    mina: ["http://sequencer-zeko-dev.dcspark.io/graphql"],
    archive: [],
    chainId: "zeko",
};
exports.Zeko = Zeko;
const TestWorld2 = {
    mina: ["https://api.minascan.io/node/testworld/v1/graphql"],
    archive: ["https://archive.testworld.minaexplorer.com"],
    explorerAccountUrl: "https://minascan.io/testworld/account/",
    explorerTransactionUrl: "https://minascan.io/testworld/tx/",
    chainId: "testworld2",
    name: "TestWorld2",
};
exports.TestWorld2 = TestWorld2;
const Lightnet = {
    mina: ["http://localhost:8080/graphql"],
    archive: ["http://localhost:8282"],
    accountManager: "http://localhost:8181",
    chainId: "lighnet",
    name: "Lightnet",
};
exports.Lightnet = Lightnet;
const networks = [
    Mainnet,
    Local,
    Berkeley,
    Zeko,
    TestWorld2,
    Lightnet,
];
exports.networks = networks;
