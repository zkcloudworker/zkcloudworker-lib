"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionParams = transactionParams;
exports.deserializeTransaction = deserializeTransaction;
exports.serializeTransaction = serializeTransaction;
const o1js_1 = require("o1js");
const base64_1 = require("../utils/base64");
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
    const { tx, blindingValues, length, forestJSONs } = JSON.parse(serializedTransaction);
    const transaction = o1js_1.Mina.Transaction.fromJSON(JSON.parse(tx));
    const forests = forestJSONs.map((f) => JSON.parse(f));
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
        if (blindingValues[i] !== "") {
            if (transaction.transaction.accountUpdates[i].lazyAuthorization ===
                undefined ||
                transaction.transaction.accountUpdates[i].lazyAuthorization
                    .blindingValue === undefined) {
                throw new Error(`Lazy authorization blinding value is undefined for item ${i}`);
            }
            transaction.transaction.accountUpdates[i].lazyAuthorization.blindingValue = o1js_1.Field.fromJSON(blindingValues[i]);
        }
        if (forests[i].length > 0) {
            if (transaction.transaction.accountUpdates[i].lazyAuthorization ===
                undefined ||
                transaction.transaction.accountUpdates[i].lazyAuthorization
                    .args === undefined) {
                throw new Error(`Lazy authorization args is undefined for item ${i}`);
            }
            deserializeLazyAuthorization(transaction.transaction.accountUpdates[i].lazyAuthorization
                .args, forests[i]);
            if (forests[i].restoredItems !== forests[i].length) {
                throw new Error(`Forest ${i} not fully restored`);
            }
        }
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
    const blindingValues = [];
    const forests = [];
    for (i = 0; i < length; i++) {
        const la = tx.transaction.accountUpdates[i].lazyAuthorization;
        if (la !== undefined &&
            la.blindingValue !== undefined &&
            la.kind === "lazy-proof")
            blindingValues.push(la.blindingValue.toJSON());
        else
            blindingValues.push("");
        const forest = { length: 0, items: [] };
        serializeLazyAuthorization(tx.transaction.accountUpdates[i].lazyAuthorization?.args, forest);
        forests.push(forest);
    }
    const serializedTransaction = JSON.stringify({
        tx: tx.toJSON(),
        blindingValues,
        forestJSONs: forests.map((f) => JSON.stringify(f)),
        length,
        fee: tx.transaction.feePayer.body.fee.toJSON(),
        sender: tx.transaction.feePayer.body.publicKey.toBase58(),
        nonce: tx.transaction.feePayer.body.nonce.toBigint().toString(),
    }, null, 2);
    return serializedTransaction;
}
function serializeLazyAuthorization(lazyAuthorization, serialized) {
    if (lazyAuthorization?.hash !== undefined && lazyAuthorization.hash.toJSON) {
        serialized.items.push({
            h: (0, base64_1.fieldToBase64)(lazyAuthorization.hash),
        });
    }
    if (lazyAuthorization?.previousHash !== undefined &&
        lazyAuthorization.previousHash.toJSON) {
        serialized.items.push({
            p: (0, base64_1.fieldToBase64)(lazyAuthorization.previousHash),
        });
    }
    if (lazyAuthorization?.callData !== undefined &&
        lazyAuthorization.callData.toJSON) {
        serialized.items.push({
            c: (0, base64_1.fieldToBase64)(lazyAuthorization.callData),
        });
    }
    if (lazyAuthorization?.id !== undefined) {
        serialized.items.push({
            i: lazyAuthorization.id,
        });
    }
    if (Array.isArray(lazyAuthorization)) {
        for (const item of lazyAuthorization) {
            serializeLazyAuthorization(item, serialized);
        }
    }
    if (typeof lazyAuthorization === "object") {
        for (const key in lazyAuthorization) {
            serializeLazyAuthorization(lazyAuthorization[key], serialized);
        }
    }
    serialized.length = serialized.items.length;
}
function deserializeLazyAuthorization(lazyAuthorization, serialized) {
    if (serialized.restoredItems === undefined)
        serialized.restoredItems = 0;
    if (lazyAuthorization?.hash !== undefined && lazyAuthorization.hash.toJSON) {
        if (serialized.restoredItems >= serialized.length)
            throw new Error("Restored more items than expected");
        const hash = serialized.items[serialized.restoredItems].h;
        if (hash === undefined)
            throw new Error(`Hash is undefined for item ${serialized.restoredItems}`);
        lazyAuthorization.hash = (0, base64_1.fieldFromBase64)(hash);
        serialized.restoredItems++;
    }
    if (lazyAuthorization?.previousHash !== undefined &&
        lazyAuthorization.previousHash.toJSON) {
        if (serialized.restoredItems >= serialized.length)
            throw new Error("Restored more items than expected");
        const previousHash = serialized.items[serialized.restoredItems].p;
        if (previousHash === undefined)
            throw new Error(`Previous hash is undefined for item ${serialized.restoredItems}`);
        lazyAuthorization.previousHash = (0, base64_1.fieldFromBase64)(previousHash);
        serialized.restoredItems++;
    }
    if (lazyAuthorization?.callData !== undefined &&
        lazyAuthorization.callData.toJSON) {
        if (serialized.restoredItems >= serialized.length)
            throw new Error("Restored more items than expected");
        const callData = serialized.items[serialized.restoredItems].c;
        if (callData === undefined)
            throw new Error(`Call data is undefined for item ${serialized.restoredItems}`);
        lazyAuthorization.callData = (0, base64_1.fieldFromBase64)(callData);
        serialized.restoredItems++;
    }
    if (lazyAuthorization?.id !== undefined) {
        if (serialized.restoredItems >= serialized.length)
            throw new Error("Restored more items than expected");
        const id = serialized.items[serialized.restoredItems].i;
        if (id === undefined)
            throw new Error(`Id is undefined for item ${serialized.restoredItems}`);
        lazyAuthorization.id = id;
        serialized.restoredItems++;
    }
    if (Array.isArray(lazyAuthorization)) {
        for (const item of lazyAuthorization) {
            deserializeLazyAuthorization(item, serialized);
        }
    }
    if (typeof lazyAuthorization === "object") {
        for (const key in lazyAuthorization) {
            deserializeLazyAuthorization(lazyAuthorization[key], serialized);
        }
    }
}
