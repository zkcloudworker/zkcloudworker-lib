"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountExists = accountExists;
exports.accountBalance = accountBalance;
exports.checkAddress = checkAddress;
const __1 = require("..");
const o1js_1 = require("o1js");
async function accountExists(address, tokenId) {
    try {
        const publicKey = typeof address === "string" ? o1js_1.PublicKey.fromBase58(address) : address;
        await (0, __1.fetchMinaAccount)({ publicKey, tokenId, force: false });
        return o1js_1.Mina.hasAccount(publicKey, tokenId);
    }
    catch (error) {
        return false;
    }
}
async function accountBalance(address, tokenId) {
    try {
        const publicKey = typeof address === "string" ? o1js_1.PublicKey.fromBase58(address) : address;
        await (0, __1.fetchMinaAccount)({ publicKey, tokenId, force: false });
        return o1js_1.Mina.hasAccount(publicKey, tokenId)
            ? Number(o1js_1.Mina.getAccount(publicKey, tokenId).balance.toBigInt())
            : undefined;
    }
    catch (error) {
        console.error("Cannot fetch account balance", error);
        return undefined;
    }
}
async function checkAddress(address) {
    if (!address || typeof address !== "string") {
        console.error("checkAddress params are invalid:", address);
        return false;
    }
    try {
        const publicKey = o1js_1.PublicKey.fromBase58(address);
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
