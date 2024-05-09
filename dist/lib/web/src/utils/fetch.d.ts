import { PublicKey, Field } from "o1js";
export declare function fetchMinaAccount(params: {
    publicKey: string | PublicKey;
    tokenId?: string | Field | undefined;
    force?: boolean;
}): Promise<{
    account: import("o1js/dist/node/bindings/mina-transaction/gen/transaction").Account;
    error: undefined;
} | {
    account: undefined;
}>;
export declare function fetchMinaActions(publicKey: PublicKey, fromActionState: Field, endActionState?: Field): Promise<{
    actions: string[][];
    hash: string;
}[] | undefined>;
export declare function checkMinaZkappTransaction(hash: string): Promise<{
    success: boolean;
    failureReason: string[][][];
} | {
    success: boolean;
    failureReason: null;
} | {
    success: boolean;
}>;
