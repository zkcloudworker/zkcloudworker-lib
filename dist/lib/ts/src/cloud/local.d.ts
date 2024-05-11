/// <reference types="node" />
import { Cache } from "o1js";
import { Cloud, zkCloudWorker } from "./cloud";
import { JobData } from "./job";
import { TaskData } from "./task";
import { blockchain } from "../networks";
import { CloudTransaction, DeployerKeyPair } from "./cloud";
import { ApiCommand } from "../api/api";
export declare class LocalCloud extends Cloud {
    readonly localWorker: (cloud: Cloud) => Promise<zkCloudWorker>;
    constructor(params: {
        job: JobData;
        chain: blockchain;
        cache?: Cache;
        stepId?: string;
        localWorker: (cloud: Cloud) => Promise<zkCloudWorker>;
    });
    getDeployer(): Promise<DeployerKeyPair | undefined>;
    releaseDeployer(params: {
        publicKey: string;
        txsHashes: string[];
    }): Promise<void>;
    log(msg: string): Promise<void>;
    getDataByKey(key: string): Promise<string | undefined>;
    saveDataByKey(key: string, value: string | undefined): Promise<void>;
    saveFile(filename: string, value: Buffer): Promise<void>;
    loadFile(filename: string): Promise<Buffer | undefined>;
    loadEnvironment(password: string): Promise<void>;
    private static generateId;
    static addTransactions(transactions: string[]): Promise<string[]>;
    deleteTransaction(txId: string): Promise<void>;
    getTransactions(): Promise<CloudTransaction[]>;
    static run(params: {
        command: ApiCommand;
        data: {
            developer: string;
            repo: string;
            transactions: string[];
            task: string;
            userId?: string;
            args?: string;
            metadata?: string;
        };
        chain: blockchain;
        localWorker: (cloud: Cloud) => Promise<zkCloudWorker>;
    }): Promise<string>;
    recursiveProof(data: {
        transactions: string[];
        task?: string;
        userId?: string;
        args?: string;
        metadata?: string;
    }): Promise<string>;
    execute(data: {
        transactions: string[];
        task: string;
        userId?: string;
        args?: string;
        metadata?: string;
    }): Promise<string>;
    jobResult(jobId: string): Promise<JobData | undefined>;
    addTask(data: {
        task: string;
        startTime?: number;
        userId?: string;
        args?: string;
        metadata?: string;
    }): Promise<string>;
    deleteTask(taskId: string): Promise<void>;
    processTasks(): Promise<void>;
    static processLocalTasks(params: {
        developer: string;
        repo: string;
        localWorker: (cloud: Cloud) => Promise<zkCloudWorker>;
        chain: blockchain;
    }): Promise<number>;
    static sequencer(params: {
        worker: zkCloudWorker;
        data: {
            developer: string;
            repo: string;
            transactions: string[];
            task?: string;
            userId?: string;
            args?: string;
            metadata?: string;
        };
    }): Promise<string>;
}
export declare class LocalStorage {
    static jobs: {
        [key: string]: JobData;
    };
    static data: {
        [key: string]: string;
    };
    static transactions: {
        [key: string]: {
            transaction: string;
            timeReceived: number;
        };
    };
    static tasks: {
        [key: string]: TaskData;
    };
    static saveData(name: string): Promise<void>;
    static loadData(name: string): Promise<void>;
}
