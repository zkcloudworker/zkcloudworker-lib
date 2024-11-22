import { zkCloudWorker, Cloud, JobData } from "../../cloud/worker";
import { blockchain } from "../../cloud/networks";
/**
 * The APICommand type for interacting with the zkCloudWorker
 * @typedef { "recursiveProof" | "execute" | "sendTransactions" | "jobResult" | "deploy" | "getBalance" | "queryBilling" } ApiCommand
 * @property recursiveProof The command for the recursiveProof calculation
 * @property execute The command for the execute function call (sync or async)
 * @property sendTransactions The command for sending transactions to the cloud
 * @property jobResult The command for getting the result of the job
 * @property deploy The command for deploying the code to the cloud, it is recommended use CLI tools for deployment
 * @property getBalance The command for getting the balance of the user's account with zkCloudWorker
 * @property queryBilling The command for getting the billing report of the user's account with zkCloudWorker
 */
export type ApiCommand = "recursiveProof" | "execute" | "sendTransactions" | "jobResult" | "deploy" | "getBalance" | "queryBilling";
/**
 * API class for interacting with the zkCloudWorker
 * @property jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
 * @property endpoint The endpoint of the serverless api
 * @property chain The blockchain network to use
 * @property webhook The webhook for the serverless api to get the results
 * @property localWorker The local worker for the serverless api to test the code locally
 */
export declare class zkCloudWorkerClient {
    readonly jwt: string;
    readonly endpoint?: string;
    readonly chain: blockchain;
    readonly webhook?: string;
    readonly localWorker?: (cloud: Cloud) => Promise<zkCloudWorker>;
    /**
     * Constructor for the API class
     * @param params the parameters for the API class
     * @param params.jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
     * @param params.zkcloudworker The local worker for the serverless api to test the code locally
     * @param params.chain The blockchain network to use
     * @param params.webhook The webhook for the serverless api to get the results
     */
    constructor(params: {
        jwt: string;
        zkcloudworker?: (cloud: Cloud) => Promise<zkCloudWorker>;
        chain?: blockchain;
        webhook?: string;
    });
    /**
     * Starts a new job for the proof calculation using serverless api call
     * @param data the data for the proof call
     * @param data.developer the developer
     * @param data.repo the repo to use
     * @param data.transactions the transactions
     * @param data.task the task of the job
     * @param data.userId the userId of the job
     * @param data.args the arguments of the job, should be serialized JSON or string
     * @param data.metadata the metadata of the job, should be serialized JSON or string
     * @param data.webhook the webhook for the job
     * @returns { success: boolean, error?: string, jobId?: string }
     * where jonId is the jobId of the job
     *
     * The developers repo should provide a zkcloudworker function
     * that can be called with the given parameters, see the examples
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
     * @param data the data for the proof call
     * @param data.developer the developer
     * @param data.repo the repo to use
     * @param data.transactions the transactions
     * @param data.task the task of the job
     * @param data.userId the userId of the job
     * @param data.args the arguments of the job
     * @param data.metadata the metadata of the job
     * @param data.mode the mode of the job execution: "sync" will not create a job, it will execute the function synchronously within 30 seconds and with the memory limit of 256 MB
     * @returns { success: boolean, error?: string, jobId?: string, result?: any }
     * where jonId is the jobId of the job (for async calls), result is the result of the job (for sync calls)
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
     * Sends transactions to the blockchain using serverless api call
     * @param data the data for the proof call
     * @param data.developer the developer
     * @param data.repo the repo to use
     * @param data.transactions the transactions
     * @returns { success: boolean, error?: string, txId?: string[] }
     * where txId is the transaction id of the transaction, in the sequence of the input transactions
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
        success: false;
        error?: string;
        result?: string;
    } | {
        success: true;
        error?: string;
        result: JobData;
    }>;
    /**
     * Deploys the code to the cloud using serverless api call
     * @param data the data for the deploy call
     * @param data.repo the repo to use
     * @param data.developer the developer
     * @param data.packageManager the package manager to use
     * @returns { success: boolean, error?: string, jobId?: string}
     * where jobId is the jobId of the job
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
     * where result is the balance
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
