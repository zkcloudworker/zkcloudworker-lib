export function createIpfsURL(params: {
  hash: string;
  gateway?: string;
  apiToken?: string;
}): string {
  let { hash, gateway, apiToken } = params;
  if (!gateway) {
    gateway = "https://gateway.pinata.cloud/ipfs/";
  }
  return gateway + hash + (apiToken ? "?pinataGatewayToken=" + apiToken : "");
}
