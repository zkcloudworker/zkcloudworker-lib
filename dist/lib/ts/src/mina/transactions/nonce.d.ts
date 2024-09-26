import { BlockBerryChain } from "./chain";
export declare function getNonce(params: {
    account: string;
    chain: BlockBerryChain;
    blockBerryApiKey: string;
}): Promise<{
    success: boolean;
    nonce: number;
    message?: string;
}>;
