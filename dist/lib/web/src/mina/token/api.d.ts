import { blockchain, Cloud, JobStatus } from "../../cloud";
import { zkCloudWorkerClient } from "../api/api";
import { zkCloudWorker } from "../../cloud/worker";
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
export interface FungibleTokenTransferParams {
    tokenPublicKey: string;
    chain: string;
    symbol: string;
    serializedTransaction: string;
    signedData: string;
    from: string;
    to: string;
    amount: number;
    sendTransaction: boolean;
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
    sendMintTransaction(params: FungibleTokenMintParams): Promise<string | undefined>;
    sendTransferTransaction(params: FungibleTokenTransferParams): Promise<string | undefined>;
    waitForJobResult(params: {
        jobId: string;
        maxAttempts?: number;
        interval?: number;
        maxErrors?: number;
        printLogs?: boolean;
    }): Promise<string | undefined>;
    getResult(jobId: string): Promise<FungibleTokenJobResult>;
}
