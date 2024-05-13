export { blockchain, MinaNetwork, networks, Mainnet, Devnet, Zeko, Lightnet, Local, };
/**
 * blockchain is the type for the chain id
 * @param local the local chain id
 * @param devnet the devnet chain id
 * @param lightnet the lightnet chain id
 * @param mainnet the mainnet chain id
 * @param zeko the zeko chain id
 * @param mainnet the mainnet chain id
 */
type blockchain = "local" | "devnet" | "lightnet" | "mainnet" | "zeko" | "mainnet";
/**
 * MinaNetwork is the data structure for a Mina network, keeping track of the mina and archive endpoints, chain id, name, account manager, explorer account url, explorer transaction url, and faucet
 * @param mina the mina endpoints
 * @param archive the archive endpoints
 * @param chainId the chain id
 * @param name the name of the network
 * @param accountManager the account manager for Lightnet
 * @param explorerAccountUrl the explorer account url
 * @param explorerTransactionUrl the explorer transaction url
 * @param faucet the faucet url
 */
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
declare const Mainnet: MinaNetwork;
declare const Local: MinaNetwork;
declare const Devnet: MinaNetwork;
declare const Zeko: MinaNetwork;
declare const Lightnet: MinaNetwork;
declare const networks: MinaNetwork[];
