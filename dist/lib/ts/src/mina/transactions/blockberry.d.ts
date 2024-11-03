import { BlockBerryChain } from "./chain";
export declare function getZkAppTxsFromBlockBerry(params: {
    account: string;
    chain: BlockBerryChain;
    blockBerryApiKey: string;
}): Promise<any>;
export declare function getPaymentTxsFromBlockBerry(params: {
    account: string;
    chain: BlockBerryChain;
    blockBerryApiKey: string;
}): Promise<any>;
export declare function getZkAppTxFromBlockBerry(params: {
    hash: string;
    chain: BlockBerryChain;
    blockBerryApiKey: string;
}): Promise<any>;
export declare function getZkAppFromBlockBerry(params: {
    account: string;
    chain: BlockBerryChain;
    blockBerryApiKey: string;
}): Promise<any>;
