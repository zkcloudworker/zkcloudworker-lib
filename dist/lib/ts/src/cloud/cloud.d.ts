import { Cache, PrivateKey } from "o1js";
export declare abstract class Cloud {
    cache: Cache;
    constructor(cache: Cache);
    abstract getDeployer(): Promise<PrivateKey>;
    abstract log(msg: string): void;
}
