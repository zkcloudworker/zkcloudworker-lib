import { BlockBerryChain } from "./chain.js";
import { blockchain } from "../../cloud/networks.js";
export declare function getNonce(params: {
    account: string;
    chain: BlockBerryChain;
    blockBerryApiKey: string;
}): Promise<{
    success: boolean;
    nonce: number;
    message?: string;
}>;
export declare function getAccountNonce(params: {
    account: string;
    chain?: blockchain;
    blockBerryApiKey?: string;
    verbose?: boolean;
}): Promise<number>;
