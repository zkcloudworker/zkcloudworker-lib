import { DeployArgs, PublicKey, State, UInt64, SmartContract } from "o1js";
import { Whitelist } from "./whitelist.js";
export interface FungibleTokenBidContractDeployProps extends Exclude<DeployArgs, undefined> {
    /** The whitelist. */
    whitelist: Whitelist;
}
export declare class FungibleTokenBidContract extends SmartContract {
    price: State<UInt64>;
    buyer: State<PublicKey>;
    token: State<PublicKey>;
    whitelist: State<Whitelist>;
    deploy(args: FungibleTokenBidContractDeployProps): Promise<void>;
    events: {
        bid: typeof UInt64;
        withdraw: typeof UInt64;
        sell: typeof UInt64;
        updateWhitelist: typeof Whitelist;
    };
    initialize(token: PublicKey, amount: UInt64, price: UInt64): Promise<void>;
    bid(amount: UInt64, price: UInt64): Promise<void>;
    withdraw(amountInMina: UInt64): Promise<void>;
    sell(amount: UInt64): Promise<void>;
    updateWhitelist(whitelist: Whitelist): Promise<void>;
}
