import { Mina } from "o1js";
import { blockchain } from "../../cloud";
export declare function sendTx(params: {
    tx: Mina.Transaction<false, true> | Mina.Transaction<true, true>;
    description?: string;
    verbose?: boolean;
    wait?: boolean;
    chain?: blockchain;
}): Promise<Mina.PendingTransaction | Mina.RejectedTransaction | Mina.IncludedTransaction | undefined>;
export declare function getTxStatusFast(params: {
    hash: string;
    chain?: blockchain;
}): Promise<{
    success: boolean;
    result?: boolean;
    error?: string;
}>;
