/**
 * Client API for calling the zkCloudWorker
 */
export { TxnPayload, IsError, SerializedTxn, SignedSerializedTxn, TxnResult, JobPayload, JobResult, zkCloudWorkerAPI, };
interface TxnPayload {
    data: object;
    options?: object;
}
interface IsError {
    code: number;
    message: string;
    exception: any;
}
interface SerializedTxn {
    hash: string | null;
    transaction: any | null;
    error: IsError | null;
}
interface SignedSerializedTxn {
    hash: string | null;
    transaction: any | null;
    error: IsError | null;
}
interface TxnResult {
    hash: string | null;
    data: any | null;
    error: IsError | null;
}
interface JobPayload {
    data: object;
    options?: object;
}
interface JobResult {
    data: any | null;
    error: IsError | null;
}
declare class zkCloudWorkerAPI {
    private API_KEY;
    constructor(apiKey: string);
    /**
     * prove() sign() and send()
     *
     * The called cloud worker is expected to compile the needed Contract,
     * create the transaction, prove it and send it back serialized.
     *
     * Then the serialized transaction can be signed locally using AuroWallet
     * and finally send it to MINA using the cloud worker.
     *
     * IMPORTANT: the transaction fee  will be paid by the local sender, using
     * the Auro Wallet at the moment of signing the serialized transaction.
     *
     * We only need the sender public key to create and prove the transaction.
     * The sender private key NEVER leaves the local wallet.
     *
     * Example:
     * ~~~
     *  let zkWorker = new ZKRunner(API_KEY);
     *
     *  let serializedTxn = await zkWorker.prove('batch-voting-...', {
     *    data: {
     *      claimUid: '012345...789',
     *      // ...
     *    },
     *    options: {
     *      senderAddress: 'B62...',
     *      fee: MIN_FEE // MAX_FEE | AUTO_FEE | number
     *    }
     *  });
     *  if (serializedTxn.error)
     *    // treat error here
     *
     *  let signedTxn = await zkWorker.sign(signerAddress, serializedTxn);
     *  if (signedTxn.error)
     *    // treat error here
     *
     *  let txnResult = await zkWorker.send(signedTxn) ;
     *  if (txnResult.error)
     *    // treat error here
     * ~~~
     */
    prove(jobName: string, payload: TxnPayload): Promise<void>;
    sign(signerAddress: string, serializedTxn: SerializedTxn): Promise<void>;
    send(txn: SignedSerializedTxn): Promise<void>;
    /**
     * proveAndSend()
     *
     * The called cloud worker is expected to do all: compile the needed Contract,
     * create the transaction, prove it, sign it using one of the available
     * fee payers, and finally send it to MINA.
     *
     * IMPORTANT: the transaction fee  will be paid by the first fee payer
     * available from the list of fee payers provided by the ZKRunner service.
     * Also the fee will be set by the cloud worker using some optimal algorithm
     * that minimizes fees.
     *
     * In this case the sender public key to create and prove the transaction
     * will be the selected ZKRunner fee payer previously mentioned.
     *
     * Example:
     * ~~~
     *  let zkWorker = new ZKRunner(API_KEY);
     *
     *  let txnResult = await zkWorker.proveAndSend('batch-voting-...', {
     *    data: {
     *      claimUid: '012345...789',
     *      // ...
     *    }
     *  });
     *
     *  if (txnResult.error)
     *    // treat error here
     * ~~~
     */
    proveAndSend(jobName: string, payload: TxnPayload): Promise<void>;
    /**
     * runJob()
     *
     * The called cloud worker can also be used to easily run jobs not related to
     * a MINA transaction, and will act just like any serverless function.
     *
     * This "generic" job can benefit from the easy to use deploy and call service
     * already implemented for cloud proving without no extra costs.
     *
     * IMPORTANT: there will be a small fee that needs to be paid for service usage,
     * but no MINA fees need to be paid.
     *
     * Example:
     * ~~~
     *  let zkWorker = new ZKRunner(API_KEY);
     *
     *  let jobResult = await zkWorker.runJob('send-email-to-judges', {
     *    data: {
     *      judges: [
     *        // ...
     *      ],
     *    },
     *    options: {
     *      // ...
     *    }
     *  });
     *
     *  if (txnResult.error)
     *    // treat error here
     * ~~~
     */
    runJob(jobName: string, payload: JobPayload): Promise<void>;
}
