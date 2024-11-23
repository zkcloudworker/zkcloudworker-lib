import { blockchain, Cloud, JobStatus } from "../../cloud";
import { zkCloudWorkerClient } from "../api/api";
import { zkCloudWorker } from "../../cloud/worker";
export interface FungibleTokenDeployParams {
    txType: "deploy";
    tokenAddress: string;
    adminContractAddress: string;
    senderAddress: string;
    chain: string;
    symbol: string;
    uri: string;
    serializedTransaction: string;
    signedData: string;
    sendTransaction: boolean;
    developerAddress?: string;
    developerFee?: number;
}
export type FungibleTokenTransactionType = "mint" | "transfer" | "bid" | "offer" | "buy" | "sell" | "withdrawBid" | "withdrawOffer";
export interface FungibleTokenTransactionParams {
    txType: FungibleTokenTransactionType;
    tokenAddress: string;
    chain: string;
    serializedTransaction: string;
    signedData: string;
    from: string;
    to: string;
    amount: number;
    price?: number;
    sendTransaction: boolean;
    developerAddress?: string;
    developerFee?: number;
    symbol?: string;
}
export interface FungibleTokenJobResult {
    success: boolean;
    jobStatus?: JobStatus;
    tx?: string;
    hash?: string;
    error?: string;
}
export declare class TokenAPI {
    readonly client: zkCloudWorkerClient;
    constructor(params: {
        jwt: string;
        zkcloudworker?: (cloud: Cloud) => Promise<zkCloudWorker>;
        chain: blockchain;
    });
    sendDeployTransaction(params: FungibleTokenDeployParams): Promise<string | undefined>;
    sendTransaction(params: FungibleTokenTransactionParams): Promise<string | undefined>;
    waitForJobResult(params: {
        jobId: string;
        maxAttempts?: number;
        interval?: number;
        maxErrors?: number;
        printLogs?: boolean;
    }): Promise<string | undefined>;
    getResult(jobId: string): Promise<FungibleTokenJobResult>;
}
