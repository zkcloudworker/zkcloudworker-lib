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
  assert,
  Field,
  Mina,
} from "o1js";
import { Whitelist } from "./whitelist.js";
import { FungibleToken, tokenVerificationKeys } from "./token.js";

export interface FungibleTokenOfferContractDeployProps
  extends Exclude<DeployArgs, undefined> {
  /** The whitelist. */
  whitelist: Whitelist;
}
export class FungibleTokenOfferContract extends SmartContract {
  @state(UInt64) price = State<UInt64>();
  @state(PublicKey) seller = State<PublicKey>();
  @state(PublicKey) token = State<PublicKey>();
  @state(Whitelist) whitelist = State<Whitelist>();

  async deploy(args: FungibleTokenOfferContractDeployProps) {
    await super.deploy(args);
    const verificationKey =
      args?.verificationKey ?? FungibleTokenOfferContract._verificationKey;
    assert(verificationKey !== undefined);
    const hash =
      typeof verificationKey.hash === "string"
        ? verificationKey.hash
        : verificationKey.hash.toJSON();
    const networkId = Mina.getNetworkId();
    assert(networkId === "mainnet" || networkId === "testnet");
    assert(
      hash ===
        tokenVerificationKeys[networkId].vk.FungibleTokenOfferContract.hash
    );
    assert(
      verificationKey.data ===
        tokenVerificationKeys[networkId].vk.FungibleTokenOfferContract.data
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
    offer: UInt64,
    withdraw: UInt64,
    buy: UInt64,
    updateWhitelist: Whitelist,
  };

  @method async initialize(
    seller: PublicKey, // we are short of AccountUpdates here, so we use this parameter instead of this.sender.getUnconstrained()
    token: PublicKey,
    amount: UInt64,
    price: UInt64
  ) {
    this.account.provedState.requireEquals(Bool(false));
    const tokenContract = new FungibleToken(token);
    const tokenId = tokenContract.deriveTokenId();
    tokenId.assertEquals(this.tokenId);
    await tokenContract.transfer(seller, this.address, amount);

    this.seller.set(seller);
    this.price.set(price);
    this.token.set(token);
    this.emitEvent("offer", amount);
  }

  @method async offer(amount: UInt64, price: UInt64) {
    const seller = this.seller.getAndRequireEquals();
    const token = this.token.getAndRequireEquals();
    const tokenContract = new FungibleToken(token);
    const tokenId = tokenContract.deriveTokenId();
    tokenId.assertEquals(this.tokenId);

    const balance = this.account.balance.getAndRequireEquals();
    const oldPrice = this.price.getAndRequireEquals();
    // Price can be changed only when the balance is 0
    price
      .equals(oldPrice)
      .or(balance.equals(UInt64.from(0)))
      .assertTrue();
    this.price.set(price);

    const sender = this.sender.getUnconstrained();
    const senderUpdate = AccountUpdate.createSigned(sender);
    senderUpdate.body.useFullCommitment = Bool(true);
    sender.assertEquals(seller);

    await tokenContract.transfer(sender, this.address, amount);
    this.emitEvent("offer", amount);
  }

  @method async withdraw(amount: UInt64) {
    amount.equals(UInt64.from(0)).assertFalse();
    this.account.balance.requireBetween(amount, UInt64.MAXINT());

    const seller = this.seller.getAndRequireEquals();
    const token = this.token.getAndRequireEquals();
    const tokenContract = new FungibleToken(token);
    const tokenId = tokenContract.deriveTokenId();
    tokenId.assertEquals(this.tokenId);

    const sender = this.sender.getUnconstrained();
    const senderUpdate = AccountUpdate.createSigned(sender, tokenId);
    senderUpdate.body.useFullCommitment = Bool(true);
    sender.assertEquals(seller);

    let offerUpdate = this.send({ to: senderUpdate, amount });
    offerUpdate.body.mayUseToken = AccountUpdate.MayUseToken.InheritFromParent;
    offerUpdate.body.useFullCommitment = Bool(true);
    this.emitEvent("withdraw", amount);
  }

  @method async buy(amount: UInt64) {
    amount.equals(UInt64.from(0)).assertFalse();
    this.account.balance.requireBetween(amount, UInt64.MAXINT());
    const seller = this.seller.getAndRequireEquals();
    const token = this.token.getAndRequireEquals();
    const tokenContract = new FungibleToken(token);
    const tokenId = tokenContract.deriveTokenId();
    tokenId.assertEquals(this.tokenId);
    const price = this.price.getAndRequireEquals();
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
    buyerUpdate.send({ to: seller, amount: totalPrice });
    buyerUpdate.body.useFullCommitment = Bool(true);

    let offerUpdate = this.send({ to: buyer, amount });
    offerUpdate.body.mayUseToken = AccountUpdate.MayUseToken.InheritFromParent;
    offerUpdate.body.useFullCommitment = Bool(true);

    const whitelist = this.whitelist.getAndRequireEquals();
    const whitelistedAmount = await whitelist.getWhitelistedAmount(buyer);
    amount.assertLessThanOrEqual(whitelistedAmount.assertSome());

    this.emitEvent("buy", amount);
  }

  @method async updateWhitelist(whitelist: Whitelist) {
    const seller = this.seller.getAndRequireEquals();
    const sender = this.sender.getUnconstrained();
    const senderUpdate = AccountUpdate.createSigned(sender);
    senderUpdate.body.useFullCommitment = Bool(true);
    sender.assertEquals(seller);

    this.whitelist.set(whitelist);
    this.emitEvent("updateWhitelist", whitelist);
  }
}
