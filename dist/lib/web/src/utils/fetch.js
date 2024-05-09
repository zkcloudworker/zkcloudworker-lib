import { Mina, fetchAccount, checkZkappTransaction, } from "o1js";
import { sleep } from "../mina";
export async function fetchMinaAccount(params) {
    const { publicKey, tokenId, force } = params;
    const timeout = 1000 * 60 * 2; // 2 minutes
    const startTime = Date.now();
    let result = { account: undefined };
    while (Date.now() - startTime < timeout) {
        try {
            const result = await fetchAccount({
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
        await sleep(1000 * 5);
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
export async function fetchMinaActions(publicKey, fromActionState, endActionState) {
    const timeout = 1000 * 60 * 600; // 10 hours
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        try {
            let actions = await Mina.fetchActions(publicKey, {
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
        await sleep(1000 * 60 * 2);
    }
    console.log("Timeout in fetchMinaActions");
    return undefined;
}
export async function checkMinaZkappTransaction(hash) {
    try {
        const result = await checkZkappTransaction(hash);
        return result;
    }
    catch (error) {
        console.error("Error in checkZkappTransaction:", error);
        return { success: false };
    }
}
//# sourceMappingURL=fetch.js.map