export declare const defaultToken = "wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf";
export declare function getBalanceFromGraphQL(params: {
    publicKey: string;
    tokenId?: string;
    mina: string[];
}): Promise<bigint>;
export declare function getAccountFromGraphQL(params: {
    publicKey: string;
    tokenId?: string;
    mina: string[];
}): Promise<any>;
