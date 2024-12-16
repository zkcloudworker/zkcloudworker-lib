import { PublicKey, Transaction, Mina, UInt64 } from "o1js";
import { TransactionPayloads } from "@minatokens/api";
export declare function createTransactionPayloads(tx: Mina.Transaction<false, false> | Mina.Transaction<false, true>): TransactionPayloads;
export declare function transactionParams(params: {
    proverPayload: string;
    signedData: string;
} | TransactionPayloads): {
    fee: UInt64;
    sender: PublicKey;
    nonce: number;
    memo: string;
};
export declare function parseTransactionPayloads(params: {
    proverPayload: string;
    signedData: string;
    txNew: Mina.Transaction<false, false> | Mina.Transaction<false, true>;
} | {
    payloads: TransactionPayloads;
    txNew: Mina.Transaction<false, false> | Mina.Transaction<false, true>;
}): Transaction<false, true>;
export declare function serializeTransaction(tx: Mina.Transaction<false, false> | Mina.Transaction<false, true>): string;
