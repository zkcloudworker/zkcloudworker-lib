import { __awaiter } from "tslib";
import axios from "axios";
import { sleep } from "../mina";
import config from "../config";
const { ZKCLOUDWORKER_AUTH, ZKCLOUDWORKER_API } = config;
/**
 * API class for interacting with the zkCloudWorker
 * @property jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
 * @property endpoint The endpoint of the serverless api
 */
export class zkCloudWorker {
    /**
     * Constructor for the API class
     * @param jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
     */
    constructor(jwt) {
        this.jwt = jwt;
        this.endpoint = ZKCLOUDWORKER_API;
    }
    /**
     * Starts a new job for the proof calculation using serverless api call
     * The developer and name should correspond to the BackupPlugin of the API
     * All other parameters should correspond to the parameters of the BackupPlugin
     * @param data the data for the proof call
     * @param data.transactions the transactions
     * @param data.developer the developer
     * @param data.name the name of the job
     * @param data.task the task of the job
     * @param data.args the arguments of the job
     * @returns { success: boolean, error?: string, jobId?: string }
     * where jonId is the jobId of the job
     */
    createJob(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.apiHub("createJob", data);
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
        });
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
    jobResult(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.apiHub("jobResult", data);
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
        });
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
    deploy(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.apiHub("deploy", data);
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
        });
    }
    /**
     * Gets the billing report for the jobs sent using JWT
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the billing report
     */
    queryBilling() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.apiHub("queryBilling", {});
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
        });
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
    waitForJobResult(data) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const maxAttempts = (_a = data === null || data === void 0 ? void 0 : data.maxAttempts) !== null && _a !== void 0 ? _a : 360; // 2 hours
            const interval = (_b = data === null || data === void 0 ? void 0 : data.interval) !== null && _b !== void 0 ? _b : 20000;
            const maxErrors = (_c = data === null || data === void 0 ? void 0 : data.maxErrors) !== null && _c !== void 0 ? _c : 10;
            const errorDelay = 30000; // 30 seconds
            let attempts = 0;
            let errors = 0;
            while (attempts < maxAttempts) {
                const result = yield this.apiHub("jobResult", data);
                if (result.success === false) {
                    errors++;
                    if (errors > maxErrors) {
                        return {
                            success: false,
                            error: "Too many network errors",
                            result: undefined,
                        };
                    }
                    yield sleep(errorDelay * errors);
                }
                else {
                    if (this.isError(result.data))
                        return {
                            success: false,
                            error: result.error,
                            result: result.data,
                        };
                    else if (((_d = result.data) === null || _d === void 0 ? void 0 : _d.result) !== undefined) {
                        return {
                            success: result.success,
                            error: result.error,
                            result: result.data,
                        };
                    }
                    yield sleep(interval);
                }
                attempts++;
            }
            return {
                success: false,
                error: "Timeout",
                result: undefined,
            };
        });
    }
    /**
     * Calls the serverless API
     * @param command the command of the API
     * @param data the data of the API
     * */
    apiHub(command, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiData = {
                auth: ZKCLOUDWORKER_AUTH,
                command: command,
                jwtToken: this.jwt,
                data: data,
            };
            try {
                const response = yield axios.post(this.endpoint, apiData);
                return { success: true, data: response.data };
            }
            catch (error) {
                console.error("catch api", error);
                return { success: false, error: error };
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isError(data) {
        if (data === "error")
            return true;
        if ((data === null || data === void 0 ? void 0 : data.jobStatus) === "failed")
            return true;
        if (typeof data === "string" && data.toLowerCase().startsWith("error"))
            return true;
        return false;
    }
}
//# sourceMappingURL=api.js.map