/// <reference types="node" />
import { Cache, PrivateKey } from "o1js";
export declare class LocalCloud {
    cache: Cache;
    data: Map<string, string>;
    constructor(cache: Cache);
    getDeployer(): Promise<PrivateKey>;
    log(msg: string): Promise<void>;
    getDataByKey(key: string): Promise<string | undefined>;
    saveDataByKey(key: string, value: string): Promise<void>;
    saveFile(filename: string, value: Buffer): Promise<void>;
    loadFile(filename: string): Promise<Buffer | undefined>;
}
