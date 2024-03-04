export { MinaNetworkURL, Berkeley, Lightnet, TestWorld2 };
interface MinaNetworkURL {
    mina: string[];
    archive: string[];
    chainId?: string;
    name?: string;
    accountManager?: string;
    explorerAccountUrl?: string;
    explorerTransactionUrl?: string;
}
declare const Berkeley: MinaNetworkURL;
declare const TestWorld2: MinaNetworkURL;
declare const Lightnet: MinaNetworkURL;
