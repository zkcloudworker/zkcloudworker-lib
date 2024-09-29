export interface FungibleTokenDeployParams {
    tokenPublicKey: string;
    adminContractPublicKey: string;
    adminPublicKey: string;
    chain: string;
    symbol: string;
    uri: string;
    serializedTransaction: string;
    signedData: string;
    sendTransaction: boolean;
}
export interface FungibleTokenMintParams {
    tokenPublicKey: string;
    adminContractPublicKey: string;
    adminPublicKey: string;
    chain: string;
    symbol: string;
    serializedTransaction: string;
    signedData: string;
    to: string;
    amount: number;
    sendTransaction: boolean;
}
export interface FungibleTokenJobResult {
    success: boolean;
    tx?: string;
    hash?: string;
    error?: string;
}
