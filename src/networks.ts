export {
  blockchain,
  MinaNetwork,
  networks,
  Mainnet,
  Devnet,
  Zeko,
  Lightnet,
  Local,
};

type blockchain =
  | "local"
  | "devnet"
  | "lightnet"
  | "mainnet"
  | "zeko"
  | "mainnet";

interface MinaNetwork {
  mina: string[];
  archive: string[];
  chainId: blockchain;
  name?: string;
  accountManager?: string;
  explorerAccountUrl?: string;
  explorerTransactionUrl?: string;
  faucet?: string;
}

const Mainnet: MinaNetwork = {
  mina: [],
  archive: [],
  chainId: "mainnet",
};

const Local: MinaNetwork = {
  mina: [],
  archive: [],
  chainId: "local",
};

const Devnet: MinaNetwork = {
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

const Zeko: MinaNetwork = {
  mina: ["https://devnet.zeko.io/graphql"],
  archive: [],
  explorerAccountUrl: "https://zekoscan.io/devnet/account/",
  explorerTransactionUrl: "https://zekoscan.io/devnet/tx/",
  chainId: "zeko",
  name: "Zeko",
  faucet: "https://zeko.io/faucet",
};

const Lightnet: MinaNetwork = {
  mina: ["http://localhost:8080/graphql"],
  archive: ["http://localhost:8282"],
  accountManager: "http://localhost:8181",
  chainId: "lightnet",
  name: "Lightnet",
};

const networks: MinaNetwork[] = [Mainnet, Local, Devnet, Zeko, Lightnet];

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
