import { Cache, PrivateKey } from "o1js";
import { Cloud, zkCloudWorker } from "./cloud";
import { JobData } from "./job";

export class LocalCloud extends Cloud {
  data: Map<string, string> = new Map<string, string>();

  constructor(params: { job: JobData; cache?: Cache; stepId?: string }) {
    const { job, cache, stepId } = params;
    const { jobId, developer, repo, task, userId, args, metadata } = job;
    super({
      jobId: jobId,
      stepId: stepId ?? "stepId",
      cache: cache ?? Cache.FileSystem("./cache"),
      developer: developer,
      repo: repo,
      task: task,
      userId: userId,
      args: args,
      metadata: metadata,
      isLocalCloud: true,
    });
  }
  public async getDeployer(): Promise<PrivateKey> {
    throw new Error("Method not implemented.");
  }
  public async log(msg: string): Promise<void> {
    console.log("LocalCloud:", msg);
  }

  public async getDataByKey(key: string): Promise<string | undefined> {
    const value = this.data.get(key);
    return value;
  }

  public async saveDataByKey(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  public async saveFile(filename: string, value: Buffer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public async loadFile(filename: string): Promise<Buffer | undefined> {
    throw new Error("Method not implemented.");
  }
  public async loadEnvironment(password: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  static async sequencer(params: {
    worker: zkCloudWorker;
    data: {
      developer: string;
      repo: string;
      transactions: string[];
      task?: string;
      userId?: string;
      args?: string;
      metadata?: string;
    };
  }): Promise<string> {
    const { worker, data } = params;
    const { transactions } = data;
    if (transactions.length === 0)
      throw new Error("No transactions to process");
    const proofs: string[] = [];
    for (const transaction of transactions) {
      const result = await worker.create(transaction);
      if (result === undefined) throw new Error("Failed to create proof");
      proofs.push(result);
    }
    let proof = proofs[0];
    for (let i = 1; i < proofs.length; i++) {
      const result = await worker.merge(proof, proofs[i]);
      if (result === undefined) throw new Error("Failed to merge proofs");
      proof = result;
    }
    return proof;
  }
}
