"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonce = getNonce;
exports.getAccountNonce = getAccountNonce;
const blockberry_1 = require("./blockberry");
const __1 = require("..");
const o1js_1 = require("o1js");
async function getNonce(params) {
    const { account, chain, blockBerryApiKey } = params;
    try {
        if (account === undefined || account === null || account === "") {
            return {
                success: false,
                nonce: -1,
                message: "Account is required",
            };
        }
        if (blockBerryApiKey === undefined ||
            blockBerryApiKey === null ||
            blockBerryApiKey === "") {
            return {
                success: false,
                nonce: -1,
                message: "blockBerryApiKey is required",
            };
        }
        const zkAppTxsPromise = (0, blockberry_1.getZkAppTxsFromBlockBerry)({
            account,
            chain,
            blockBerryApiKey,
        });
        const paymentTxs = (0, blockberry_1.getPaymentTxsFromBlockBerry)({
            account,
            chain,
            blockBerryApiKey,
        });
        const paymentNonce = (await paymentTxs)?.data[0]?.nonce ?? -1;
        let zkNonce = -1;
        let found = false;
        const zkAppTxs = await zkAppTxsPromise;
        const size = zkAppTxs?.data?.length ?? 0;
        let i = 0;
        while (!found && i < size) {
            if (zkAppTxs?.data[i]?.proverAddress === account) {
                zkNonce = zkAppTxs?.data[i]?.nonce;
                found = true;
            }
            i++;
        }
        const nonce = Math.max(zkNonce, paymentNonce);
        return {
            success: true,
            nonce,
        };
    }
    catch (error) {
        return {
            success: false,
            nonce: -1,
            message: String(error),
        };
    }
}
async function getAccountNonce(params) {
    const { account, chain = (0, __1.getCurrentNetwork)().network.chainId, blockBerryApiKey, verbose = true, } = params;
    const canUseBlockBerry = blockBerryApiKey !== undefined &&
        (chain === "devnet" || chain === "mainnet");
    if (chain === "zeko") {
        const publicKey = o1js_1.PublicKey.fromBase58(account);
        await (0, __1.fetchMinaAccount)({ publicKey });
        const nonce = Number(o1js_1.Mina.getAccount(publicKey).nonce.toBigint());
        return nonce;
    }
    else {
        const blockberryNoncePromise = canUseBlockBerry
            ? getNonce({
                account,
                blockBerryApiKey,
                chain,
            })
            : undefined;
        const publicKey = o1js_1.PublicKey.fromBase58(account);
        await (0, __1.fetchMinaAccount)({ publicKey });
        const senderNonce = Number(o1js_1.Mina.getAccount(publicKey).nonce.toBigint());
        const blockberryNonce = blockberryNoncePromise
            ? (await blockberryNoncePromise).nonce ?? -1
            : -1;
        const nonce = Math.max(senderNonce, blockberryNonce + 1);
        if (verbose && nonce > senderNonce)
            console.log(`Nonce changed from ${senderNonce} to ${nonce} for ${account}`);
        return nonce;
    }
}
