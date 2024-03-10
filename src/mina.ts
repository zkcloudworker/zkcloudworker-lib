export {
  initBlockchain,
  Memory,
  makeString,
  sleep,
  accountBalance,
  accountBalanceMina,
  formatTime,
  MinaNetworkInstance,
  currentNetwork,
  getNetworkIdHash,
};

import {
  Mina,
  PublicKey,
  PrivateKey,
  UInt64,
  fetchAccount,
  Field,
  CircuitString,
} from "o1js";
import { networks, blockchain, MinaNetwork, Local } from "./networks";

interface MinaNetworkInstance {
  keys: {
    publicKey: PublicKey;
    privateKey: PrivateKey;
  }[];
  network: MinaNetwork;
  networkIdHash: Field;
}

let currentNetwork: MinaNetworkInstance | undefined = undefined;

function getNetworkIdHash(chainId: blockchain | undefined = undefined): Field {
  if (chainId === undefined && Mina.getNetworkId().toString() === "testnet")
    throw new Error("Network ID is not set");
  return CircuitString.fromString(
    chainId ?? Mina.getNetworkId().toString()
  ).hash();
}

function initBlockchain(
  instance: blockchain,
  deployersNumber: number = 0
): MinaNetworkInstance {
  if (instance === "mainnet") {
    throw new Error("Mainnet is not supported yet by zkApps");
  }

  if (instance === "local") {
    const local = Mina.LocalBlockchain({
      proofsEnabled: true,
      networkId: { custom: "local" },
    });
    Mina.setActiveInstance(local);
    currentNetwork = {
      keys: local.testAccounts,
      network: Local,
      networkIdHash: getNetworkIdHash("local"),
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
    networkId: { custom: network.chainId },
    lightnetAccountManager: network.accountManager,
  });
  Mina.setActiveInstance(networkInstance);

  const keys: {
    publicKey: PublicKey;
    privateKey: PrivateKey;
  }[] = [];

  if (deployersNumber > 0) {
    if (instance === "lighnet") {
      throw new Error(
        "Use await Lightnet.acquireKeyPair() to get keys for Lightnet"
      );
    } else {
      const deployers = process.env.DEPLOYERS;
      if (
        deployers === undefined ||
        Array.isArray(deployers) === false ||
        deployers.length < deployersNumber
      )
        throw new Error("Deployers are not set");
      for (let i = 0; i < deployersNumber; i++) {
        const privateKey = PrivateKey.fromBase58(deployers[i]);
        const publicKey = privateKey.toPublicKey();
        keys.push({ publicKey, privateKey });
      }
    }
  }

  currentNetwork = { keys, network, networkIdHash: getNetworkIdHash(instance) };
  return currentNetwork;
}

async function accountBalance(address: PublicKey): Promise<UInt64> {
  await fetchAccount({ publicKey: address });
  if (Mina.hasAccount(address)) return Mina.getBalance(address);
  else return UInt64.from(0);
}

async function accountBalanceMina(address: PublicKey): Promise<number> {
  return Number((await accountBalance(address)).toBigInt()) / 1e9;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeString(length: number): string {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  let outString: string = ``;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  const inOptions: string = `abcdefghijklmnopqrstuvwxyz0123456789`;

  for (let i = 0; i < length; i++) {
    outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
  }

  return outString;
}

function formatTime(ms: number): string {
  if (ms === undefined) return "";
  if (ms < 1000) return ms.toString() + " ms";
  if (ms < 60 * 1000)
    return parseInt((ms / 1000).toString()).toString() + " sec";
  if (ms < 60 * 60 * 1000)
    return parseInt((ms / 1000 / 60).toString()).toString() + " min";
  return parseInt((ms / 1000 / 60 / 60).toString()).toString() + " h";
}

class Memory {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  static rss: number = 0;
  constructor() {
    Memory.rss = 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  public static info(description: string = ``, fullInfo: boolean = false) {
    const memoryData = process.memoryUsage();
    const formatMemoryUsage = (data: number) =>
      `${Math.round(data / 1024 / 1024)} MB`;
    const oldRSS = Memory.rss;
    Memory.rss = Math.round(memoryData.rss / 1024 / 1024);

    const memoryUsage = fullInfo
      ? {
          step: `${description}:`,
          rssDelta: `${(oldRSS === 0
            ? 0
            : Memory.rss - oldRSS
          ).toString()} MB -> Resident Set Size memory change`,
          rss: `${formatMemoryUsage(
            memoryData.rss
          )} -> Resident Set Size - total memory allocated`,
          heapTotal: `${formatMemoryUsage(
            memoryData.heapTotal
          )} -> total size of the allocated heap`,
          heapUsed: `${formatMemoryUsage(
            memoryData.heapUsed
          )} -> actual memory used during the execution`,
          external: `${formatMemoryUsage(
            memoryData.external
          )} -> V8 external memory`,
        }
      : `RSS memory ${description}: ${formatMemoryUsage(memoryData.rss)}${
          oldRSS === 0
            ? ``
            : `, changed by ` + (Memory.rss - oldRSS).toString() + ` MB`
        }`;

    console.log(memoryUsage);
  }
}
