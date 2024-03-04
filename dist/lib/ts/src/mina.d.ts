export { blockchain, initBlockchain, Memory, makeString, sleep, accountBalance, accountBalanceMina, formatTime, MinaNetwork, };
import { PublicKey, PrivateKey, UInt64 } from "o1js";
import { MinaNetworkURL } from "./networks";
type blockchain = "local" | "berkeley" | "lighnet" | "mainnet" | "testworld2";
interface MinaNetwork {
    keys: {
        publicKey: PublicKey;
        privateKey: PrivateKey;
    }[];
    url?: MinaNetworkURL;
}
declare function initBlockchain(instance: blockchain): MinaNetwork;
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
