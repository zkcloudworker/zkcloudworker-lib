import { BlockBerryChain } from "./chain";
import { getZkAppTxFromBlockBerry } from "./blockberry";
const TIMEOUT = 1000 * 60 * 21;

export async function txStatus(params: {
  hash: string;
  time: number;
  chain: BlockBerryChain;
  blockBerryApiKey: string;
  timeout?: number;
}): Promise<string> {
  const { hash, chain, time, blockBerryApiKey } = params;

  const tx = await getZkAppTxFromBlockBerry({ hash, chain, blockBerryApiKey });
  if (tx?.txStatus) return tx?.txStatus;
  if (Date.now() - time > (params.timeout ?? TIMEOUT)) {
    console.error(
      "txStatus: Timeout while checking tx with blockberry",
      chain,
      hash
    );
    return "replaced";
  } else {
    return "pending";
  }
}
