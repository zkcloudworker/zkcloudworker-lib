"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonce = getNonce;
const blockberry_1 = require("./blockberry");
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
