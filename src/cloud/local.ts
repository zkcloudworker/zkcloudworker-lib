import { Cache, PrivateKey } from "o1js";
import { Cloud, zkCloudWorker } from "./cloud";
import { JobData } from "./job";
import { TaskData } from "./task";
import { makeString, getDeployer } from "../mina";
import { blockchain } from "../networks";
import { saveFile, loadFile, saveBinaryFile, loadBinaryFile } from "./files";
import { CloudTransaction } from "./cloud";
import { ApiCommand } from "../api/api";

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

    const { id, jobId, developer, repo, task, userId, args, metadata, taskId } =
      job;
    super({
      id: id,
      jobId: jobId,
      stepId: stepId ?? "stepId",
      taskId: taskId ?? "taskId",
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
  public async getDeployer(): Promise<PrivateKey | undefined> {
    return getDeployer();
  }

  public async releaseDeployer(txsHashes: string[]): Promise<void> {
    console.log("LocalCloud: releaseDeployer", txsHashes);
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

  private static generateId(): string {
    return "local." + Date.now().toString() + "." + makeString(32);
  }

  public static async addTransaction(transaction: string): Promise<string> {
    const timeReceived = Date.now();
    const id = LocalCloud.generateId();
    LocalStorage.transactions[id] = { transaction, timeReceived };
    return id;
  }

  public async deleteTransaction(txId: string): Promise<void> {
    if (LocalStorage.transactions[txId] === undefined)
      throw new Error(`deleteTransaction: Transaction ${txId} not found`);
    delete LocalStorage.transactions[txId];
  }

  public async getTransactions(): Promise<CloudTransaction[]> {
    const txs = Object.keys(LocalStorage.transactions).map((txId) => {
      const { transaction, timeReceived } = LocalStorage.transactions[txId];
      return {
        txId,
        transaction,
        timeReceived,
      };
    });
    return txs;
  }

  public static async run(params: {
    command: ApiCommand;
    data: {
      developer: string;
      repo: string;
      transactions: string[];
      task: string;
      userId?: string;
      args?: string;
      metadata?: string;
    };
    chain: blockchain;
    localWorker: (cloud: Cloud) => Promise<zkCloudWorker>;
  }): Promise<string> {
    const { command, data, chain, localWorker } = params;
    const { developer, repo, transactions, task, userId, args, metadata } =
      data;

    const timeCreated = Date.now();
    const jobId = LocalCloud.generateId();
    const job: JobData = {
      id: "local",
      jobId,
      developer,
      repo,
      task,
      userId,
      args,
      metadata,
      txNumber: command === "recursiveProof" ? transactions.length : 1,
      timeCreated,
      timeCreatedString: new Date(timeCreated).toISOString(),
      timeStarted: timeCreated,
      jobStatus: "started",
      maxAttempts: 0,
    } as JobData;
    const cloud = new LocalCloud({
      job,
      chain,
      localWorker,
    });
    const worker = await localWorker(cloud);
    if (worker === undefined) throw new Error("worker is undefined");
    const result =
      command === "recursiveProof"
        ? await LocalCloud.sequencer({
            worker,
            data,
          })
        : command === "execute"
        ? await worker.execute(transactions)
        : undefined;

    const timeFinished = Date.now();
    if (result !== undefined) {
      job.jobStatus = "finished";
      job.timeFinished = timeFinished;
      job.result = result;
    } else {
      job.jobStatus = "failed";
      job.timeFailed = timeFinished;
    }
    job.maxAttempts = 1;
    job.billedDuration = timeFinished - timeCreated;
    LocalStorage.jobs[jobId] = job;
    return jobId;
  }

  public async recursiveProof(data: {
    transactions: string[];
    task?: string;
    userId?: string;
    args?: string;
    metadata?: string;
  }): Promise<string> {
    return await LocalCloud.run({
      command: "recursiveProof",
      data: {
        developer: this.developer,
        repo: this.repo,
        transactions: data.transactions,
        task: data.task ?? "recursiveProof",
        userId: data.userId,
        args: data.args,
        metadata: data.metadata,
      },
      chain: this.chain,
      localWorker: this.localWorker,
    });
  }

  public async execute(data: {
    transactions: string[];
    task: string;
    userId?: string;
    args?: string;
    metadata?: string;
  }): Promise<string> {
    return await LocalCloud.run({
      command: "execute",
      data: {
        developer: this.developer,
        repo: this.repo,
        transactions: data.transactions,
        task: data.task,
        userId: data.userId,
        args: data.args,
        metadata: data.metadata,
      },
      chain: this.chain,
      localWorker: this.localWorker,
    });
  }

  public async jobResult(jobId: string): Promise<JobData | undefined> {
    return LocalStorage.jobs[jobId];
  }

  public async addTask(data: {
    task: string;
    startTime?: number;
    userId?: string;
    args?: string;
    metadata?: string;
  }): Promise<string> {
    const taskId = LocalCloud.generateId();
    LocalStorage.tasks[taskId] = {
      ...data,
      id: "local",
      taskId,
      timeCreated: Date.now(),
      developer: this.developer,
      repo: this.repo,
      chain: this.chain,
    } as TaskData;
    return taskId;
  }

  public async deleteTask(taskId: string): Promise<void> {
    if (LocalStorage.tasks[taskId] === undefined)
      throw new Error(`deleteTask: Task ${taskId} not found`);
    delete LocalStorage.tasks[taskId];
  }

  public async processTasks(): Promise<void> {
    await LocalCloud.processLocalTasks({
      developer: this.developer,
      repo: this.repo,
      localWorker: this.localWorker,
      chain: this.chain,
    });
  }

  static async processLocalTasks(params: {
    developer: string;
    repo: string;
    localWorker: (cloud: Cloud) => Promise<zkCloudWorker>;
    chain: blockchain;
  }): Promise<number> {
    const { developer, repo, localWorker, chain } = params;
    for (const taskId in LocalStorage.tasks) {
      const data = LocalStorage.tasks[taskId];
      const jobId = LocalCloud.generateId();
      const timeCreated = Date.now();
      if (data.startTime !== undefined && data.startTime < timeCreated)
        continue;
      const job = {
        id: "local",
        jobId: jobId,
        taskId: taskId,
        developer,
        repo,
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
        chain,
        localWorker,
      });
      const worker = await localWorker(cloud);
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
    let count = 0;
    for (const task in LocalStorage.tasks) count++;
    return count;
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
