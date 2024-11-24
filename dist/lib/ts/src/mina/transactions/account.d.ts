import { PublicKey, Field } from "o1js";
export declare function accountExists(address: string | PublicKey, tokenId?: Field): Promise<boolean>;
export declare function tokenBalance(address: string | PublicKey, tokenId?: Field): Promise<number | undefined>;
export declare function checkAddress(address: string | undefined): Promise<boolean>;
