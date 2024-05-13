import { PrivateKey } from "o1js";
import { connect, JSONCodec } from "nats";
import { initializeBindings } from "o1js";
import { CipherText } from "./encryption";
import { NATS_SERVER } from "./connections";
export async function NATSClient(callme) {
    // create some client address, this will be done by
    // the web API BEFORE calling a worker
    const secret = PrivateKey.random();
    let address = secret.toPublicKey().toBase58();
    console.log("Client address ", address);
    // now subscribe and listen in this Address
    // we use the 'zkcw' prefix for zkCloudWorkers subscriptions
    await listen(`zkcw:${address}`, callme);
    return {
        address: address,
        secret: secret.toBase58(),
        callme: callme,
    };
}
export async function listen(subject, callme) {
    // Create a JSON codec for encoding and decoding messages
    const codec = JSONCodec();
    const connection = await connect({ servers: NATS_SERVER });
    // Subscribe to the subject
    const subscription = connection.subscribe(subject);
    console.log(`Subscribed to subject ${subject}`);
    // Process messages received on the subscribed subject
    (async () => {
        // Error decoding message:  Error: Could not encrypt message={}
        // Error: Poseidon.Sponge(): bindings are not initialized, try calling `await initializeBindings()` first.
        // This shouldn't have happened and indicates an internal bug.
        await initializeBindings();
        for await (const msg of subscription) {
            try {
                const data = codec.decode(msg.data);
                //console.log(`Received message on subject ${subject}:`, data);
                // Perform processing logic here
                const { post, params } = data;
                // console.log(`Post: `, post, params);
                switch (post) {
                    case "options":
                        {
                            // the workers announces it is ready
                            // and we receive the worker's publicKey
                            let workerKey = params.key || "";
                            console.log("\nReceived 'options' message from worker");
                            console.log("Worker publicKey: ", workerKey);
                            let options = callme.onOptions(params);
                            console.log("options:", options);
                            // we will use its key to encrypt the message
                            const encryptedOptions = CipherText.encrypt(JSON.stringify(options), workerKey);
                            console.log("Encrypted options: ", encryptedOptions);
                            // we reply with the command we want the worker to execute
                            // and with the encrypted payload
                            msg.respond(codec.encode({
                                success: true,
                                data: {
                                    command: "options",
                                    encrypted: encryptedOptions,
                                },
                                error: undefined,
                            }));
                        }
                        break;
                    case "ready":
                        {
                            // the workers announces it is ready
                            // and we receive the worker's publicKey
                            let workerKey = params.key || "";
                            console.log("\nReceived 'ready' message from worker");
                            console.log("Worker publicKey: ", workerKey);
                            let payload = callme.onReady(params);
                            console.log("payload:", payload);
                            // we will use its key to encrypt the message
                            const encryptedPayload = CipherText.encrypt(JSON.stringify(payload), workerKey);
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
                            console.log("\nReceived 'done' message from worker");
                            let done = callme.onDone(params);
                            console.log("done: ", done);
                            msg.respond(codec.encode({
                                success: true,
                                data: {
                                    command: "close",
                                    status: JSON.stringify(done),
                                },
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
/*
async function main(args: string[]) {
  const nc = await connect({ servers: NATS_SERVER });

  // create some client address, this will be done by
  // the web API when calling a worker
  const clientSecret = PrivateKey.random();
  let clientAddress = clientSecret.toPublicKey().toBase58();
  console.log("Client address ", clientAddress);
  
  clientAddress = "B62qrYPDY555koJFAdNaUyw21WCNUgie9bmsBs2gCh6DSdhQmuN4qu6";
  
  // now subscribe and listen in this Address
  listen(nc, `zkcw:${clientAddress}`);

  // we want to insure that messages that are in flight
  // get processed, so we are going to drain the
  // connection. Drain is the same as close, but makes
  // sure that all messages in flight get seen
  // by the iterator. After calling drain on the connection
  // the connection closes.
  //await nc.drain();
}

main(process.argv.slice(2)).catch((error) => {
  console.error(error);
});
*/
//# sourceMappingURL=client.js.map