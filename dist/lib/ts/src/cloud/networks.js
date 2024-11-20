"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Local = exports.Lightnet = exports.Zeko = exports.Devnet = exports.Mainnet = exports.networks = void 0;
const Mainnet = {
    mina: [
        //"https://proxy.devnet.minaexplorer.com/graphql",
        "https://api.minascan.io/node/mainnet/v1/graphql",
    ],
    archive: [
        "https://api.minascan.io/archive/mainnet/v1/graphql",
        //"https://archive.devnet.minaexplorer.com",
    ],
    explorerAccountUrl: "https://minascan.io/mainnet/account/",
    explorerTransactionUrl: "https://minascan.io/mainnet/tx/",
    chainId: "mainnet",
    name: "Mainnet",
};
exports.Mainnet = Mainnet;
const Local = {
    mina: [],
    archive: [],
    chainId: "local",
};
exports.Local = Local;
const Devnet = {
    mina: [
        "https://api.minascan.io/node/devnet/v1/graphql",
        //"https://proxy.devnet.minaexplorer.com/graphql",
    ],
    archive: [
        "https://api.minascan.io/archive/devnet/v1/graphql",
        //"https://archive.devnet.minaexplorer.com",
    ],
    explorerAccountUrl: "https://minascan.io/devnet/account/",
    explorerTransactionUrl: "https://minascan.io/devnet/tx/",
    chainId: "devnet",
    name: "Devnet",
    faucet: "https://faucet.minaprotocol.com",
};
exports.Devnet = Devnet;
const Zeko = {
    mina: ["https://devnet.zeko.io/graphql"],
    archive: ["https://devnet.zeko.io/graphql"],
    explorerAccountUrl: "https://zekoscan.io/devnet/account/",
    explorerTransactionUrl: "https://zekoscan.io/devnet/tx/",
    chainId: "zeko",
    name: "Zeko",
    faucet: "https://zeko.io/faucet",
};
exports.Zeko = Zeko;
const Lightnet = {
    mina: ["http://localhost:8080/graphql"],
    archive: ["http://localhost:8282"],
    accountManager: "http://localhost:8181",
    chainId: "lightnet",
    name: "Lightnet",
};
exports.Lightnet = Lightnet;
const networks = [Mainnet, Local, Devnet, Zeko, Lightnet];
exports.networks = networks;
/*
// not supported by o1js v1

const Berkeley: MinaNetwork = {
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

const TestWorld2: MinaNetwork = {
  mina: ["https://api.minascan.io/node/testworld/v1/graphql"],
  archive: ["https://archive.testworld.minaexplorer.com"],
  explorerAccountUrl: "https://minascan.io/testworld/account/",
  explorerTransactionUrl: "https://minascan.io/testworld/tx/",
  chainId: "testworld2",
  name: "TestWorld2",
};

*/
