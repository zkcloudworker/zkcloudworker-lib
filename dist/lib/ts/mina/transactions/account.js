import { fetchMinaAccount } from "../index.js";
import { Mina, PublicKey } from "o1js";
export async function accountExists(address, tokenId) {
    try {
        const publicKey = typeof address === "string" ? PublicKey.fromBase58(address) : address;
        await fetchMinaAccount({ publicKey, tokenId, force: false });
        return Mina.hasAccount(publicKey, tokenId);
    }
    catch (error) {
        return false;
    }
}
export async function tokenBalance(address, tokenId) {
    try {
        const publicKey = typeof address === "string" ? PublicKey.fromBase58(address) : address;
        await fetchMinaAccount({ publicKey, tokenId, force: false });
        return Mina.hasAccount(publicKey, tokenId)
            ? Number(Mina.getAccount(publicKey, tokenId).balance.toBigInt())
            : undefined;
    }
    catch (error) {
        console.error("Cannot fetch account balance", error);
        return undefined;
    }
}
export async function checkAddress(address) {
    if (!address || typeof address !== "string") {
        console.error("checkAddress params are invalid:", address);
        return false;
    }
    try {
        const publicKey = PublicKey.fromBase58(address);
        if (address !== publicKey.toBase58()) {
            console.log("checkAddress: address is not valid", address, publicKey.toBase58());
            return false;
        }
        return true;
    }
    catch (error) {
        console.error("checkAddress catch", { address, error });
        return false;
    }
}
//# sourceMappingURL=account.js.map