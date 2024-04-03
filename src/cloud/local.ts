import { Cache, PrivateKey } from "o1js";
import { Cloud, zkCloudWorker } from "./cloud";
import { JobData } from "./job";
import { blockchain } from "../networks";
import { saveFile, loadFile, saveBinaryFile, loadBinaryFile } from "./files";

export class LocalCloud extends Cloud {
  constructor(params: {
    job: JobData;
    chain: blockchain;
    cache?: Cache;
    stepId?: string;
  }) {
    const { job, chain, cache, stepId } = params;
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
      chain,
    });
  }
  public async getDeployer(): Promise<PrivateKey> {
    throw new Error("Method not implemented.");
  }
  public async log(msg: string): Promise<void> {
    console.log("LocalCloud:", msg);
  }

  public async getDataByKey(key: string): Promise<string | undefined> {
    const value = LocalStorage.data[key];
    return value;
  }

  public async saveDataByKey(key: string, value: string): Promise<void> {
    LocalStorage.data[key] = value;
  }

  public async saveFile(filename: string, value: Buffer): Promise<void> {
    await saveBinaryFile({ data: value, filename });
  }
  public async loadFile(filename: string): Promise<Buffer | undefined> {
    const data = await loadBinaryFile(filename);
    return data;
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

export class LocalStorage {
  static jobs: { [key: string]: JobData } = {};
  static data: { [key: string]: string } = {};
  static transactions: {
    [key: string]: { transaction: string; timeReceived: number };
  } = {};
  static tasks: { [key: string]: string } = {};

  static async saveData(name: string): Promise<void> {
    const data = {
      jobs: LocalStorage.jobs,
      data: LocalStorage.data,
      transactions: LocalStorage.transactions,
      tasks: LocalStorage.tasks,
    };
    const filename = name + ".cloud";
    await saveFile({ data, filename });
  }

  static async loadData(name: string): Promise<void> {
    const filename = name + ".cloud";
    const data = await loadFile(filename);
    if (data === undefined) return;
    LocalStorage.jobs = data.jobs;
    LocalStorage.data = data.data;
    LocalStorage.transactions = data.transactions;
    LocalStorage.tasks = data.tasks;
  }
}
