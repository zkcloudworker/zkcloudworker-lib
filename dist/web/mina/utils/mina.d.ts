export { initBlockchain, accountBalance, accountBalanceMina, MinaNetworkInstance, currentNetwork, getNetworkIdHash, getCurrentNetwork, getDeployer, };
import { Mina, PublicKey, UInt64, Field } from "o1js";
import { blockchain, MinaNetwork } from "../../cloud/networks.js";
/**
 * MinaNetworkInstance is the data structure for a Mina network instance, keeping track of the keys, network, and network ID hash.
 */
interface MinaNetworkInstance {
    /** The keys for the deployers */
    keys: Mina.TestPublicKey[];
    /** The network */
    network: MinaNetwork;
    /** The network ID hash */
    networkIdHash: Field;
}
declare let currentNetwork: MinaNetworkInstance | undefined;
declare function getNetworkIdHash(): Field;
declare function getCurrentNetwork(): MinaNetworkInstance;
declare function getDeployer(): Mina.TestPublicKey | undefined;
/**
 * Initializes the Mina blockchain network
 * Due to the limitations of the Mina SDK, only one network can be initialized at a time
 * This function should be called before any other Mina functions
 * @param instance the blockchain instance to initialize
 * @param deployersNumber the number of deployers to use for the network (only for local and lightnet networks)
 * @returns the Mina network instance
 */
declare function initBlockchain(instance: blockchain, deployersNumber?: number, proofsEnabled?: boolean): Promise<MinaNetworkInstance>;
/**
 * Fetches the account balance for a given public key
 * @param address the public key
 * @returns the account balance
 */
declare function accountBalance(address: PublicKey): Promise<UInt64>;
/**
 * Fetches the account balance for a given public key and returns it in Mina
 * @param address the public key
 * @returns the account balance in MINA
 */
declare function accountBalanceMina(address: PublicKey): Promise<number>;
