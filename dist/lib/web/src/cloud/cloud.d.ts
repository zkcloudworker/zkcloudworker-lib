/// <reference types="node" />
import { Cache, PrivateKey } from "o1js";
export declare abstract class Cloud {
    cache: Cache;
    constructor(cache: Cache);
    abstract getDeployer(): Promise<PrivateKey>;
    abstract log(msg: string): void;
    abstract getDataByKey(key: string): Promise<string | undefined>;
    abstract saveDataByKey(key: string, value: string): Promise<void>;
    abstract saveFile(filename: string, value: Buffer): Promise<void>;
    abstract loadFile(filename: string): Promise<Buffer | undefined>;
}
