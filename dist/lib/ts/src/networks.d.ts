export { blockchain, MinaNetwork, networks, Mainnet, Devnet, Zeko, Lightnet, Local, };
type blockchain = "local" | "devnet" | "lightnet" | "mainnet" | "zeko" | "mainnet";
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
declare const Devnet: MinaNetwork;
declare const Zeko: MinaNetwork;
declare const Lightnet: MinaNetwork;
declare const networks: MinaNetwork[];
