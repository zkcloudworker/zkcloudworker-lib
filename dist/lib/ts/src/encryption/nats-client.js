"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = void 0;
const nats_1 = require("nats");
const o1js_1 = require("o1js");
const encryption_1 = require("./encryption");
const config_1 = __importDefault(require("../config"));
const { NATS_SERVER } = config_1.default;
async function listen(subject) {
    // Create a JSON codec for encoding and decoding messages
    const codec = (0, nats_1.JSONCodec)();
    const connection = await (0, nats_1.connect)({ servers: NATS_SERVER });
    // Subscribe to the subject
    const subscription = connection.subscribe(subject);
    console.log(`Subscribed to subject ${subject}`);
    // Process messages received on the subscribed subject
    (async () => {
        // Error decoding message:  Error: Could not encrypt message={}
        // Error: Poseidon.Sponge(): bindings are not initialized, try calling `await initializeBindings()` first.
        // This shouldn't have happened and indicates an internal bug.
        await (0, o1js_1.initializeBindings)();
        for await (const msg of subscription) {
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
                            const encryptedPayload = encryption_1.CipherText.encrypt(JSON.stringify({
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
                            setTimeout(async () => {
                                await connection.drain();
                            }, 1000);
                        }
                        break;
                }
            }
            catch (err) {
                console.error("Error decoding message: ", err);
            }
        }
    })();
}
exports.listen = listen;
