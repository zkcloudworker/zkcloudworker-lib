import axios from "axios";
import chalk from "chalk";
import { sleep } from "../utils/utils";
import { LocalCloud, LocalStorage } from "../cloud/local";
import config from "../config";
const { ZKCLOUDWORKER_AUTH, ZKCLOUDWORKER_API } = config;
/**
 * API class for interacting with the zkCloudWorker
 * @property jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
 * @property endpoint The endpoint of the serverless api
 */
export class zkCloudWorkerClient {
    /**
     * Constructor for the API class
     * @param jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
     */
    constructor(params) {
        const { jwt, zkcloudworker, chain, webhook } = params;
        this.jwt = jwt;
        this.endpoint = ZKCLOUDWORKER_API;
        this.chain = chain ?? "devnet";
        this.webhook = webhook;
        if (jwt === "local") {
            if (zkcloudworker === undefined)
                throw new Error("worker is required for local mode");
            this.localWorker = zkcloudworker;
        }
    }
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
    async recursiveProof(data) {
        const result = await this.apiHub("recursiveProof", data);
        if (result.data === "error" ||
            (typeof result.data === "string" && result.data.startsWith("error")))
            return {
                success: false,
                error: result.error,
            };
        else if (result.success === false || result.data?.success === false)
            return {
                success: false,
                error: result.error ?? result.data?.error ?? "recursiveProof call failed",
            };
        else if (result.success === true && result.data?.success === true)
            return {
                success: result.success,
                jobId: result.data.jobId,
                error: result.error,
            };
        else
            return {
                success: false,
                error: "recursiveProof call error",
            };
    }
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
    async execute(data) {
        const result = await this.apiHub("execute", data);
        if (result.data === "error" ||
            (typeof result.data === "string" && result.data.startsWith("error")))
            return {
                success: false,
                error: result.error,
            };
        else if (result.success === false || result.data?.success === false)
            return {
                success: false,
                error: result.error ?? result.data?.error ?? "execute call failed",
            };
        else if (result.success === true &&
            data.mode === "sync" &&
            result.data !== undefined)
            return {
                success: result.success,
                jobId: undefined,
                result: result.data,
                error: result.error,
            };
        else if (result.success === true &&
            data.mode !== "sync" &&
            result.data?.success === true &&
            result.data?.jobId !== undefined)
            return {
                success: result.success,
                jobId: result.data.jobId,
                result: undefined,
                error: result.error,
            };
        else
            return {
                success: false,
                error: "execute call error",
            };
    }
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
    async sendTransactions(data) {
        const result = await this.apiHub("sendTransactions", data);
        if (result.data === "error")
            // TODO: check if this is correct in AWS code
            return {
                success: false,
                error: result.error,
            };
        else
            return {
                success: result.success,
                txId: result.data,
                error: result.error,
            };
    }
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
    async jobResult(data) {
        const result = await this.apiHub("jobResult", data);
        if (this.isError(result.data))
            return {
                success: false,
                error: result.error,
                result: result.data,
            };
        else
            return {
                success: result.success,
                error: result.error,
                result: result.data,
            };
    }
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
    async deploy(data) {
        // TODO: encrypt env.json
        const { repo, developer, packageManager } = data;
        const result = await this.apiHub("deploy", {
            developer,
            repo,
            args: packageManager,
        });
        if (result.data === "error" ||
            (typeof result.data === "string" && result.data.startsWith("error")))
            return {
                success: false,
                error: result.error,
            };
        else
            return {
                success: result.success && result.data?.success,
                jobId: result.data?.jobId,
                error: result.error,
            };
    }
    /**
     * Gets the billing report for the jobs sent using JWT
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the billing report
     */
    async queryBilling() {
        const result = await this.apiHub("queryBilling", {});
        if (this.isError(result.data))
            return {
                success: false,
                error: result.error,
                result: result.data,
            };
        else
            return {
                success: result.success,
                error: result.error,
                result: result.data,
            };
    }
    /**
     * Gets the remaining balance
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the billing report
     */
    async getBalance() {
        const result = await this.apiHub("getBalance", {});
        if (this.isError(result.data))
            return {
                success: false,
                error: result.error,
                result: result.data,
            };
        else
            return {
                success: result.success,
                error: result.error,
                result: result.data,
            };
    }
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
    async waitForJobResult(data) {
        if (this.jwt === "local")
            return this.jobResult({ jobId: data.jobId });
        const maxAttempts = data?.maxAttempts ?? 360; // 1 hour
        const interval = data?.interval ?? 10000;
        const maxErrors = data?.maxErrors ?? 10;
        const errorDelay = 30000; // 30 seconds
        const printedLogs = [];
        const printLogs = data.printLogs ?? true;
        function isAllLogsFetched() {
            if (printLogs === false)
                return true;
            // search for "Billed Duration" in the logs and return true if found
            return printedLogs.some((log) => log.includes("Billed Duration"));
        }
        function print(logs) {
            logs.forEach((log) => {
                if (printedLogs.includes(log) === false) {
                    printedLogs.push(log);
                    if (printLogs) {
                        // replace all occurrences of "error" with red color
                        const text = log.replace(/error/gi, (matched) => chalk.red(matched));
                        console.log(text);
                    }
                }
            });
        }
        let attempts = 0;
        let errors = 0;
        while (attempts < maxAttempts) {
            const result = await this.apiHub("jobResult", {
                jobId: data.jobId,
                includeLogs: printLogs,
            });
            if (printLogs === true &&
                result?.data?.logs !== undefined &&
                result?.data?.logs !== null &&
                Array.isArray(result.data.logs) === true)
                print(result.data.logs);
            if (result.success === false) {
                errors++;
                if (errors > maxErrors) {
                    return {
                        success: false,
                        error: "Too many network errors",
                        result: undefined,
                    };
                }
                await sleep(errorDelay * errors);
            }
            else {
                if (this.isError(result.data))
                    return {
                        success: false,
                        error: result.error,
                        result: result.data,
                    };
                else if (result.data?.result !== undefined && isAllLogsFetched()) {
                    return {
                        success: result.success,
                        error: result.error,
                        result: result.data,
                    };
                }
                else if (result.data?.jobStatus === "failed" && isAllLogsFetched()) {
                    return {
                        success: false,
                        error: "Job failed",
                        result: result.data,
                    };
                }
                await sleep(interval);
            }
            attempts++;
        }
        return {
            success: false,
            error: "Timeout",
            result: undefined,
        };
    }
    /**
     * Calls the serverless API
     * @param command the command of the API
     * @param data the data of the API
     * */
    async apiHub(command, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) {
        if (this.jwt === "local") {
            if (this.localWorker === undefined)
                throw new Error("localWorker is undefined");
            switch (command) {
                case "recursiveProof": {
                    const jobId = await LocalCloud.run({
                        command: "recursiveProof",
                        data,
                        chain: this.chain,
                        localWorker: this.localWorker,
                    });
                    return {
                        success: true,
                        data: jobId,
                    };
                }
                case "execute": {
                    const jobId = await LocalCloud.run({
                        command: "execute",
                        data,
                        chain: this.chain,
                        localWorker: this.localWorker,
                    });
                    if (data.mode === "sync")
                        return { success: true, data: LocalStorage.jobs[jobId].result };
                    else
                        return {
                            success: true,
                            data: { success: true, jobId },
                        };
                }
                case "jobResult": {
                    const job = LocalStorage.jobs[data.jobId];
                    if (job === undefined) {
                        return {
                            success: false,
                            error: "local job not found",
                        };
                    }
                    else {
                        return {
                            success: true,
                            data: job,
                        };
                    }
                }
                case "sendTransactions": {
                    return {
                        success: true,
                        data: await LocalCloud.addTransactions(data.transactions),
                    };
                }
                case "deploy":
                    return {
                        success: true,
                        data: "local_deploy",
                    };
                case "queryBilling":
                    return {
                        success: true,
                        data: "local_queryBilling",
                    };
                default:
                    return {
                        success: false,
                        error: "local_error",
                    };
            }
        }
        else {
            const apiData = {
                auth: ZKCLOUDWORKER_AUTH,
                command: command,
                jwtToken: this.jwt,
                data: data,
                chain: this.chain,
                webhook: this.webhook, // TODO: implement webhook code on AWS
            };
            try {
                const response = await axios.post(this.endpoint, apiData);
                return { success: true, data: response.data };
            }
            catch (error) {
                console.error("apiHub error:", error.message ?? error);
                return { success: false, error: error };
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isError(data) {
        if (data === "error")
            return true;
        if (data?.jobStatus === "failed")
            return true;
        if (typeof data === "string" && data.toLowerCase().startsWith("error"))
            return true;
        if (data !== undefined && data.error !== undefined)
            return true;
        return false;
    }
}
//# sourceMappingURL=api.js.map