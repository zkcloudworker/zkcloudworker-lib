import { blockchain, Cloud, JobStatus } from "../../cloud/index.js";
import { zkCloudWorkerClient } from "../api/api.js";
import { zkCloudWorker } from "../../cloud/worker/index.js";
import { TokenTransaction, JobResult } from "@silvana-one/api";
export declare class TokenAPI {
    readonly client: zkCloudWorkerClient;
    constructor(params: {
        jwt: string;
        zkcloudworker?: (cloud: Cloud) => Promise<zkCloudWorker>;
        chain: blockchain;
    });
    proveTransaction(params: TokenTransaction): Promise<string | undefined>;
    proveTransactions(params: TokenTransaction[]): Promise<string | undefined>;
    waitForJobResults(params: {
        jobId: string;
        maxAttempts?: number;
        interval?: number;
        maxErrors?: number;
        printLogs?: boolean;
    }): Promise<(string | undefined)[]>;
    getResults(jobId: string): Promise<{
        success: true;
        results?: JobResult[];
        jobStatus?: JobStatus;
    } | {
        success: false;
        error?: string;
        jobStatus?: JobStatus;
    }>;
}
