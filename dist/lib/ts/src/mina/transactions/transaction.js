"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionParams = transactionParams;
exports.deserializeTransaction = deserializeTransaction;
exports.serializeTransaction = serializeTransaction;
const o1js_1 = require("o1js");
function transactionParams(serializedTransaction, signedJson) {
    const { sender, nonce, tx } = JSON.parse(serializedTransaction);
    const transaction = o1js_1.Mina.Transaction.fromJSON(JSON.parse(tx));
    const memo = transaction.transaction.memo;
    return {
        fee: o1js_1.UInt64.from(signedJson.zkappCommand.feePayer.body.fee),
        sender: o1js_1.PublicKey.fromBase58(sender),
        nonce: Number(signedJson.zkappCommand.feePayer.body.nonce),
        memo,
    };
}
function deserializeTransaction(serializedTransaction, txNew, signedJson) {
    //console.log("new transaction", txNew);
    const { tx, blindingValues, length } = JSON.parse(serializedTransaction);
    const transaction = o1js_1.Mina.Transaction.fromJSON(JSON.parse(tx));
    //console.log("transaction", transaction);
    if (length !== txNew.transaction.accountUpdates.length) {
        throw new Error("New Transaction length mismatch");
    }
    if (length !== transaction.transaction.accountUpdates.length) {
        throw new Error("Serialized Transaction length mismatch");
    }
    for (let i = 0; i < length; i++) {
        transaction.transaction.accountUpdates[i].lazyAuthorization =
            txNew.transaction.accountUpdates[i].lazyAuthorization;
        if (blindingValues[i] !== "")
            transaction.transaction.accountUpdates[i].lazyAuthorization.blindingValue = o1js_1.Field.fromJSON(blindingValues[i]);
    }
    transaction.transaction.feePayer.authorization =
        signedJson.zkappCommand.feePayer.authorization;
    transaction.transaction.feePayer.body.fee = o1js_1.UInt64.from(signedJson.zkappCommand.feePayer.body.fee);
    for (let i = 0; i < length; i++) {
        const signature = signedJson.zkappCommand.accountUpdates[i].authorization.signature;
        if (signature !== undefined && signature !== null) {
            transaction.transaction.accountUpdates[i].authorization.signature =
                signedJson.zkappCommand.accountUpdates[i].authorization.signature;
        }
    }
    return transaction;
}
function serializeTransaction(tx) {
    const length = tx.transaction.accountUpdates.length;
    let i;
    let blindingValues = [];
    for (i = 0; i < length; i++) {
        const la = tx.transaction.accountUpdates[i].lazyAuthorization;
        if (la !== undefined &&
            la.blindingValue !== undefined &&
            la.kind === "lazy-proof")
            blindingValues.push(la.blindingValue.toJSON());
        else
            blindingValues.push("");
    }
    const serializedTransaction = JSON.stringify({
        tx: tx.toJSON(),
        blindingValues,
        length,
        fee: tx.transaction.feePayer.body.fee.toJSON(),
        sender: tx.transaction.feePayer.body.publicKey.toBase58(),
        nonce: tx.transaction.feePayer.body.nonce.toBigint().toString(),
    }, null, 2);
    return serializedTransaction;
}
