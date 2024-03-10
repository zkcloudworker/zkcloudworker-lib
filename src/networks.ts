export {
  blockchain,
  MinaNetwork,
  networks,
  getNetworkIdHash,
  Mainnet,
  Berkeley,
  Zeko,
  TestWorld2,
  Lightnet,
  Local,
};
import { Mina, CircuitString, Field } from "o1js";

type blockchain =
  | "local"
  | "berkeley"
  | "lighnet"
  | "mainnet"
  | "testworld2"
  | "zeko";

interface MinaNetwork {
  mina: string[];
  archive: string[];
  chainId: blockchain;
  name?: string;
  accountManager?: string;
  explorerAccountUrl?: string;
  explorerTransactionUrl?: string;
}

function getNetworkIdHash(chainId: blockchain | undefined): Field {
  if (chainId === undefined && Mina.getNetworkId().toString() === "testnet")
    throw new Error("Network ID is not set");
  return CircuitString.fromString(
    chainId ?? Mina.getNetworkId().toString()
  ).hash();
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

const Zeko: MinaNetwork = {
  mina: ["http://sequencer-zeko-dev.dcspark.io/graphql"],
  archive: [],
  chainId: "zeko",
};

const TestWorld2: MinaNetwork = {
  mina: ["https://api.minascan.io/node/testworld/v1/graphql"],
  archive: ["https://archive.testworld.minaexplorer.com"],
  explorerAccountUrl: "https://minascan.io/testworld/account/",
  explorerTransactionUrl: "https://minascan.io/testworld/tx/",
  chainId: "testworld2",
  name: "TestWorld2",
};

const Lightnet: MinaNetwork = {
  mina: ["http://localhost:8080/graphql"],
  archive: ["http://localhost:8282"],
  accountManager: "http://localhost:8181",
  chainId: "lighnet",
  name: "Lightnet",
};

const networks: MinaNetwork[] = [
  Mainnet,
  Local,
  Berkeley,
  Zeko,
  TestWorld2,
  Lightnet,
];
