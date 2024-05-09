import { zkCloudWorker, Cloud } from "../cloud/cloud";
import { blockchain } from "../networks";
export type ApiCommand = "recursiveProof" | "execute" | "sendTransactions" | "jobResult" | "deploy" | "getBalance" | "queryBilling";
/**
 * API class for interacting with the zkCloudWorker
 * @property jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
 * @property endpoint The endpoint of the serverless api
 */
export declare class zkCloudWorkerClient {
    readonly jwt: string;
    readonly endpoint: string;
    readonly chain: blockchain;
    readonly webhook?: string;
    readonly localWorker?: (cloud: Cloud) => Promise<zkCloudWorker>;
    /**
     * Constructor for the API class
     * @param jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
     */
    constructor(params: {
        jwt: string;
        zkcloudworker?: (cloud: Cloud) => Promise<zkCloudWorker>;
        chain?: blockchain;
        webhook?: string;
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
        webhook?: string;
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
     * @param data.transactions the transactions
     * @param data.task the task of the job
     * @param data.userId the userId of the job
     * @param data.args the arguments of the job
     * @param data.metadata the metadata of the job
     * @param data.mode the mode of the job execution: "sync" will not create a job, it will execute the function synchronously within 30 seconds and with the memory limit of 256 MB
     * @returns { success: boolean, error?: string, jobId?: string }
     * where jonId is the jobId of the job
     */
    execute(data: {
        developer: string;
        repo: string;
        transactions: string[];
        task: string;
        userId?: string;
        args?: string;
        metadata?: string;
        mode?: string;
    }): Promise<{
        success: boolean;
        error?: string;
        jobId?: string;
        result?: any;
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
    sendTransactions(data: {
        developer: string;
        repo: string;
        transactions: string[];
    }): Promise<{
        success: boolean;
        error?: string;
        txId?: string[];
    }>;
    /**
     * Gets the result of the job using serverless api call
     * @param data the data for the jobResult call
     * @param data.jobId the jobId of the job
     * @param data.includeLogs include logs in the result, default is false
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the result of the job
     * if the job is not finished yet, the result will be undefined
     * if the job failed, the result will be undefined and error will be set
     * if the job is finished, the result will be set and error will be undefined
     * if the job is not found, the result will be undefined and error will be set
     */
    jobResult(data: {
        jobId: string;
        includeLogs?: boolean;
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
        repo: string;
        developer: string;
        packageManager: string;
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
     * Gets the remaining balance
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the billing report
     */
    getBalance(): Promise<{
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
     * @param data.printLogs print logs, default is true
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the result of the job
     */
    waitForJobResult(data: {
        jobId: string;
        maxAttempts?: number;
        interval?: number;
        maxErrors?: number;
        printLogs?: boolean;
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
}
