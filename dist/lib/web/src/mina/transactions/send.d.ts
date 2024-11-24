import { Mina } from "o1js";
import { blockchain } from "../../cloud";
/**
 * The function `sendTx` sends a transaction, checks account updates, and waits for
 * confirmation on the blockchain.
 * @param params The parameters object
 * @param params.tx The transaction to send
 * @param params.description A description of the transaction
 * @param params.verbose Whether to log verbose information
 * @param params.wait Whether to wait for the transaction to be included in a block
 * @param params.chain The blockchain to send the transaction on
 * @returns The `sendTx` function returns a `Mina.IncludedTransaction`, `Mina.PendingTransaction`,
 * `Mina.RejectedTransaction`, or `undefined` if there was an error during the process.
 */
export declare function sendTx(params: {
    tx: Mina.Transaction<false, true> | Mina.Transaction<true, true>;
    description?: string;
    verbose?: boolean;
    wait?: boolean;
    chain?: blockchain;
}): Promise<Mina.IncludedTransaction | Mina.PendingTransaction | Mina.RejectedTransaction | undefined>;
export declare function getTxStatusFast(params: {
    hash: string;
    chain?: blockchain;
}): Promise<{
    success: boolean;
    result?: boolean;
    error?: string;
}>;
