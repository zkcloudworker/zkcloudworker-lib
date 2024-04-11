export { blockchain, MinaNetwork, networks, Mainnet, Berkeley, Devnet, Zeko, TestWorld2, Lightnet, Local, };
type blockchain = "local" | "berkeley" | "devnet" | "lighnet" | "mainnet" | "testworld2" | "zeko";
interface MinaNetwork {
    mina: string[];
    archive: string[];
    chainId: blockchain;
    name?: string;
    accountManager?: string;
    explorerAccountUrl?: string;
    explorerTransactionUrl?: string;
}
declare const Mainnet: MinaNetwork;
declare const Local: MinaNetwork;
declare const Berkeley: MinaNetwork;
declare const Devnet: MinaNetwork;
declare const Zeko: MinaNetwork;
declare const TestWorld2: MinaNetwork;
declare const Lightnet: MinaNetwork;
declare const networks: MinaNetwork[];
