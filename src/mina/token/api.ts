import { blockchain, Cloud, JobStatus } from "../../cloud/index.js";
import { zkCloudWorkerClient } from "../api/api.js";
import { zkCloudWorker } from "../../cloud/worker/index.js";

export interface FungibleTokenDeployParams {
  txType: "deploy";
  tokenAddress: string;
  adminContractAddress: string;
  senderAddress: string;
  chain: string;
  symbol: string;
  uri: string;
  serializedTransaction: string;
  signedData: string;
  whitelist?: { address: string; amount?: number }[] | string;
  sendTransaction: boolean;
  developerAddress?: string;
  developerFee?: number;
}

export type FungibleTokenTransactionType =
  | "mint"
  | "transfer"
  | "bid"
  | "offer"
  | "buy"
  | "sell"
  | "withdrawBid"
  | "withdrawOffer"
  | "whitelistBid"
  | "whitelistOffer"
  | "whitelistAdmin";
export interface FungibleTokenTransactionParams {
  txType: FungibleTokenTransactionType;
  tokenAddress: string;
  chain: string;
  serializedTransaction: string;
  signedData: string;
  from: string;
  to: string;
  amount?: number;
  price?: number;
  whitelist?: { address: string; amount?: number }[] | string;
  sendTransaction: boolean;
  developerAddress?: string;
  developerFee?: number;
  symbol?: string;
}

// export interface FungibleTokenJobResult {
//   success: boolean;
//   jobStatus: JobStatus | "unknown";
//   tx?: string;
//   hash?: string;
//   error?: string;
// }

export interface FungibleTokenJobResult {
  success: boolean;
  jobStatus?: JobStatus;
  tx?: string;
  hash?: string;
  error?: string;
}

export class TokenAPI {
  readonly client: zkCloudWorkerClient;

  constructor(params: {
    jwt: string;
    zkcloudworker?: (cloud: Cloud) => Promise<zkCloudWorker>;
    chain: blockchain;
  }) {
    const { jwt, zkcloudworker, chain } = params;
    if (jwt === undefined) throw new Error("jwt is undefined");

    this.client = new zkCloudWorkerClient({
      jwt,
      chain,
      zkcloudworker,
    });
  }

  async sendDeployTransaction(
    params: FungibleTokenDeployParams
  ): Promise<string | undefined> {
    const { symbol } = params;

    const transaction = JSON.stringify(params, null, 2);

    const answer = await this.client.execute({
      developer: "DFST",
      repo: "token-launchpad",
      transactions: [transaction],
      task: "deploy",
      args: JSON.stringify({ tokenAddress: params.tokenAddress }),
      metadata: `deploy token ${symbol}`,
    });

    const jobId = answer.jobId;
    if (jobId === undefined)
      console.error("Deploy Job ID is undefined", { answer, symbol });
    return jobId;
  }

  async sendTransaction(
    params: FungibleTokenTransactionParams
  ): Promise<string | undefined> {
    const { txType, symbol } = params;

    const transaction = JSON.stringify(params, null, 2);

    const answer = await this.client.execute({
      developer: "DFST",
      repo: "token-launchpad",
      transactions: [transaction],
      task: txType,
      args: JSON.stringify({ tokenAddress: params.tokenAddress }),
      metadata: `${txType} token${symbol ? ` ${symbol}` : ""}`,
    });
    const jobId = answer.jobId;
    if (jobId === undefined)
      console.error("Job ID is undefined", { answer, txType, symbol });
    return jobId;
  }

  // Warning: this function will block the thread until the job is done and will print logs to the console
  // Do not use it in "use server" functions, use getResult instead
  async waitForJobResult(params: {
    jobId: string;
    maxAttempts?: number;
    interval?: number;
    maxErrors?: number;
    printLogs?: boolean;
  }): Promise<string | undefined> {
    const deployResult = await this.client.waitForJobResult(params);
    console.log(
      "waitForJobResult result:",
      deployResult?.result?.result?.slice(0, 50)
    );
    return deployResult?.result?.result ?? "error";
  }

  // async getResult(jobId: string): Promise<FungibleTokenJobResult> {
  //   try {
  //     const callResult = await this.client.jobResult({ jobId });
  //     let jobStatus: JobStatus | "unknown" = "unknown";
  //     if (callResult?.result && typeof callResult?.result !== "string")
  //       jobStatus = callResult.result.jobStatus ?? "unknown";

  //     if (!callResult.success) {
  //       //console.error("Job result error", jobId, JSON.stringify(callResult));
  //       return {
  //         success: false,
  //         error: callResult?.error,
  //         jobStatus,
  //       };
  //     }

  //     if (callResult.error)
  //       return {
  //         success: false,
  //         error: callResult.error,
  //         jobStatus,
  //       };

  //     const jobResult = callResult.result?.result;
  //     if (!jobResult) return { success: true, jobStatus };

  //     if (typeof jobResult !== "string")
  //       return {
  //         success: false,
  //         error: `Job result is not a string: ${String(jobResult)}`,
  //         jobStatus,
  //       };

  //     if (jobResult.toLowerCase().startsWith("error"))
  //       return {
  //         success: false,
  //         error: jobResult,
  //         jobStatus,
  //       };

  //     try {
  //       const { success, tx, hash, error } = JSON.parse(jobResult);
  //       if (success === undefined)
  //         return {
  //           success: false,
  //           tx,
  //           hash,
  //           error,
  //           jobStatus,
  //         };
  //       return { success, tx, hash, error, jobStatus };
  //     } catch (e: any) {
  //       return {
  //         success: false,
  //         error: `Error parsing job result: ${jobResult} ${e?.message ?? ""}`,
  //         jobStatus,
  //       };
  //     }
  //   } catch (e: any) {
  //     return {
  //       success: false,
  //       error: `Error getting job result: ${e?.message ?? ""}`,
  //       jobStatus: "unknown",
  //     };
  //   }
  // }

  async getResult(jobId: string): Promise<FungibleTokenJobResult> {
    try {
      const callResult = await this.client.jobResult({ jobId });

      // TODO: filter the repo and developer
      const jobStatus: JobStatus | undefined =
        typeof callResult?.result === "string"
          ? undefined
          : callResult?.result?.jobStatus;
      if (!callResult.success) {
        return {
          success: false,
          error: callResult?.error,
          jobStatus,
        };
      }
      const jobResult = callResult.result?.result;
      if (callResult.error)
        return {
          success: false,
          error: callResult.error,
          jobStatus,
        };
      if (!jobResult) return { success: true, jobStatus };

      if (jobResult.toLowerCase().startsWith("error"))
        return {
          success: false,
          error: jobResult,
          jobStatus,
        };

      try {
        const { success, tx, hash, error } = JSON.parse(jobResult);
        if (success === undefined)
          return {
            success: false,
            tx,
            hash,
            error,
            jobStatus,
          };
        return { success, tx, hash, error, jobStatus };
      } catch (e: any) {
        return {
          success: false,
          error: `Error parsing job result: ${jobResult} ${e?.message ?? ""}`,
          jobStatus,
        };
      }
    } catch (e: any) {
      return {
        success: false,
        error: `Error getting job result: ${e?.message ?? ""}`,
        jobStatus: undefined,
      };
    }
  }
}
