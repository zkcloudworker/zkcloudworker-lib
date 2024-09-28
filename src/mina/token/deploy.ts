export interface FungibleTokenDeployParams {
  tokenPublicKey: string;
  adminContractPublicKey: string;
  adminPublicKey: string;
  chain: string;
  symbol: string;
  uri: string;
  serializedTransaction: string;
  signedData: string;
}
