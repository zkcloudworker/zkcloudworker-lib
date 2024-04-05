/// <reference types="node" />
import { Cache, PrivateKey } from "o1js";
import { Cloud, zkCloudWorker } from "./cloud";
import { JobData } from "./job";
import { TaskData } from "./task";
import { blockchain } from "../networks";
export declare class LocalCloud extends Cloud {
    readonly localWorker: (cloud: Cloud) => Promise<zkCloudWorker>;
    constructor(params: {
        job: JobData;
        chain: blockchain;
        cache?: Cache;
        stepId?: string;
        localWorker: (cloud: Cloud) => Promise<zkCloudWorker>;
    });
    getDeployer(): Promise<PrivateKey>;
    log(msg: string): Promise<void>;
    getDataByKey(key: string): Promise<string | undefined>;
    saveDataByKey(key: string, value: string): Promise<void>;
    saveFile(filename: string, value: Buffer): Promise<void>;
    loadFile(filename: string): Promise<Buffer | undefined>;
    loadEnvironment(password: string): Promise<void>;
    private generateId;
    recursiveProof(data: {
        transactions: string[];
        task?: string;
        userId?: string;
        args?: string;
        metadata?: string;
    }): Promise<string>;
    execute(data: {
        task: string;
        userId?: string;
        args?: string;
        metadata?: string;
    }): Promise<string>;
    addTask(data: {
        task: string;
        userId?: string;
        args?: string;
        metadata?: string;
    }): Promise<string>;
    deleteTask(taskId: string): Promise<void>;
    processTasks(): Promise<void>;
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
