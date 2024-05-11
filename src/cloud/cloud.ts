import type { Cache, VerificationKey } from "o1js";
import { blockchain } from "../networks";
import { JobData } from "./job";

export interface DeployedSmartContract {
  address: string;
  name: string;
  chain: blockchain;
  verificationKey: { hash: string; data: string };
}
export interface DeployerKeyPair {
  publicKey: string;
  privateKey: string;
}

export interface CloudTransaction {
  txId: string;
  transaction: string;
  timeReceived: number;
}
export abstract class Cloud {
  readonly id: string;
  readonly jobId: string;
  readonly stepId: string;
  readonly taskId: string;
  readonly cache: Cache;
  readonly developer: string;
  readonly repo: string;
  readonly task?: string;
  readonly userId?: string;
  readonly args?: string;
  readonly metadata?: string;
  readonly chain: blockchain;
  readonly isLocalCloud: boolean;

  constructor(params: {
    id: string;
    jobId: string;
    stepId: string;
    taskId: string;
    cache: Cache;
    developer: string;
    repo: string;
    task?: string;
    userId?: string;
    args?: string;
    metadata?: string;
    isLocalCloud?: boolean;
    chain: blockchain;
  }) {
    const {
      id,
      jobId,
      stepId,
      taskId,
      cache,
      developer,
      repo,
      task,
      userId,
      args,
      metadata,
      isLocalCloud,
      chain,
    } = params;
    this.id = id;
    this.jobId = jobId;
    this.stepId = stepId;
    this.taskId = taskId;
    this.cache = cache;
    this.developer = developer;
    this.repo = repo;
    this.task = task;
    this.userId = userId;
    this.args = args;
    this.metadata = metadata;
    this.isLocalCloud = isLocalCloud ?? false;
    this.chain = chain;
  }

  abstract getDeployer(): Promise<DeployerKeyPair | undefined>;
  abstract releaseDeployer(params: {
    publicKey: string;
    txsHashes: string[];
  }): Promise<void>;
  abstract getDataByKey(key: string): Promise<string | undefined>;
  abstract saveDataByKey(key: string, value: string | undefined): Promise<void>;
  abstract saveFile(filename: string, value: Buffer): Promise<void>;
  abstract loadFile(filename: string): Promise<Buffer | undefined>;
  abstract loadEnvironment(password: string): Promise<void>;
  abstract recursiveProof(data: {
    transactions: string[];
    task?: string;
    userId?: string;
    args?: string;
    metadata?: string;
  }): Promise<string>;
  abstract execute(data: {
    transactions: string[];
    task: string;
    userId?: string;
    args?: string;
    metadata?: string;
  }): Promise<string>;
  abstract addTask(data: {
    task: string;
    startTime?: number;
    userId?: string;
    args?: string;
    metadata?: string;
    maxAttempts?: number;
  }): Promise<string>;
  //TODO: abstract addTransaction(transaction: string): Promise<string>;
  abstract deleteTransaction(txId: string): Promise<void>;
  abstract getTransactions(): Promise<CloudTransaction[]>;
  abstract deleteTask(taskId: string): Promise<void>;
  abstract processTasks(): Promise<void>;
  abstract jobResult(jobId: string): Promise<JobData | undefined>;
}
export abstract class zkCloudWorker {
  readonly cloud: Cloud;

  constructor(cloud: Cloud) {
    this.cloud = cloud;
  }

  // To verify the SmartContract code
  async deployedContracts(): Promise<DeployedSmartContract[]> {
    return [];
  }

  // Those methods should be implemented for recursive proofs calculations
  async create(transaction: string): Promise<string | undefined> {
    return undefined;
  }

  async merge(proof1: string, proof2: string): Promise<string | undefined> {
    return undefined;
  }

  // Those methods should be implemented for anything except for recursive proofs
  async execute(transactions: string[]): Promise<string | undefined> {
    return undefined;
  }

  // process the transactions received by the cloud
  async processTransactions(transactions: CloudTransaction[]): Promise<void> {}

  // process the task defined by the developer
  async task(): Promise<string | undefined> {
    return undefined;
  }
}
