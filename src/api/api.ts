import axios from "axios";
import { sleep, makeString } from "../mina";
import { LocalCloud } from "../cloud/local";
import config from "../config";
import { zkCloudWorker, Cloud } from "../cloud/cloud";
import { JobData, JobStatus } from "../cloud/job";
const { ZKCLOUDWORKER_AUTH, ZKCLOUDWORKER_API } = config;

/**
 * API class for interacting with the zkCloudWorker
 * @property jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
 * @property endpoint The endpoint of the serverless api
 */
export class zkCloudWorkerClient {
  readonly jwt: string;
  readonly endpoint: string;
  readonly localJobs: Map<string, JobData> = new Map<string, JobData>();
  readonly localWorker: (cloud: Cloud) => Promise<zkCloudWorker> | undefined;

  /**
   * Constructor for the API class
   * @param jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
   */
  constructor(
    jwt: string,
    zkcloudworker:
      | ((cloud: Cloud) => Promise<zkCloudWorker>)
      | undefined = undefined
  ) {
    this.jwt = jwt;
    this.endpoint = ZKCLOUDWORKER_API;
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
  public async recursiveProof(data: {
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
  }> {
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
  public async execute(data: {
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
  }> {
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
  public async jobResult(data: { jobId: string }): Promise<{
    success: boolean;
    error?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result?: any;
  }> {
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
  public async deploy(data: { packageName: string }): Promise<{
    success: boolean;
    error?: string;
    jobId?: string;
  }> {
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
  public async queryBilling(): Promise<{
    success: boolean;
    error?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result?: any;
  }> {
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
  public async waitForJobResult(data: {
    jobId: string;
    maxAttempts?: number;
    interval?: number;
    maxErrors?: number;
  }): Promise<{
    success: boolean;
    error?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result?: any;
  }> {
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
        await sleep(errorDelay * errors);
      } else {
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
  private async apiHub(
    command: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<{ success: boolean; data?: any; error?: any }> {
    if (this.jwt === "local") {
      switch (command) {
        case "recursiveProof": {
          console.log("calculating recursive proof locally...");
          const timeCreated = Date.now();
          const jobId = this.generateJobId();
          const job: JobData = {
            id: "local",
            jobId: jobId,
            developer: data.developer,
            repo: data.repo,
            task: data.task,
            userId: data.userId,
            args: data.args,
            metadata: data.metadata,
            filename: "recursiveProof.json",
            txNumber: data.transactions.length,
            timeCreated,
            timeCreatedString: new Date(timeCreated).toISOString(),
            timeStarted: timeCreated,
            jobStatus: "started",
            maxAttempts: 0,
          } as JobData;
          const cloud = new LocalCloud({ job });

          const worker = await this.localWorker(cloud);
          if (worker === undefined) throw new Error("worker is undefined");
          const proof = await LocalCloud.sequencer({
            worker,
            data,
          });
          job.timeFinished = Date.now();
          job.jobStatus = "finished";
          job.result = proof;
          job.maxAttempts = 1;
          this.localJobs.set(jobId, job);
          return {
            success: true,
            data: jobId,
          };
        }
        case "execute": {
          console.log("executing locally...");
          const timeCreated = Date.now();
          const jobId = this.generateJobId();
          const job: JobData = {
            id: "local",
            jobId: jobId,
            developer: data.developer,
            repo: data.repo,
            task: data.task,
            userId: data.userId,
            args: data.args,
            metadata: data.metadata,
            txNumber: 1,
            timeCreated,
            timeCreatedString: new Date(timeCreated).toISOString(),
            timeStarted: timeCreated,
            jobStatus: "started",
            maxAttempts: 0,
          } as JobData;
          const cloud = new LocalCloud({ job });
          const worker = await this.localWorker(cloud);
          if (worker === undefined) throw new Error("worker is undefined");
          const result = await worker.execute();
          job.timeFinished = Date.now();
          job.jobStatus = "finished";
          job.result = result;
          job.maxAttempts = 1;
          this.localJobs.set(jobId, job);
          return {
            success: true,
            data: jobId,
          };
        }
        case "jobResult": {
          const job = this.localJobs.get(data.jobId);
          if (job === undefined) {
            return {
              success: false,
              error: "local job not found",
            };
          } else {
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
    } else {
      const apiData = {
        auth: ZKCLOUDWORKER_AUTH,
        command: command,
        jwtToken: this.jwt,
        data: data,
      };

      try {
        const response = await axios.post(this.endpoint, apiData);
        return { success: true, data: response.data };
      } catch (error: any) {
        console.error("apiHub error:", error.message ?? error);
        return { success: false, error: error };
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isError(data: any): boolean {
    if (data === "error") return true;
    if (data?.jobStatus === "failed") return true;
    if (typeof data === "string" && data.toLowerCase().startsWith("error"))
      return true;
    return false;
  }

  private generateJobId(): string {
    return "local." + Date.now().toString() + "." + makeString(32);
  }
}
