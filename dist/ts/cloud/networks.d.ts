export { blockchain, MinaNetwork, networks, Mainnet, Devnet, Zeko, Lightnet, Local, };
/**
 * blockchain is the type for the chain ID.
 */
type blockchain = "local" | "devnet" | "lightnet" | "mainnet" | "zeko";
/**
 * MinaNetwork is the data structure for a Mina network, keeping track of the Mina and archive endpoints, chain ID, name, account manager, explorer account URL, explorer transaction URL, and faucet.
 */
interface MinaNetwork {
    /** The Mina endpoints */
    mina: string[];
    /** The archive endpoints */
    archive: string[];
    /** The chain ID */
    chainId: blockchain;
    /** The name of the network (optional) */
    name?: string;
    /** The account manager for Lightnet (optional) */
    accountManager?: string;
    /** The explorer account URL (optional) */
    explorerAccountUrl?: string;
    /** The explorer transaction URL (optional) */
    explorerTransactionUrl?: string;
    /** The faucet URL (optional) */
    faucet?: string;
}
declare const Mainnet: MinaNetwork;
declare const Local: MinaNetwork;
declare const Devnet: MinaNetwork;
declare const Zeko: MinaNetwork;
declare const Lightnet: MinaNetwork;
declare const networks: MinaNetwork[];
