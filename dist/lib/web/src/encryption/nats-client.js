import { __asyncValues, __awaiter } from "tslib";
import { connect, JSONCodec } from "nats";
import { initializeBindings } from "o1js";
import { CipherText } from "./encryption";
import config from "../config";
const { NATS_SERVER } = config;
export function listen(subject) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a JSON codec for encoding and decoding messages
        const codec = JSONCodec();
        const connection = yield connect({ servers: NATS_SERVER });
        // Subscribe to the subject
        const subscription = connection.subscribe(subject);
        console.log(`Subscribed to subject ${subject}`);
        // Process messages received on the subscribed subject
        (() => __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            // Error decoding message:  Error: Could not encrypt message={}
            // Error: Poseidon.Sponge(): bindings are not initialized, try calling `await initializeBindings()` first.
            // This shouldn't have happened and indicates an internal bug.
            yield initializeBindings();
            try {
                for (var _d = true, subscription_1 = __asyncValues(subscription), subscription_1_1; subscription_1_1 = yield subscription_1.next(), _a = subscription_1_1.done, !_a; _d = true) {
                    _c = subscription_1_1.value;
                    _d = false;
                    const msg = _c;
                    try {
                        const data = codec.decode(msg.data);
                        //console.log(`Received message on subject ${subject}:`, data);
                        // Perform processing logic here
                        const { post, params } = data;
                        // console.log(`Post: `, post, params);
                        switch (post) {
                            case "ready":
                                {
                                    // the workers announces it is ready
                                    // and we receive the worker's publicKey
                                    let workerKey = params.key || "";
                                    console.log("Received 'ready' message from worker");
                                    console.log("Worker publicKey: ", workerKey);
                                    // we will use its key to encrypt the message
                                    const encryptedPayload = CipherText.encrypt(JSON.stringify({
                                        value: Math.ceil(Math.random() * 100).toString(),
                                    }), workerKey);
                                    console.log("Encrypted payload: ", encryptedPayload);
                                    // we reply with the command we want the worker to execute
                                    // and with the encrypted payload
                                    msg.respond(codec.encode({
                                        success: true,
                                        data: {
                                            command: "execute",
                                            encrypted: encryptedPayload,
                                        },
                                        error: undefined,
                                    }));
                                }
                                break;
                            case "done":
                                {
                                    let result = params.result || "";
                                    console.log("Received 'done' message from worker");
                                    msg.respond(codec.encode({
                                        success: true,
                                        data: { status: "closed" },
                                        error: undefined,
                                    }));
                                    // we want to insure that messages that are in flight
                                    // get processed, so we are going to drain the
                                    // connection. Drain is the same as close, but makes
                                    // sure that all messages in flight get seen
                                    // by the iterator. After calling drain on the connection
                                    // the connection closes.
                                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                                        yield connection.drain();
                                    }), 1000);
                                }
                                break;
                        }
                    }
                    catch (err) {
                        console.error("Error decoding message: ", err);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = subscription_1.return)) yield _b.call(subscription_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }))();
    });
}
//# sourceMappingURL=nats-client.js.map