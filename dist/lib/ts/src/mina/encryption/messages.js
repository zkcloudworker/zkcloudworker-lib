"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postOptionsMessage = postOptionsMessage;
exports.postReadyMessage = postReadyMessage;
exports.postDoneMessage = postDoneMessage;
const nats_1 = require("nats");
const connections_1 = require("./connections");
const codec = (0, nats_1.JSONCodec)();
async function postOptionsMessage(clientAddress, workerAddress) {
    // connect to the NATS server and send a 'ready' request
    const nc = await (0, nats_1.connect)({ servers: connections_1.NATS_SERVER });
    const msg = await nc.request(`zkcw:${clientAddress}`, codec.encode({
        "post": "options",
        "params": { "key": workerAddress }
    }));
    const response = codec.decode(msg.data);
    console.log("Response: ", response);
    // disconect and clean all pendings
    await nc.drain();
    return response;
}
;
async function postReadyMessage(clientAddress, workerAddress) {
    // connect to the NATS server and send a 'ready' request
    const nc = await (0, nats_1.connect)({ servers: connections_1.NATS_SERVER });
    const msg = await nc.request(`zkcw:${clientAddress}`, codec.encode({
        "post": "ready",
        "params": { "key": workerAddress }
    }));
    const response = codec.decode(msg.data);
    console.log("Response: ", response);
    // disconect and clean all pendings
    await nc.drain();
    return response;
}
;
async function postDoneMessage(clientAddress, encrypted) {
    // connect to the NATS server and send a 'ready' request
    const nc = await (0, nats_1.connect)({ servers: connections_1.NATS_SERVER });
    const msg = await nc.request(`zkcw:${clientAddress}`, codec.encode({
        "post": "done",
        "params": { "result": encrypted }
    }));
    const response = codec.decode(msg.data);
    console.log("Response: ", response);
    // disconect and clean all pendings
    await nc.drain();
    return response;
}
;
