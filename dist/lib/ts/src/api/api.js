"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zkCloudWorkerClient = void 0;
const axios_1 = __importDefault(require("axios"));
const mina_1 = require("../mina");
const local_1 = require("../cloud/local");
const config_1 = __importDefault(require("../config"));
const { ZKCLOUDWORKER_AUTH, ZKCLOUDWORKER_API } = config_1.default;
/**
 * API class for interacting with the zkCloudWorker
 * @property jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
 * @property endpoint The endpoint of the serverless api
 */
class zkCloudWorkerClient {
    /**
     * Constructor for the API class
     * @param jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
     */
    constructor(params) {
        const { jwt, zkcloudworker, chain } = params;
        this.jwt = jwt;
        this.endpoint = ZKCLOUDWORKER_API;
        this.chain = chain ?? "berkeley";
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
        if (result.data === "error")
            return {
                success: false,
                error: result.error,
            };
        else
            return {
                success: result.success,
                jobId: result.data,
                error: result.error,
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
    async execute(data) {
        const result = await this.apiHub("execute", data);
        if (result.data === "error")
            return {
                success: false,
                error: result.error,
            };
        else
            return {
                success: result.success,
                jobId: result.data,
                error: result.error,
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
    async sendTransaction(data) {
        const result = await this.apiHub("sendTransaction", data);
        if (result.data === "error")
            return {
                success: false,
                error: result.error,
            };
        else
            return {
                success: result.success,
                jobId: result.data,
                error: result.error,
            };
    }
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
        const result = await this.apiHub("deploy", data);
        if (result.data === "error")
            return {
                success: false,
                error: result.error,
            };
        else
            return {
                success: result.success,
                jobId: result.data,
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
     * Waits for the job to finish
     * @param data the data for the waitForJobResult call
     * @param data.jobId the jobId of the job
     * @param data.maxAttempts the maximum number of attempts, default is 360 (2 hours)
     * @param data.interval the interval between attempts, default is 20000 (20 seconds)
     * @param data.maxErrors the maximum number of network errors, default is 10
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the result of the job
     */
    async waitForJobResult(data) {
        const maxAttempts = data?.maxAttempts ?? 360; // 2 hours
        const interval = data?.interval ?? 20000;
        const maxErrors = data?.maxErrors ?? 10;
        const errorDelay = 30000; // 30 seconds
        let attempts = 0;
        let errors = 0;
        while (attempts < maxAttempts) {
            const result = await this.apiHub("jobResult", data);
            if (result.success === false) {
                errors++;
                if (errors > maxErrors) {
                    return {
                        success: false,
                        error: "Too many network errors",
                        result: undefined,
                    };
                }
                await (0, mina_1.sleep)(errorDelay * errors);
            }
            else {
                if (this.isError(result.data))
                    return {
                        success: false,
                        error: result.error,
                        result: result.data,
                    };
                else if (result.data?.result !== undefined) {
                    return {
                        success: result.success,
                        error: result.error,
                        result: result.data,
                    };
                }
                await (0, mina_1.sleep)(interval);
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
                    const jobId = await local_1.LocalCloud.run({
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
                    const jobId = await local_1.LocalCloud.run({
                        command: "execute",
                        data,
                        chain: this.chain,
                        localWorker: this.localWorker,
                    });
                    return {
                        success: true,
                        data: jobId,
                    };
                }
                case "jobResult": {
                    const job = local_1.LocalStorage.jobs[data.jobId];
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
            };
            try {
                const response = await axios_1.default.post(this.endpoint, apiData);
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
        return false;
    }
}
exports.zkCloudWorkerClient = zkCloudWorkerClient;
