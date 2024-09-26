"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.txStatus = void 0;
const blockberry_1 = require("./blockberry");
const TIMEOUT = 1000 * 60 * 21;
async function txStatus(params) {
    const { hash, chain, time, blockBerryApiKey } = params;
    const tx = await (0, blockberry_1.getZkAppTxFromBlockBerry)({ hash, chain, blockBerryApiKey });
    if (tx?.txStatus)
        return tx?.txStatus;
    if (Date.now() - time > (params.timeout ?? TIMEOUT)) {
        console.error("txStatus: Timeout while checking tx with blockberry", chain, hash);
        return "replaced";
    }
    else {
        return "pending";
    }
}
exports.txStatus = txStatus;
