import { __awaiter } from "tslib";
import { connect, JSONCodec } from "nats";
import config from "../config";
const { NATS_SERVER } = config;
const codec = JSONCodec();
export function postReadyMessage(clientAddress, workerAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        // connect to the NATS server and send a 'ready' request
        const nc = yield connect({ servers: NATS_SERVER });
        const msg = yield nc.request(`zkcw:${clientAddress}`, codec.encode({
            post: "ready",
            params: { key: workerAddress },
        }));
        const response = codec.decode(msg.data);
        console.log("Response: ", response);
        // disconnect and clean all pending
        yield nc.drain();
        return response;
    });
}
export function postDoneMessage(clientAddress, encrypted) {
    return __awaiter(this, void 0, void 0, function* () {
        // connect to the NATS server and send a 'ready' request
        const nc = yield connect({ servers: NATS_SERVER });
        const msg = yield nc.request(`zkcw:${clientAddress}`, codec.encode({
            post: "done",
            params: { result: encrypted },
        }));
        const response = codec.decode(msg.data);
        console.log("Response: ", response);
        // disconnect and clean all pending
        yield nc.drain();
        return response;
    });
}
//# sourceMappingURL=messages.js.map