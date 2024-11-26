import {
  AccountUpdate,
  DeployArgs,
  method,
  Permissions,
  PublicKey,
  State,
  state,
  UInt64,
  SmartContract,
  Bool,
  Field,
  assert,
  Mina,
  Struct,
} from "o1js";
import { Whitelist } from "./whitelist.js";
import { FungibleToken, tokenVerificationKeys } from "./token.js";

export interface FungibleTokenBidContractDeployProps
  extends Exclude<DeployArgs, undefined> {
  /** The whitelist. */
  whitelist: Whitelist;
}
export class FungibleTokenBidContract extends SmartContract {
  @state(UInt64) price = State<UInt64>();
  @state(PublicKey) buyer = State<PublicKey>();
  @state(PublicKey) token = State<PublicKey>();
  @state(Whitelist) whitelist = State<Whitelist>();

  async deploy(args: FungibleTokenBidContractDeployProps) {
    await super.deploy(args);
    const verificationKey =
      args?.verificationKey ?? FungibleTokenBidContract._verificationKey;
    assert(verificationKey !== undefined);
    const hash =
      typeof verificationKey.hash === "string"
        ? verificationKey.hash
        : verificationKey.hash.toJSON();
    const networkId = Mina.getNetworkId();
    assert(networkId === "mainnet" || networkId === "testnet");
    assert(
      hash === tokenVerificationKeys[networkId].vk.FungibleTokenBidContract.hash
    );
    assert(
      verificationKey.data ===
        tokenVerificationKeys[networkId].vk.FungibleTokenBidContract.data
    );
    this.whitelist.set(args.whitelist);
    this.account.permissions.set({
      ...Permissions.default(),
      send: Permissions.proof(),
      setVerificationKey:
        Permissions.VerificationKey.impossibleDuringCurrentVersion(),
      setPermissions: Permissions.impossible(),
    });
  }

  events = {
    bid: UInt64,
    withdraw: UInt64,
    sell: UInt64,
    updateWhitelist: Whitelist,
  };

  @method async initialize(token: PublicKey, amount: UInt64, price: UInt64) {
    this.account.provedState.requireEquals(Bool(false));
    amount.equals(UInt64.from(0)).assertFalse();

    const totalPriceField = price.value
      .mul(amount.value)
      .div(Field(1_000_000_000));
    totalPriceField.assertLessThan(
      UInt64.MAXINT().value,
      "totalPrice overflow"
    );
    const totalPrice = UInt64.Unsafe.fromField(totalPriceField);

    const buyer = this.sender.getUnconstrained();
    const buyerUpdate = AccountUpdate.createSigned(buyer);
    buyerUpdate.send({ to: this.address, amount: totalPrice });
    buyerUpdate.body.useFullCommitment = Bool(true);

    this.buyer.set(buyer);
    this.price.set(price);
    this.token.set(token);
    this.emitEvent("bid", amount);
  }

  @method async bid(amount: UInt64, price: UInt64) {
    amount.equals(UInt64.from(0)).assertFalse();

    const balance = this.account.balance.getAndRequireEquals();
    const oldPrice = this.price.getAndRequireEquals();
    // Price can be changed only when the balance is 0
    price
      .equals(oldPrice)
      .or(balance.equals(UInt64.from(0)))
      .assertTrue();
    this.price.set(price);

    const totalPriceField = price.value
      .mul(amount.value)
      .div(Field(1_000_000_000));
    totalPriceField.assertLessThan(
      UInt64.MAXINT().value,
      "totalPrice overflow"
    );
    const totalPrice = UInt64.Unsafe.fromField(totalPriceField);

    const sender = this.sender.getUnconstrained();
    const buyer = this.buyer.getAndRequireEquals();
    sender.assertEquals(buyer);
    const buyerUpdate = AccountUpdate.createSigned(buyer);
    buyerUpdate.send({ to: this.address, amount: totalPrice });
    buyerUpdate.body.useFullCommitment = Bool(true);

    this.price.set(price);
    this.emitEvent("bid", amount);
  }

  @method async withdraw(amountInMina: UInt64) {
    amountInMina.equals(UInt64.from(0)).assertFalse();
    this.account.balance.requireBetween(amountInMina, UInt64.MAXINT());

    const buyer = this.buyer.getAndRequireEquals();
    const sender = this.sender.getUnconstrained();
    const senderUpdate = AccountUpdate.createSigned(sender);
    senderUpdate.body.useFullCommitment = Bool(true);
    sender.assertEquals(buyer);

    let bidUpdate = this.send({ to: senderUpdate, amount: amountInMina });
    bidUpdate.body.useFullCommitment = Bool(true);
    this.emitEvent("withdraw", amountInMina);
  }

  @method async sell(amount: UInt64) {
    amount.equals(UInt64.from(0)).assertFalse();
    const price = this.price.getAndRequireEquals();
    const totalPriceField = price.value
      .mul(amount.value)
      .div(Field(1_000_000_000));
    totalPriceField.assertLessThan(
      UInt64.MAXINT().value,
      "totalPrice overflow"
    );
    const totalPrice = UInt64.Unsafe.fromField(totalPriceField);

    this.account.balance.requireBetween(totalPrice, UInt64.MAXINT());
    const buyer = this.buyer.getAndRequireEquals();
    const token = this.token.getAndRequireEquals();

    const seller = this.sender.getUnconstrained();
    const sellerUpdate = this.send({ to: seller, amount: totalPrice });
    sellerUpdate.body.useFullCommitment = Bool(true);
    sellerUpdate.requireSignature();

    const tokenContract = new FungibleToken(token);
    await tokenContract.transfer(seller, buyer, amount);
    this.emitEvent("sell", amount);
  }

  @method async updateWhitelist(whitelist: Whitelist) {
    const buyer = this.buyer.getAndRequireEquals();
    const sender = this.sender.getUnconstrained();
    const senderUpdate = AccountUpdate.createSigned(sender);
    senderUpdate.body.useFullCommitment = Bool(true);
    sender.assertEquals(buyer);

    this.whitelist.set(whitelist);
    this.emitEvent("updateWhitelist", whitelist);
  }
}
