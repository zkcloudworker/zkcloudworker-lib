import { zkCloudWorker, Cloud } from "../cloud/cloud";
import { blockchain } from "../networks";
/**
 * API class for interacting with the zkCloudWorker
 * @property jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
 * @property endpoint The endpoint of the serverless api
 */
export declare class zkCloudWorkerClient {
    readonly jwt: string;
    readonly endpoint: string;
    readonly chain: blockchain;
    readonly localWorker: (cloud: Cloud) => Promise<zkCloudWorker> | undefined;
    /**
     * Constructor for the API class
     * @param jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
     */
    constructor(params: {
        jwt: string;
        zkcloudworker?: (cloud: Cloud) => Promise<zkCloudWorker>;
        chain?: blockchain;
    });
    /**
     * Starts a new job for the proof calculation using serverless api call
     * The developer and name should correspond to the BackupPlugin of the API
     * All other parameters should correspond to the parameters of the BackupPlugin
     * @param data the data for the proof call
     * @param data.transactions the transactions
     * @param data.developer the developer
     * @param data.repo the repo to use
     * @param data.task the task of the job
     * @param data.args the arguments of the job
     * @returns { success: boolean, error?: string, jobId?: string }
     * where jonId is the jobId of the job
     *
     * The developers repo should provide a BackupPlugin with the name task
     * that can be called with the given parameters
     */
    recursiveProof(data: {
        developer: string;
        repo: string;
        transactions: string[];
        task?: string;
        userId?: string;
        args?: string;
        metadata?: string;
    }): Promise<{
        success: boolean;
        error?: string;
        jobId?: string;
    }>;
    /**
     * Starts a new job for the function call using serverless api call
     * The developer and name should correspond to the BackupPlugin of the API
     * All other parameters should correspond to the parameters of the BackupPlugin
     * @param data the data for the proof call
     * @param data.developer the developer
     * @param data.repo the repo to use
     * @param data.task the task of the job
     * @param data.args the arguments of the job
     * @returns { success: boolean, error?: string, jobId?: string }
     * where jonId is the jobId of the job
     */
    execute(data: {
        developer: string;
        repo: string;
        task?: string;
        userId?: string;
        args?: string;
        metadata?: string;
    }): Promise<{
        success: boolean;
        error?: string;
        jobId?: string;
    }>;
    /**
     * Gets the result of the job using serverless api call
     * @param data the data for the jobResult call
     * @param data.jobId the jobId of the job
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the result of the job
     * if the job is not finished yet, the result will be undefined
     * if the job failed, the result will be undefined and error will be set
     * if the job is finished, the result will be set and error will be undefined
     * if the job is not found, the result will be undefined and error will be set
     */
    jobResult(data: {
        jobId: string;
    }): Promise<{
        success: boolean;
        error?: string;
        result?: any;
    }>;
    /**
     * Gets the result of the job using serverless api call
     * @param data the data for the deploy call
     * @param data.packageName the name of the zip file with the code to be deployed
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the result of the job
     * if the job is not finished yet, the result will be undefined
     * if the job failed, the result will be undefined and error will be set
     * if the job is finished, the result will be set and error will be undefined
     * if the job is not found, the result will be undefined and error will be set
     */
    deploy(data: {
        packageName: string;
    }): Promise<{
        success: boolean;
        error?: string;
        jobId?: string;
    }>;
    /**
     * Gets the billing report for the jobs sent using JWT
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the billing report
     */
    queryBilling(): Promise<{
        success: boolean;
        error?: string;
        result?: any;
    }>;
    /**
     * Waits for the job to finish
     * @param data the data for the waitForJobResult call
     * @param data.jobId the jobId of the job
     * @param data.maxAttempts the maximum number of attempts, default is 360 (2 hours)
     * @param data.interval the interval between attempts, default is 20000 (20 seconds)
     * @param data.maxErrors the maximum number of network errors, default is 10
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the result of the job
     */
    waitForJobResult(data: {
        jobId: string;
        maxAttempts?: number;
        interval?: number;
        maxErrors?: number;
    }): Promise<{
        success: boolean;
        error?: string;
        result?: any;
    }>;
    /**
     * Calls the serverless API
     * @param command the command of the API
     * @param data the data of the API
     * */
    private apiHub;
    private isError;
    private generateJobId;
}
