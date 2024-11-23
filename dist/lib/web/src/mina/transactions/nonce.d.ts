import { BlockBerryChain } from "./chain";
import { blockchain } from "../../cloud";
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
