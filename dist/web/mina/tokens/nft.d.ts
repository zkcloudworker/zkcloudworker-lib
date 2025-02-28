import { blockchain, Cloud, JobStatus } from "../../cloud/index.js";
import { zkCloudWorkerClient } from "../api/api.js";
import { zkCloudWorker } from "../../cloud/worker/index.js";
import { NftTransaction, JobResult } from "@silvana-one/api";
export declare class NftAPI {
    readonly client: zkCloudWorkerClient;
    constructor(params: {
        jwt: string;
        zkcloudworker?: (cloud: Cloud) => Promise<zkCloudWorker>;
        chain: blockchain;
    });
    proveTransaction(params: NftTransaction): Promise<string | undefined>;
    proveTransactions(params: NftTransaction[], name?: string): Promise<string | undefined>;
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
