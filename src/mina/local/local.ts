import { Cloud, Local, zkCloudWorker } from "../../cloud";
import { JobData, JobEvent } from "../../cloud";
import { TaskData } from "../../cloud";
import { makeString } from "../../cloud";
import { blockchain } from "../../cloud";
import { CloudTransaction, DeployerKeyPair } from "../../cloud";
import { ApiCommand } from "../api/api";

/**
 * LocalCloud is a cloud that runs on the local machine for testing and development
 * It uses LocalStorage to store jobs, tasks, transactions, and data
 * It uses a localWorker to execute the tasks
 * It can be used to test the cloud functionality without deploying to the cloud
 * @param localWorker the worker to execute the tasks
 */
export class LocalCloud extends Cloud {
  readonly localWorker: (cloud: Cloud) => Promise<zkCloudWorker>;

  /**
   * Constructor for LocalCloud
   * @param params the parameters to create the LocalCloud
   * @param params.job the job data
   * @param params.chain the blockchain to execute the job on, can be any blockchain, not only local
   * @param params.cache the cache folder
   * @param params.stepId the step id
   * @param params.localWorker the worker to execute the tasks
   */
  constructor(params: {
    job: JobData;
    chain: blockchain;
    cache?: string;
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
      cache: cache ?? "./cache",
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

  /**
   * Provides the deployer key pair for testing and development
   * @returns the deployer key pair
   */
  public async getDeployer(): Promise<DeployerKeyPair | undefined> {
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    const publicKey = process.env.DEPLOYER_PUBLIC_KEY;
    try {
      return privateKey === undefined || publicKey === undefined
        ? undefined
        : ({
            privateKey,
            publicKey,
          } as DeployerKeyPair);
    } catch (error) {
      console.error(
        `getDeployer: error getting deployer key pair: ${error}`,
        error
      );
      return undefined;
    }
  }

  /**
   * Releases the deployer key pair
   */
  public async releaseDeployer(params: {
    publicKey: string;
    txsHashes: string[];
  }): Promise<void> {
    console.log("LocalCloud: releaseDeployer", params);
  }

  /**
   * Gets the data by key
   * @param key the key to get the data
   * @returns the data
   */
  public async getDataByKey(key: string): Promise<string | undefined> {
    const value = LocalStorage.data[key];
    return value;
  }

  /**
   * Saves the data by key
   * @param key the key to save the data
   * @param value the value to save
   */
  public async saveDataByKey(
    key: string,
    value: string | undefined
  ): Promise<void> {
    if (value !== undefined) LocalStorage.data[key] = value;
    else delete LocalStorage.data[key];
  }

  /**
   * Saves the file
   * @param filename the filename to save
   * @param value the value to save
   */
  public async saveFile(filename: string, value: Buffer): Promise<void> {
    throw new Error("Method not implemented.");
    //await saveBinaryFile({ data: value, filename });
  }

  /**
   * Loads the file
   * @param filename
   * @returns the file data
   */
  public async loadFile(filename: string): Promise<Buffer | undefined> {
    throw new Error("Method not implemented.");
    //const data = await loadBinaryFile(filename);
    //return data;
  }

  /**
   * Loads the environment
   * @param password
   */
  public async loadEnvironment(password: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  /**
   * Generates an id for local cloud
   * @returns generated unique id
   */
  private static generateId(tx: string | undefined = undefined): string {
    //const data =
    //  tx ?? JSON.stringify({ time: Date.now(), data: makeString(32) });
    //return stringHash(data);
    return Date.now() + "." + makeString(32);
  }

  /**
   * Send transactions to the local cloud
   * @param transactions the transactions to add
   * @returns the transaction ids
   */
  public async sendTransactions(
    transactions: string[]
  ): Promise<CloudTransaction[]> {
    return await LocalCloud.addTransactions(transactions);
  }

  /**
   * Adds transactions to the local cloud
   * @param transactions the transactions to add
   * @returns the transaction ids
   */
  public static async addTransactions(
    transactions: string[] | CloudTransaction[]
  ): Promise<CloudTransaction[]> {
    const timeReceived = Date.now();
    const txs: CloudTransaction[] = [];
    transactions.forEach((tx) => {
      if (typeof tx === "string") {
        const txId = LocalCloud.generateId(
          JSON.stringify({ tx, time: timeReceived })
        );
        const transaction: CloudTransaction = {
          txId,
          transaction: tx,
          timeReceived,
          status: "accepted",
        };
        LocalStorage.transactions[txId] = transaction;
        txs.push(transaction);
      } else {
        LocalStorage.transactions[tx.txId] = tx;
        txs.push(tx);
      }
    });
    return txs;
  }

  /**
   * Deletes a transaction from the local cloud
   * @param txId the transaction id to delete
   */
  public async deleteTransaction(txId: string): Promise<void> {
    if (LocalStorage.transactions[txId] === undefined)
      throw new Error(`deleteTransaction: Transaction ${txId} not found`);
    delete LocalStorage.transactions[txId];
  }

  public async getTransactions(): Promise<CloudTransaction[]> {
    const txs = Object.keys(LocalStorage.transactions).map((txId) => {
      return LocalStorage.transactions[txId];
    });
    return txs;
  }

  /**
   * Runs the worker in the local cloud
   * @param params the parameters to run the worker
   * @param params.command the command to run
   * @param params.data the data to use
   * @param params.chain the blockchain to execute the job on
   * @param params.localWorker the worker to execute the tasks
   * @returns the job id
   */
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
      timeStarted: timeCreated,
      chain,
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
      LocalStorage.jobEvents[jobId] = {
        jobId,
        jobStatus: "finished",
        eventTime: timeFinished,
        result,
      };
      job.timeFinished = timeFinished;
    } else {
      LocalStorage.jobEvents[jobId] = {
        jobId,
        jobStatus: "failed",
        eventTime: timeFinished,
      };
      job.timeFailed = timeFinished;
    }
    job.billedDuration = timeFinished - timeCreated;
    LocalStorage.jobs[jobId] = job;
    return jobId;
  }

  /**
   * Runs the recursive proof in the local cloud
   * @param data the data to use
   * @param data.transactions the transactions to process
   * @param data.task the task to execute
   * @param data.userId the user id
   * @param data.args the arguments for the job
   * @param data.metadata the metadata for the job
   * @returns the job id
   */
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

  /**
   * Executes the task in the local cloud
   * @param data the data to use
   * @param data.transactions the transactions to process
   * @param data.task the task to execute
   * @param data.userId the user id
   * @param data.args the arguments for the job
   * @param data.metadata the metadata for the job
   * @returns the job id
   */
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

  /**
   * Gets the job result
   * @param jobId the job id
   * @returns the job data
   */
  public async jobResult(jobId: string): Promise<JobData | undefined> {
    return LocalStorage.jobs[jobId];
  }

  /**
   * Adds a task to the local cloud
   * @param data the data to use
   * @param data.task the task to execute
   * @param data.startTime the start time for the task
   * @param data.userId the user id
   * @param data.args the arguments for the job
   * @param data.metadata the metadata for the job
   * @returns the task id
   */
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

  /**
   * Deletes a task from the local cloud
   * @param taskId the task id to delete
   */
  public async deleteTask(taskId: string): Promise<void> {
    if (LocalStorage.tasks[taskId] === undefined)
      throw new Error(`deleteTask: Task ${taskId} not found`);
    delete LocalStorage.tasks[taskId];
  }

  /**
   * Processes the tasks in the local cloud
   */
  public async processTasks(): Promise<void> {
    await LocalCloud.processLocalTasks({
      developer: this.developer,
      repo: this.repo,
      localWorker: this.localWorker,
      chain: this.chain,
    });
  }

  /**
   * Processes the local tasks
   * @param params the parameters to process the local tasks
   * @param params.developer the developer of the repo
   * @param params.repo the repo
   * @param params.localWorker the worker to execute the tasks
   * @param params.chain the blockchain to execute the job on
   */
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
      } as JobData;
      const cloud = new LocalCloud({
        job,
        chain,
        localWorker,
      });
      const worker = await localWorker(cloud);
      const result = await worker.task();
      const timeFinished = Date.now();
      if (result !== undefined) {
        LocalStorage.jobEvents[jobId] = {
          jobId,
          jobStatus: "finished",
          eventTime: timeFinished,
          result,
        };
        job.timeFinished = timeFinished;
      } else {
        LocalStorage.jobEvents[jobId] = {
          jobId,
          jobStatus: "failed",
          eventTime: timeFinished,
        };
        job.timeFailed = timeFinished;
      }
      job.billedDuration = timeFinished - timeCreated;
      LocalStorage.jobs[jobId] = job;
    }
    let count = 0;
    for (const task in LocalStorage.tasks) count++;
    return count;
  }

  /**
   * Runs the sequencer in the local cloud
   * @param params the parameters to run the sequencer
   * @param params.worker the worker to execute the tasks
   * @param params.data the data to use
   * @returns the proof
   */
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

  /**
   * forces the worker to restart
   */
  async forceWorkerRestart(): Promise<void> {
    throw new Error("forceWorkerRestart called in LocalCloud");
  }
}

