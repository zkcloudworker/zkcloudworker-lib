import { connect, JSONCodec } from "nats";
import config from "../config";

const { NATS_SERVER } = config;

const codec = JSONCodec();

export async function postReadyMessage(
  clientAddress: string,
  workerAddress: string
): Promise<any> {
  // connect to the NATS server and send a 'ready' request
  const nc = await connect({ servers: NATS_SERVER });
  const msg: any = await nc.request(
    `zkcw:${clientAddress}`,
    codec.encode({
      post: "ready",
      params: { key: workerAddress },
    })
  );
  const response: any = codec.decode(msg.data);
  console.log("Response: ", response);

  // disconnect and clean all pending
  await nc.drain();

  return response;
}

export async function postDoneMessage(
  clientAddress: string,
  encrypted: string
): Promise<any> {
  // connect to the NATS server and send a 'ready' request
  const nc = await connect({ servers: NATS_SERVER });
  const msg: any = await nc.request(
    `zkcw:${clientAddress}`,
    codec.encode({
      post: "done",
      params: { result: encrypted },
    })
  );
  const response: any = codec.decode(msg.data);
  console.log("Response: ", response);

  // disconnect and clean all pending
  await nc.drain();

  return response;
}
