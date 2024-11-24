import { PublicKey, Field } from "o1js";
/**
 * Fetches the Mina account for a given public key with error handling
 * @param params the parameters for fetching the account
 * @param params.publicKey the public key of the account
 * @param params.tokenId the token id of the account
 * @param params.force whether to force the fetch - use it only if you are sure the account exists
 * @returns the account object
 */
export declare function fetchMinaAccount(params: {
    publicKey: string | PublicKey;
    tokenId?: string | Field | undefined;
    force?: boolean;
}): Promise<{
    account: undefined;
} | {
    account: import("node_modules/o1js/dist/node/bindings/mina-transaction/gen/transaction.js").Account;
    error: undefined;
}>;
/**
 * Fetches the Mina actions for a given public key with error handling
 * @param publicKey the public key of the contract
 * @param fromActionState the starting action state
 * @param endActionState the ending action state
 * @returns the actions array
 */
export declare function fetchMinaActions(publicKey: PublicKey, fromActionState: Field, endActionState?: Field): Promise<{
    actions: string[][];
    hash: string;
}[] | undefined>;
/**
 * Fetches the Mina transaction for a given hash with error handling
 * @param hash the hash of the transaction
 * @returns the transaction object
 */
export declare function checkMinaZkappTransaction(hash: string): Promise<{
    success: boolean;
    failureReason: string[][][];
} | {
    success: boolean;
    failureReason: null;
} | {
    success: boolean;
}>;