/**
 * LocalStorage is a local storage for the local cloud
 * It stores jobs, tasks, transactions, and data
 * It can be used to test the cloud functionality without deploying to the cloud
 * @param jobs the jobs
 * @param data the data
 * @param transactions the transactions
 * @param tasks the tasks
 */
export class LocalStorage {
  static jobs: { [key: string]: JobData } = {};
  static jobEvents: { [key: string]: JobEvent } = {};
  static data: { [key: string]: string } = {};
  static transactions: {
    [key: string]: CloudTransaction;
  } = {};
  static tasks: { [key: string]: TaskData } = {};

  /**
   * Saves the data
   * @param name the name to save the data
   */
  static async saveData(name: string): Promise<void> {
    throw new Error("Method not implemented.");
    const data = {
      jobs: LocalStorage.jobs,
      data: LocalStorage.data,
      transactions: LocalStorage.transactions,
      tasks: LocalStorage.tasks,
    };
    const filename = name + ".cloud";
    //await saveFile({ data, filename });
  }

  /**
   * Loads the data
   * @param name the name to load the data
   */
  static async loadData(name: string): Promise<void> {
    throw new Error("Method not implemented.");
    const filename = name + ".cloud";
    /*
    const data = await loadFile(filename);
    if (data === undefined) return;
    LocalStorage.jobs = data.jobs;
    LocalStorage.data = data.data;
    LocalStorage.transactions = data.transactions;
    LocalStorage.tasks = data.tasks;
    */
  }
}
