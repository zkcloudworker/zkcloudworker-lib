import { __awaiter } from "tslib";
import { Mina, fetchAccount, checkZkappTransaction, } from "o1js";
import { sleep } from "./mina";
export function fetchMinaAccount(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { publicKey, tokenId, force } = params;
        const timeout = 1000 * 60 * 10; // 10 minutes
        const startTime = Date.now();
        let result = { account: undefined };
        while (Date.now() - startTime < timeout) {
            try {
                const result = yield fetchAccount({
                    publicKey,
                    tokenId,
                });
                return result;
            }
            catch (error) {
                if (force === true)
                    console.log("Error in fetchAccount:", error);
                else {
                    console.log("fetchMinaAccount error", typeof publicKey === "string" ? publicKey : publicKey.toBase58(), tokenId === null || tokenId === void 0 ? void 0 : tokenId.toString(), force, error);
                    return result;
                }
            }
            yield sleep(1000 * 10);
        }
        console.log("fetchMinaAccount timeout", typeof publicKey === "string" ? publicKey : publicKey.toBase58(), tokenId === null || tokenId === void 0 ? void 0 : tokenId.toString(), force);
        return result;
    });
}
export function fetchMinaActions(publicKey, fromActionState, endActionState) {
    return __awaiter(this, void 0, void 0, function* () {
        const timeout = 1000 * 60 * 600; // 10 hours
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            try {
                let actions = yield Mina.fetchActions(publicKey, {
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
            yield sleep(1000 * 60 * 2);
        }
        console.log("Timeout in fetchMinaActions");
        return undefined;
    });
}
export function checkMinaZkappTransaction(hash) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield checkZkappTransaction(hash);
            return result;
        }
        catch (error) {
            console.error("Error in checkZkappTransaction:", error);
            return { success: false };
        }
    });
}
//# sourceMappingURL=fetch.js.map