/// <reference types="node" />
import { Cache, PrivateKey } from "o1js";
import { Cloud, zkCloudWorker } from "./cloud";
import { JobData } from "./job";
export declare class LocalCloud extends Cloud {
    data: Map<string, string>;
    constructor(params: {
        job: JobData;
        cache?: Cache;
        stepId?: string;
    });
    getDeployer(): Promise<PrivateKey>;
    log(msg: string): Promise<void>;
    getDataByKey(key: string): Promise<string | undefined>;
    saveDataByKey(key: string, value: string): Promise<void>;
    saveFile(filename: string, value: Buffer): Promise<void>;
    loadFile(filename: string): Promise<Buffer | undefined>;
    loadEnvironment(password: string): Promise<void>;
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
