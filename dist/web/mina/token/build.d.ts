import { WhitelistedAddressList } from "./whitelist.js";
import { FungibleTokenTransactionType } from "./api.js";
import { blockchain } from "../../cloud/networks.js";
import { PublicKey, UInt64, UInt8, Transaction, VerificationKey } from "o1js";
export declare function buildTokenDeployTransaction(params: {
    chain: blockchain;
    fee: UInt64;
    sender: PublicKey;
    nonce: number;
    tokenAddress: PublicKey;
    adminContractAddress: PublicKey;
    adminAddress: PublicKey;
    uri: string;
    symbol: string;
    memo?: string;
    whitelist?: WhitelistedAddressList;
    developerAddress?: PublicKey;
    developerFee?: UInt64;
    provingKey: PublicKey;
    provingFee: UInt64;
    decimals: UInt8;
}): Promise<{
    tx: Transaction<false, false>;
    isWhitelisted: boolean;
    adminVerificationKey: VerificationKey;
    tokenVerificationKey: VerificationKey;
}>;
export declare function buildTokenTransaction(params: {
    txType: FungibleTokenTransactionType;
    chain: blockchain;
    fee: UInt64;
    sender: PublicKey;
    nonce: number;
    memo?: string;
    tokenAddress: PublicKey;
    from: PublicKey;
    to: PublicKey;
    amount?: UInt64;
    price?: UInt64;
    whitelist?: WhitelistedAddressList;
    developerAddress?: PublicKey;
    developerFee?: UInt64;
    provingKey: PublicKey;
    provingFee: UInt64;
}): Promise<{
    tx: Transaction<false, false>;
    isWhitelisted: boolean;
    adminContractAddress: PublicKey;
    adminAddress: PublicKey;
    symbol: string;
    adminVerificationKey: VerificationKey;
    tokenVerificationKey: VerificationKey;
    offerVerificationKey: VerificationKey;
    bidVerificationKey: VerificationKey;
}>;
export declare function getTokenSymbolAndAdmin(params: {
    tokenAddress: PublicKey;
    chain: blockchain;
}): Promise<{
    adminContractAddress: PublicKey;
    adminAddress: PublicKey;
    symbol: string;
    isWhitelisted: boolean;
}>;
