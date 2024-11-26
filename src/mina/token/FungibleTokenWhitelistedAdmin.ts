import {
  AccountUpdate,
  assert,
  Bool,
  DeployArgs,
  method,
  Permissions,
  Provable,
  PublicKey,
  SmartContract,
  State,
  state,
  UInt64,
  VerificationKey,
} from "o1js";
import { Whitelist } from "./whitelist.js";
import { FungibleTokenAdminBase } from "./FungibleTokenContract.js";

export interface FungibleTokenWhitelistedAdminDeployProps
  extends Exclude<DeployArgs, undefined> {
  adminPublicKey: PublicKey;
  whitelist: Whitelist;
}

/** A contract that grants permissions for administrative actions on a token.
 *
 * We separate this out into a dedicated contract. That way, when issuing a token, a user can
 * specify their own rules for administrative actions, without changing the token contract itself.
 *
 * The advantage is that third party applications that only use the token in a non-privileged way
 * can integrate against the unchanged token contract.
 */
export class FungibleTokenWhitelistedAdmin
  extends SmartContract
  implements FungibleTokenAdminBase
{
  @state(PublicKey) adminPublicKey = State<PublicKey>();
  @state(Whitelist) whitelist = State<Whitelist>();

  async deploy(props: FungibleTokenWhitelistedAdminDeployProps) {
    await super.deploy(props);
    this.adminPublicKey.set(props.adminPublicKey);
    this.whitelist.set(props.whitelist);
    this.account.permissions.set({
      ...Permissions.default(),
      setVerificationKey:
        Permissions.VerificationKey.impossibleDuringCurrentVersion(),
      setPermissions: Permissions.impossible(),
    });
  }

  events = { updateWhitelist: Whitelist };

  /** Update the verification key.
   * Note that because we have set the permissions for setting the verification key to `impossibleDuringCurrentVersion()`, this will only be possible in case of a protocol update that requires an update.
   */
  @method
  async updateVerificationKey(vk: VerificationKey) {
    this.account.verificationKey.set(vk);
  }

  private async ensureAdminSignature() {
    const admin = await Provable.witnessAsync(PublicKey, async () => {
      let pk = await this.adminPublicKey.fetch();
      assert(pk !== undefined, "could not fetch admin public key");
      return pk;
    });
    this.adminPublicKey.requireEquals(admin);
    return AccountUpdate.createSigned(admin);
  }

  @method.returns(Bool)
  public async canMint(_accountUpdate: AccountUpdate) {
    const address = _accountUpdate.body.publicKey;
    const balanceChange = _accountUpdate.body.balanceChange;
    balanceChange.isPositive().assertTrue();
    const whitelist = this.whitelist.getAndRequireEquals();
    const whitelistedAmount = await whitelist.getWhitelistedAmount(address);
    return balanceChange.magnitude.lessThanOrEqual(
      whitelistedAmount.orElse(UInt64.from(0)) // here can be a minimum amount allowed by travel rule instead of 0
    );
  }

  @method.returns(Bool)
  public async canChangeAdmin(_admin: PublicKey) {
    await this.ensureAdminSignature();
    return Bool(true);
  }

  @method.returns(Bool)
  public async canPause(): Promise<Bool> {
    await this.ensureAdminSignature();
    return Bool(true);
  }

  @method.returns(Bool)
  public async canResume(): Promise<Bool> {
    await this.ensureAdminSignature();
    return Bool(true);
  }

  @method async updateWhitelist(whitelist: Whitelist) {
    const admin = this.adminPublicKey.getAndRequireEquals();
    const sender = this.sender.getUnconstrained();
    const senderUpdate = AccountUpdate.createSigned(sender);
    senderUpdate.body.useFullCommitment = Bool(true);
    admin.assertEquals(sender);

    this.whitelist.set(whitelist);
    this.emitEvent("updateWhitelist", whitelist);
  }
}
