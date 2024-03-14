export { BackendPlugin };
import type { Cache } from "o1js";
declare abstract class BackendPlugin {
    name: string;
    task: string;
    args: string[];
    jobId?: string;
    constructor(params: {
        name: string;
        task: string;
        args: string[];
        jobId?: string;
    });
    abstract compile(cache: Cache): Promise<void>;
    abstract create(transaction: string): Promise<string | undefined>;
    abstract merge(proof1: string, proof2: string): Promise<string | undefined>;
    abstract send(transaction: string): Promise<string | undefined>;
    abstract mint(transaction: string): Promise<string | undefined>;
    abstract verify(proof: string): Promise<string | undefined>;
}
