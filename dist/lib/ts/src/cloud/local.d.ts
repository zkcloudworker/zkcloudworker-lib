/// <reference types="node" />
import { Cache, PrivateKey } from "o1js";
import { Cloud } from "./cloud";
export declare class LocalCloud extends Cloud {
    data: Map<string, string>;
    constructor(params?: {
        jobId?: string;
        stepId?: string;
        cache?: Cache;
        developer?: string;
        repo?: string;
        task?: string;
        userId?: string;
        args?: string;
        metadata?: string;
    });
    getDeployer(): Promise<PrivateKey>;
    log(msg: string): Promise<void>;
    getDataByKey(key: string): Promise<string | undefined>;
    saveDataByKey(key: string, value: string): Promise<void>;
    saveFile(filename: string, value: Buffer): Promise<void>;
    loadFile(filename: string): Promise<Buffer | undefined>;
    loadEnvironment(password: string): Promise<void>;
}
