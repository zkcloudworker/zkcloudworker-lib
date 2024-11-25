import { getZkAppTxFromBlockBerry } from "./blockberry.js";
const TIMEOUT = 1000 * 60 * 21;
export async function txStatusBlockberry(params) {
    const { hash, chain, time, blockBerryApiKey } = params;
    const tx = await getZkAppTxFromBlockBerry({ hash, chain, blockBerryApiKey });
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
//# sourceMappingURL=txstatus.js.map