/// <reference types="node" />
import { Cache, PrivateKey, PublicKey, SmartContract } from "o1js";
import { blockchain } from "../networks";
import { JobData } from "./job";
export interface DeployedSmartContract {
    address: PublicKey;
    contract: SmartContract;
    chain: blockchain;
}
export interface CloudTransaction {
    txId: string;
    transaction: string;
    timeReceived: number;
}
export declare abstract class Cloud {
    readonly id: string;
    readonly jobId: string;
    readonly stepId: string;
    readonly taskId: string;
    readonly cache: Cache;
    readonly developer: string;
    readonly repo: string;
    readonly task?: string;
    readonly userId?: string;
    readonly args?: string;
    readonly metadata?: string;
    readonly chain: blockchain;
    readonly isLocalCloud: boolean;
    constructor(params: {
        id: string;
        jobId: string;
        stepId: string;
        taskId: string;
        cache: Cache;
        developer: string;
        repo: string;
        task?: string;
        userId?: string;
        args?: string;
        metadata?: string;
        isLocalCloud?: boolean;
        chain: blockchain;
    });
    abstract getDeployer(): Promise<PrivateKey | undefined>;
    abstract releaseDeployer(txsHashes: string[]): Promise<void>;
    abstract log(msg: string): void;
    abstract getDataByKey(key: string): Promise<string | undefined>;
    abstract saveDataByKey(key: string, value: string | undefined): Promise<void>;
    abstract saveFile(filename: string, value: Buffer): Promise<void>;
    abstract loadFile(filename: string): Promise<Buffer | undefined>;
    abstract loadEnvironment(password: string): Promise<void>;
    abstract recursiveProof(data: {
        transactions: string[];
        task?: string;
        userId?: string;
        args?: string;
        metadata?: string;
    }): Promise<string>;
    abstract execute(data: {
        transactions: string[];
        task: string;
        userId?: string;
        args?: string;
        metadata?: string;
    }): Promise<string>;
    abstract addTask(data: {
        task: string;
        startTime?: number;
        userId?: string;
        args?: string;
        metadata?: string;
        maxAttempts?: number;
    }): Promise<string>;
    abstract deleteTransaction(txId: string): Promise<void>;
    abstract getTransactions(): Promise<CloudTransaction[]>;
    abstract deleteTask(taskId: string): Promise<void>;
    abstract processTasks(): Promise<void>;
    abstract jobResult(jobId: string): Promise<JobData | undefined>;
}
export declare abstract class zkCloudWorker {
    readonly cloud: Cloud;
    constructor(cloud: Cloud);
    deployedContracts(): Promise<DeployedSmartContract[]>;
    create(transaction: string): Promise<string | undefined>;
    merge(proof1: string, proof2: string): Promise<string | undefined>;
    execute(transactions: string[]): Promise<string | undefined>;
    processTransactions(transactions: CloudTransaction[]): Promise<void>;
    task(): Promise<string | undefined>;
}
