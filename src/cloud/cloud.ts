import { Cache, PrivateKey } from "o1js";

export abstract class Cloud {
  cache: Cache;
  constructor(cache: Cache) {
    this.cache = cache;
  }
  // TODO: change it to the sign method to protect the private key
  abstract getDeployer(): Promise<PrivateKey>;
  abstract log(msg: string): void;

  /* TODO: add more methods 
      -getDataByKey
      -saveDataByKey
      -saveFile
      -loadFile 
  */
  abstract getDataByKey(key: string): Promise<string | undefined>;
  abstract saveDataByKey(key: string, value: string): Promise<void>;
  abstract saveFile(filename: string, value: Buffer): Promise<void>;
  abstract loadFile(filename: string): Promise<Buffer | undefined>;
}
