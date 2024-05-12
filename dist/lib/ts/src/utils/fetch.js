"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMinaZkappTransaction = exports.fetchMinaActions = exports.fetchMinaAccount = void 0;
const o1js_1 = require("o1js");
const utils_1 = require("./utils");
/**
 * Fetches the Mina account for a given public key with error handling
 * @param params the parameters for fetching the account
 * @param params.publicKey the public key of the account
 * @param params.tokenId the token id of the account
 * @param params.force whether to force the fetch - use it only if you are sure the account exists
 * @returns the account object
 */
async function fetchMinaAccount(params) {
    const { publicKey, tokenId, force } = params;
    const timeout = 1000 * 60 * 2; // 2 minutes
    const startTime = Date.now();
    let result = { account: undefined };
    while (Date.now() - startTime < timeout) {
        try {
            const result = await (0, o1js_1.fetchAccount)({
                publicKey,
                tokenId,
            });
            return result;
        }
        catch (error) {
            if (force === true)
                console.log("Error in fetchMinaAccount:", {
                    error,
                    publicKey: typeof publicKey === "string" ? publicKey : publicKey.toBase58(),
                    tokenId: tokenId?.toString(),
                    force,
                });
            else {
                console.log("fetchMinaAccount error", {
                    error,
                    publicKey: typeof publicKey === "string" ? publicKey : publicKey.toBase58(),
                    tokenId: tokenId?.toString(),
                    force,
                });
                return result;
            }
        }
        await (0, utils_1.sleep)(1000 * 5);
    }
    if (force === true)
        throw new Error(`fetchMinaAccount timeout
      ${{
            publicKey: typeof publicKey === "string" ? publicKey : publicKey.toBase58(),
            tokenId: tokenId?.toString(),
            force,
        }}`);
    else
        console.log("fetchMinaAccount timeout", typeof publicKey === "string" ? publicKey : publicKey.toBase58(), tokenId?.toString(), force);
    return result;
}
exports.fetchMinaAccount = fetchMinaAccount;
/**
 * Fetches the Mina actions for a given public key with error handling
 * @param publicKey the public key of the contract
 * @param fromActionState the starting action state
 * @param endActionState the ending action state
 * @returns the actions array
 */
async function fetchMinaActions(publicKey, fromActionState, endActionState) {
    const timeout = 1000 * 60 * 600; // 10 hours
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        try {
            let actions = await o1js_1.Mina.fetchActions(publicKey, {
                fromActionState,
                endActionState,
            });
            if (Array.isArray(actions))
                return actions;
            else
                console.log("Cannot fetch actions - wrong format");
        }
        catch (error) {
            console.log("Error in fetchMinaActions", error.toString().substring(0, 300));
        }
        await (0, utils_1.sleep)(1000 * 60 * 2);
    }
    console.log("Timeout in fetchMinaActions");
    return undefined;
}
exports.fetchMinaActions = fetchMinaActions;
/**
 * Fetches the Mina transaction for a given hash with error handling
 * @param hash the hash of the transaction
 * @returns the transaction object
 */
async function checkMinaZkappTransaction(hash) {
    try {
        const result = await (0, o1js_1.checkZkappTransaction)(hash);
        return result;
    }
    catch (error) {
        console.error("Error in checkZkappTransaction:", error);
        return { success: false };
    }
}
exports.checkMinaZkappTransaction = checkMinaZkappTransaction;
