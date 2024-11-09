"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIpfsURL = createIpfsURL;
function createIpfsURL(params) {
    let { hash, gateway, apiToken } = params;
    if (!gateway) {
        gateway = "https://gateway.pinata.cloud/ipfs/";
    }
    return gateway + hash + (apiToken ? "?pinataGatewayToken=" + apiToken : "");
}
