/// <reference types="node" />
import { Cache, PrivateKey, PublicKey, SmartContract } from "o1js";
import { blockchain } from "../networks";
export interface DeployedSmartContract {
    address: PublicKey;
    contract: SmartContract;
    chain: blockchain;
}
export declare abstract class Cloud {
    readonly jobId: string;
    readonly stepId: string;
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
        jobId: string;
        stepId: string;
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
    abstract getDeployer(): Promise<PrivateKey>;
    abstract log(msg: string): void;
    abstract getDataByKey(key: string): Promise<string | undefined>;
    abstract saveDataByKey(key: string, value: string): Promise<void>;
    abstract saveFile(filename: string, value: Buffer): Promise<void>;
    abstract loadFile(filename: string): Promise<Buffer | undefined>;
    abstract loadEnvironment(password: string): Promise<void>;
}
export interface CloudTransaction {
    txId: string;
    transaction: string;
    timeReceived: number;
}
export declare abstract class zkCloudWorker {
    readonly cloud: Cloud;
    constructor(cloud: Cloud);
    deployedContracts(): Promise<DeployedSmartContract[]>;
    create(transaction: string): Promise<string | undefined>;
    merge(proof1: string, proof2: string): Promise<string | undefined>;
    execute(): Promise<string | undefined>;
    processTransactions(transactions: CloudTransaction[]): Promise<void>;
    task(data: string): Promise<void>;
}
