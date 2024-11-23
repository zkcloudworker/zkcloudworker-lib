import { BlockBerryChain } from "./chain";
export declare function txStatusBlockberry(params: {
    hash: string;
    time: number;
    chain: BlockBerryChain;
    blockBerryApiKey: string;
    timeout?: number;
}): Promise<string>;
