export { initBlockchain, Memory, makeString, sleep, accountBalance, accountBalanceMina, formatTime, MinaNetworkInstance, currentNetwork, getNetworkIdHash, };
import { PublicKey, PrivateKey, UInt64, Field } from "o1js";
import { blockchain, MinaNetwork } from "./networks";
interface MinaNetworkInstance {
    keys: {
        publicKey: PublicKey;
        privateKey: PrivateKey;
    }[];
    network: MinaNetwork;
    networkIdHash: Field;
}
declare let currentNetwork: MinaNetworkInstance | undefined;
declare function getNetworkIdHash(): Field;
declare function initBlockchain(instance: blockchain, deployersNumber?: number): MinaNetworkInstance;
declare function accountBalance(address: PublicKey): Promise<UInt64>;
declare function accountBalanceMina(address: PublicKey): Promise<number>;
declare function sleep(ms: number): Promise<unknown>;
declare function makeString(length: number): string;
declare function formatTime(ms: number): string;
declare class Memory {
    static rss: number;
    constructor();
    static info(description?: string, fullInfo?: boolean): void;
}
