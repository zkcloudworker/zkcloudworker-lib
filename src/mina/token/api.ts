import { blockchain, Cloud } from "../../cloud";
import { zkCloudWorkerClient } from "../api/api";
import { zkCloudWorker } from "../../cloud/worker";

export interface FungibleTokenDeployParams {
  tokenPublicKey: string;
  adminContractPublicKey: string;
  adminPublicKey: string;
  chain: string;
  symbol: string;
  uri: string;
  serializedTransaction: string;
  signedData: string;
  sendTransaction: boolean;
}

export interface FungibleTokenMintParams {
  tokenPublicKey: string;
  adminContractPublicKey: string;
  adminPublicKey: string;
  chain: string;
  symbol: string;
  serializedTransaction: string;
  signedData: string;
  to: string;
  amount: number;
  sendTransaction: boolean;
}

export interface FungibleTokenTransferParams {
  tokenPublicKey: string;
  chain: string;
  symbol: string;
  serializedTransaction: string;
  signedData: string;
  from: string;
  to: string;
  amount: number;
  sendTransaction: boolean;
}

export interface FungibleTokenJobResult {
  success: boolean;
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
    console.log(`Deploying contract...`);

    const transaction = JSON.stringify(params, null, 2);

    const answer = await this.client.execute({
      developer: "DFST",
      repo: "token-launchpad",
      transactions: [transaction],
      task: "deploy",
      args: JSON.stringify({ sender: params.adminPublicKey }),
      metadata: `deploy token ${symbol}`,
    });
    console.log("answer:", answer);
    // TODO: handle errors and structure FungibleTokenJobResult
    const jobId = answer.jobId;
    if (jobId === undefined) console.error("Job ID is undefined");
    return jobId;
  }

  async sendMintTransaction(
    params: FungibleTokenMintParams
  ): Promise<string | undefined> {
    const { symbol } = params;
    console.log(`Minting tokens...`);

    const transaction = JSON.stringify(params, null, 2);

    const answer = await this.client.execute({
      developer: "DFST",
      repo: "token-launchpad",
      transactions: [transaction],
      task: "mint",
      args: JSON.stringify({ sender: params.adminPublicKey }),
      metadata: `mint token ${symbol}`,
    });
    console.log("answer:", answer);
    const jobId = answer.jobId;
    if (jobId === undefined) console.error("Job ID is undefined");
    return jobId;
  }

  async sendTransferTransaction(
    params: FungibleTokenTransferParams
  ): Promise<string | undefined> {
    const { symbol } = params;
    console.log(`Transferring tokens...`);

    const transaction = JSON.stringify(params, null, 2);

    const answer = await this.client.execute({
      developer: "DFST",
      repo: "token-launchpad",
      transactions: [transaction],
      task: "transfer",
      args: JSON.stringify({ sender: params.from }),
      metadata: `transfer token ${symbol}`,
    });
    console.log("answer:", answer);
    const jobId = answer.jobId;
    if (jobId === undefined) console.error("Job ID is undefined");
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

  async getResult(jobId: string): Promise<FungibleTokenJobResult> {
    try {
      const callResult = await this.client.jobResult({ jobId });
      if (!callResult.success) {
        return { success: false, error: callResult.error };
      }
      const jobResult = callResult.result?.result;
      if (callResult.error) return { success: false, error: callResult.error };
      if (!jobResult) return { success: true };

      // TODO: handle the situation when job fails

      if (jobResult.toLowerCase().startsWith("error"))
        return { success: false, error: jobResult };

      try {
        const { success, tx, hash, error } = JSON.parse(jobResult);
        if (success === undefined) return { success: false, tx, hash, error };
        return { success, tx, hash, error };
      } catch (e) {
        return {
          success: false,
          error: `Error parsing job result: ${jobResult}`,
        };
      }
    } catch (e) {
      return { success: false, error: `Error getting job result: ${e}` };
    }
  }
}
