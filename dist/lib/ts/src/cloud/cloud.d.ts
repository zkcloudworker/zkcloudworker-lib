/// <reference types="node" />
import { Cache, PrivateKey } from "o1js";
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
    });
    abstract getDeployer(): Promise<PrivateKey>;
    abstract log(msg: string): void;
    abstract getDataByKey(key: string): Promise<string | undefined>;
    abstract saveDataByKey(key: string, value: string): Promise<void>;
    abstract saveFile(filename: string, value: Buffer): Promise<void>;
    abstract loadFile(filename: string): Promise<Buffer | undefined>;
}
export declare abstract class zkCloudWorker {
    readonly cloud: Cloud;
    constructor(cloud: Cloud);
    abstract compile(cache: Cache): Promise<void>;
    abstract create(transaction: string): Promise<string | undefined>;
    abstract merge(proof1: string, proof2: string): Promise<string | undefined>;
    abstract functionCall(): Promise<string | undefined>;
}
