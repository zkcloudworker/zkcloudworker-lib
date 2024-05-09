import { Field, Group } from "o1js";
export interface CipherTextObject {
    cipherText: Field[];
    publicKey: Group;
}
export declare class CipherText {
    static stringify(cipherText: CipherTextObject): string;
    static parse(jsonStr: string): CipherTextObject;
    static encrypt(message: string, publicId: string): string;
    static decrypt(cipherText: string, privateKey: string): string;
    static initialize(): Promise<void>;
}
