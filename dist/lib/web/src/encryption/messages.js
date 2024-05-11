import { connect, JSONCodec } from "nats";
import { NATS_SERVER } from "./connections";
const codec = JSONCodec();
export async function postOptionsMessage(clientAddress, workerAddress) {
    // connect to the NATS server and send a 'ready' request
    const nc = await connect({ servers: NATS_SERVER });
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
export async function postReadyMessage(clientAddress, workerAddress) {
    // connect to the NATS server and send a 'ready' request
    const nc = await connect({ servers: NATS_SERVER });
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
export async function postDoneMessage(clientAddress, encrypted) {
    // connect to the NATS server and send a 'ready' request
    const nc = await connect({ servers: NATS_SERVER });
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
//# sourceMappingURL=messages.js.map