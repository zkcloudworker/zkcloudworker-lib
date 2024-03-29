import { Cache, PrivateKey } from "o1js";
import { Cloud } from "./cloud";

export class LocalCloud {
  cache: Cache;
  data: Map<string, string> = new Map<string, string>();

  constructor(cache: Cache) {
    this.cache = cache;
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
}
