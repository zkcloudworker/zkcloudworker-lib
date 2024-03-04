import { __awaiter } from "tslib";
/**
 * Client API for calling the zkCloudWorker
 */
export { zkCloudWorkerAPI, };
class zkCloudWorkerAPI {
    constructor(apiKey) {
        this.API_KEY = "";
        this.API_KEY = apiKey;
    }
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
    prove(jobName, payload //: Promise < SerializedTxn > {
    ) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    sign(signerAddress, serializedTxn //: Promise<SignedSerializedTxn> {
    ) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    send(txn //: Promise<TxnResult> {
    ) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
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
    proveAndSend(jobName, payload //: Promise<TxnResult> {
    ) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
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
    runJob(jobName, payload //: Promise<JobResult> {
    ) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
//# sourceMappingURL=client-api.js.map