export { initBlockchain, accountBalance, accountBalanceMina, MinaNetworkInstance, currentNetwork, getNetworkIdHash, getCurrentNetwork, getDeployer, };
import { Mina, PublicKey, UInt64, Field } from "o1js";
import { blockchain, MinaNetwork } from "../networks";
interface MinaNetworkInstance {
    keys: Mina.TestPublicKey[];
    network: MinaNetwork;
    networkIdHash: Field;
}
declare let currentNetwork: MinaNetworkInstance | undefined;
declare function getNetworkIdHash(): Field;
declare function getCurrentNetwork(): MinaNetworkInstance;
declare function getDeployer(): Mina.TestPublicKey | undefined;
declare function initBlockchain(instance: blockchain, deployersNumber?: number): Promise<MinaNetworkInstance>;
declare function accountBalance(address: PublicKey): Promise<UInt64>;
declare function accountBalanceMina(address: PublicKey): Promise<number>;
