import { DeployArgs, PublicKey, State, UInt64, SmartContract } from "o1js";
import { Whitelist } from "./whitelist.js";
export interface FungibleTokenOfferContractDeployProps extends Exclude<DeployArgs, undefined> {
    /** The whitelist. */
    whitelist: Whitelist;
}
export declare class FungibleTokenOfferContract extends SmartContract {
    price: State<UInt64>;
    seller: State<PublicKey>;
    token: State<PublicKey>;
    whitelist: State<Whitelist>;
    deploy(args: FungibleTokenOfferContractDeployProps): Promise<void>;
    events: {
        offer: typeof UInt64;
        withdraw: typeof UInt64;
        buy: typeof UInt64;
        updateWhitelist: typeof Whitelist;
    };
    initialize(seller: PublicKey, // we are short of AccountUpdates here, so we use this parameter instead of this.sender.getUnconstrained()
    token: PublicKey, amount: UInt64, price: UInt64): Promise<void>;
    offer(amount: UInt64, price: UInt64): Promise<void>;
    withdraw(amount: UInt64): Promise<void>;
    buy(amount: UInt64): Promise<void>;
    updateWhitelist(whitelist: Whitelist): Promise<void>;
}
