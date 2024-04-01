import { Cache, PrivateKey } from "o1js";
import { Cloud } from "./cloud";

export class LocalCloud extends Cloud {
  data: Map<string, string> = new Map<string, string>();

  constructor(
    params: {
      jobId?: string;
      stepId?: string;
      cache?: Cache;
      developer?: string;
      repo?: string;
      task?: string;
      userId?: string;
      args?: string;
      metadata?: string;
    } = {}
  ) {
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
    } = params;
    super({
      jobId: jobId || "jobId",
      stepId: stepId || "stepId",
      cache: cache || Cache.FileSystem("./cache"),
      developer: developer || "developer",
      repo: repo || "repo",
      task: task || "task",
      userId: userId || "userId",
      args: args || "args",
      metadata: metadata || "metadata",
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
}
