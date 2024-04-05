import { Cache, PrivateKey, PublicKey, SmartContract } from "o1js";
import { blockchain } from "../networks";

export interface DeployedSmartContract {
  address: PublicKey;
  contract: SmartContract;
  chain: blockchain;
}
export abstract class Cloud {
  readonly jobId: string;
  readonly stepId: string;
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
    jobId: string;
    stepId: string;
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
      jobId,
      stepId,
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
    this.jobId = jobId;
    this.stepId = stepId;
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

  // TODO: change it to the sign method to protect the private key
  abstract getDeployer(): Promise<PrivateKey>;
  abstract log(msg: string): void;
  abstract getDataByKey(key: string): Promise<string | undefined>;
  abstract saveDataByKey(key: string, value: string): Promise<void>;
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
    task: string;
    userId?: string;
    args?: string;
    metadata?: string;
  }): Promise<string>;
  abstract addTask(data: {
    task: string;
    userId?: string;
    args?: string;
    metadata?: string;
  }): Promise<string>;
  abstract deleteTask(taskId: string): Promise<void>;
  abstract processTasks(): Promise<void>;
}

export interface CloudTransaction {
  txId: string;
  transaction: string;
  timeReceived: number;
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
  async execute(): Promise<string | undefined> {
    return undefined;
  }

  // process the transactions received by the cloud
  async processTransactions(transactions: CloudTransaction[]): Promise<void> {}

  // process the task defined by the developer
  async task(): Promise<string | undefined> {
    return undefined;
  }
}
