"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZkAppTxsFromBlockBerry = getZkAppTxsFromBlockBerry;
exports.getPaymentTxsFromBlockBerry = getPaymentTxsFromBlockBerry;
exports.getZkAppTxFromBlockBerry = getZkAppTxFromBlockBerry;
exports.getZkAppFromBlockBerry = getZkAppFromBlockBerry;
async function getZkAppTxsFromBlockBerry(params) {
    const { account, chain, blockBerryApiKey } = params;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            "x-api-key": blockBerryApiKey,
        },
    };
    try {
        const response = await fetch(`https://api.blockberry.one/mina-${chain}/v1/zkapps/accounts/${account}/txs?size=10&orderBy=DESC&sortBy=AGE`, options);
        if (!response.ok) {
            console.error("Cannot fetch zkApp txs for account:", account, chain, response.statusText);
            return undefined;
        }
        const result = await response.json();
        //console.log("zkAppTxs", result);
        return result;
    }
    catch (err) {
        console.error("Cannot fetch zkApp txs for account - catch:", account, chain, err);
        return undefined;
    }
}
async function getPaymentTxsFromBlockBerry(params) {
    const { account, chain, blockBerryApiKey } = params;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            "x-api-key": blockBerryApiKey,
        },
    };
    try {
        const response = await fetch(`https://api.blockberry.one/mina-${chain}/v1/accounts/` +
            account +
            "/txs?page=0&size=1&orderBy=DESC&sortBy=AGE&direction=OUT", options);
        if (!response.ok) {
            console.error("Cannot fetch payment txs for account:", account, chain, response.statusText);
            return undefined;
        }
        const result = await response.json();
        //console.log("paymentTxs", result);
        return result;
    }
    catch (err) {
        console.error("Cannot fetch payment txs for account - catch:", account, chain, err);
        return undefined;
    }
}
async function getZkAppTxFromBlockBerry(params) {
    const { hash, chain, blockBerryApiKey } = params;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            "x-api-key": blockBerryApiKey,
        },
    };
    try {
        const response = await fetch(`https://api.blockberry.one/mina-${chain}/v1/zkapps/txs/${hash}`, options);
        if (response.ok) {
            const result = await response.json();
            return result;
        }
        else {
            console.error("getZkAppTxFromBlockBerry error while getting hash - not ok", { hash, chain, text: response.statusText, status: response.status });
            return undefined;
        }
    }
    catch (err) {
        console.error("getZkAppTxFromBlockBerry error while getting mainnet hash - catch", hash, chain, err);
        return undefined;
    }
}
async function getZkAppFromBlockBerry(params) {
    const { account, chain, blockBerryApiKey } = params;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            "x-api-key": blockBerryApiKey,
        },
    };
    try {
        const response = await fetch(`https://api.blockberry.one/mina-${chain}/v1/zkapps/${account}`, options);
        if (response.ok) {
            const result = await response.json();
            return result;
        }
        else {
            console.error("getZkAppFromBlockBerry error while getting account", {
                account,
                chain,
                text: response.statusText,
                status: response.status,
            });
            return undefined;
        }
    }
    catch (err) {
        console.error("getZkAppFromBlockBerry error while getting account - catch", account, chain, err);
        return undefined;
    }
}
