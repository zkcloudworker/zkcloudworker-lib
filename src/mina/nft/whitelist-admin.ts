import {
  AccountUpdate,
  Bool,
  DeployArgs,
  method,
  Permissions,
  Provable,
  PublicKey,
  SmartContract,
  State,
  state,
  VerificationKey,
  UInt64,
  Experimental,
  Field,
  Poseidon,
} from "o1js";
import { Whitelist, loadWhitelist } from "./whitelist";
import { MintParams, NFTState, NFTAdminBase, Storage } from "./types";

export interface NFTWhitelistedAdminDeployProps
  extends Exclude<DeployArgs, undefined> {
  admin: PublicKey;
  collection: PublicKey;
  whitelist: Field;
  storage: Storage;
}

export class NFTWhitelistedAdmin extends SmartContract implements NFTAdminBase {
  @state(PublicKey) collection = State<PublicKey>();
  @state(PublicKey) admin = State<PublicKey>();
  @state(Field) whitelist = State<Field>();
  @state(Storage) storage = State<Storage>();

  async deploy(props: NFTWhitelistedAdminDeployProps) {
    await super.deploy(props);
    this.collection.set(props.collection);
    this.admin.set(props.admin);
    this.whitelist.set(props.whitelist);
    this.storage.set(props.storage);
    this.account.zkappUri.set("zkcloudworker#NFTWhitelistedAdmin");
    this.account.permissions.set({
      ...Permissions.default(),
      setVerificationKey:
        Permissions.VerificationKey.impossibleDuringCurrentVersion(),
      setPermissions: Permissions.impossible(),
    });
  }

  async isWhitelisted(address: PublicKey, amount: UInt64) {
    const whitelist = this.whitelist.getAndRequireEquals();
    const storage = this.storage.getAndRequireEquals();
    const map = await Provable.witnessAsync(Whitelist, async () => {
      return await loadWhitelist(storage);
    });
    map.root.assertEquals(whitelist);
    const key = Poseidon.hash(address.toFields());
    map.assertIncluded(key, "Address not whitelisted");
    const value = map.get(key);
    value.assertLessThanOrEqual(Field(UInt64.MAXINT().value));
    const maxAmount = UInt64.Unsafe.fromField(value);
    return Bool(amount.lessThanOrEqual(maxAmount));
  }

  @method
  async updateVerificationKey(vk: VerificationKey) {
    const sender = this.sender.getAndRequireSignature();
    this.admin.getAndRequireEquals().assertEquals(sender);
    this.account.verificationKey.set(vk);
  }

  @method.returns(Bool)
  public async canMint(params: MintParams) {
    return await this.isWhitelisted(params.owner, UInt64.from(0));
  }

  @method.returns(Bool)
  public async canUpdate(input: NFTState, output: NFTState) {
    return await this.isWhitelisted(output.owner, UInt64.from(0));
  }

  @method.returns(Bool)
  public async canTransfer(address: PublicKey, from: PublicKey, to: PublicKey) {
    return await this.isWhitelisted(to, UInt64.from(0));
  }

  @method.returns(Bool)
  public async canSell(address: PublicKey, seller: PublicKey, price: UInt64) {
    return await this.isWhitelisted(address, price);
  }

  @method.returns(Bool)
  public async canBuy(
    address: PublicKey,
    seller: PublicKey,
    buyer: PublicKey,
    price: UInt64
  ) {
    return (await this.isWhitelisted(buyer, price)).and(
      await this.isWhitelisted(seller, price)
    );
  }

  @method
  async updateMerkleMapRoot(root: Field, storage: Storage) {
    const sender = this.sender.getAndRequireSignature();
    this.admin.getAndRequireEquals().assertEquals(sender);
    this.whitelist.set(root);
    this.storage.set(storage);
  }
}
