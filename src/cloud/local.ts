import { Cache, PrivateKey } from "o1js";
import { Cloud, zkCloudWorker } from "./cloud";
import { JobData } from "./job";
import { TaskData } from "./task";
import { makeString } from "../mina";
import { blockchain } from "../networks";
import { saveFile, loadFile, saveBinaryFile, loadBinaryFile } from "./files";

export class LocalCloud extends Cloud {
  readonly localWorker: (cloud: Cloud) => Promise<zkCloudWorker>;
  constructor(params: {
    job: JobData;
    chain: blockchain;
    cache?: Cache;
    stepId?: string;
    localWorker: (cloud: Cloud) => Promise<zkCloudWorker>;
  }) {
    const { job, chain, cache, stepId, localWorker } = params;

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
    this.localWorker = localWorker;
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

  private generateId(): string {
    return "local." + Date.now().toString() + "." + makeString(32);
  }

  public async recursiveProof(data: {
    transactions: string[];
    task?: string;
    userId?: string;
    args?: string;
    metadata?: string;
  }): Promise<string> {
    console.log("calculating recursive proof locally...");

    const timeCreated = Date.now();
    const jobId = this.generateId();
    const job: JobData = {
      id: "local",
      jobId: jobId,
      developer: this.developer,
      repo: this.repo,
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

    const cloud = new LocalCloud({
      job,
      chain: this.chain,
      localWorker: this.localWorker,
    });

    const worker = await this.localWorker(cloud);
    if (worker === undefined) throw new Error("worker is undefined");
    const proof = await LocalCloud.sequencer({
      worker,
      data: { ...data, developer: this.developer, repo: this.repo },
    });
    job.timeFinished = Date.now();
    job.jobStatus = "finished";
    job.result = proof;
    job.maxAttempts = 1;
    LocalStorage.jobs[jobId] = job;
    return jobId;
  }

  public async execute(data: {
    task: string;
    userId?: string;
    args?: string;
    metadata?: string;
  }): Promise<string> {
    console.log("executing locally...");
    const timeCreated = Date.now();
    const jobId = this.generateId();
    const job: JobData = {
      id: "local",
      jobId: jobId,
      developer: this.developer,
      repo: this.repo,
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
    const cloud = new LocalCloud({
      job,
      chain: this.chain,
      localWorker: this.localWorker,
    });
    const worker = await this.localWorker(cloud);
    if (worker === undefined) throw new Error("worker is undefined");
    const result = await worker.execute();
    job.timeFinished = Date.now();
    job.jobStatus = "finished";
    job.result = result;
    job.maxAttempts = 1;
    LocalStorage.jobs[jobId] = job;
    return jobId;
  }

  public async addTask(data: {
    task: string;
    userId?: string;
    args?: string;
    metadata?: string;
  }): Promise<string> {
    const taskId = this.generateId();
    LocalStorage.tasks[taskId] = {
      ...data,
      id: "local",
      taskId,
      developer: this.developer,
      repo: this.repo,
    } as TaskData;
    return taskId;
  }

  public async deleteTask(taskId: string): Promise<void> {
    delete LocalStorage.tasks[taskId];
  }

  public async processTasks(): Promise<void> {
    for (const taskId in LocalStorage.tasks) {
      const data = LocalStorage.tasks[taskId];
      const jobId = this.generateId();
      const timeCreated = Date.now();
      const job = {
        id: "local",
        jobId: jobId,
        developer: this.developer,
        repo: this.repo,
        task: data.task,
        userId: data.userId,
        args: data.args,
        metadata: data.metadata,
        txNumber: 1,
        timeCreated: timeCreated,
        timeCreatedString: new Date(timeCreated).toISOString(),
        timeStarted: Date.now(),
        jobStatus: "started",
        maxAttempts: 0,
      } as JobData;
      const cloud = new LocalCloud({
        job,
        chain: this.chain,
        localWorker: this.localWorker,
      });
      const worker = await this.localWorker(cloud);
      console.log("Executing task", { taskId, data });
      const result = await worker.task();
      job.timeFinished = Date.now();
      job.maxAttempts = 1;
      job.billedDuration = job.timeFinished - timeCreated;
      if (result !== undefined) {
        job.jobStatus = "finished";
        job.result = result;
      } else {
        job.jobStatus = "failed";
      }
      LocalStorage.jobs[jobId] = job;
    }
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
  static tasks: { [key: string]: TaskData } = {};

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
