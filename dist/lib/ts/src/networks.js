"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Local = exports.Lightnet = exports.Zeko = exports.Devnet = exports.Mainnet = exports.networks = void 0;
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
};
exports.Devnet = Devnet;
const Zeko = {
    mina: ["http://sequencer-zeko-dev.dcspark.io/graphql"],
    archive: [],
    chainId: "zeko",
};
exports.Zeko = Zeko;
const Lightnet = {
    mina: ["http://localhost:8080/graphql"],
    archive: ["http://localhost:8282"],
    accountManager: "http://localhost:8181",
    chainId: "lighnet",
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
