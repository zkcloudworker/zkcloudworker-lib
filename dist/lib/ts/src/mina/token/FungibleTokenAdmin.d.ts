import { AccountUpdate, Bool, DeployArgs, PublicKey, SmartContract, VerificationKey } from "o1js";
export type FungibleTokenAdminBase = SmartContract & {
    canMint(accountUpdate: AccountUpdate): Promise<Bool>;
    canChangeAdmin(admin: PublicKey): Promise<Bool>;
    canPause(): Promise<Bool>;
    canResume(): Promise<Bool>;
};
export interface FungibleTokenAdminDeployProps extends Exclude<DeployArgs, undefined> {
    adminPublicKey: PublicKey;
}
/** A contract that grants permissions for administrative actions on a token.
 *
 * We separate this out into a dedicated contract. That way, when issuing a token, a user can
 * specify their own rules for administrative actions, without changing the token contract itself.
 *
 * The advantage is that third party applications that only use the token in a non-privileged way
 * can integrate against the unchanged token contract.
 */
export declare class FungibleTokenAdmin extends SmartContract implements FungibleTokenAdminBase {
    private adminPublicKey;
    deploy(props: FungibleTokenAdminDeployProps): Promise<void>;
    /** Update the verification key.
     * Note that because we have set the permissions for setting the verification key to `impossibleDuringCurrentVersion()`, this will only be possible in case of a protocol update that requires an update.
     */
    updateVerificationKey(vk: VerificationKey): Promise<void>;
    private ensureAdminSignature;
    canMint(_accountUpdate: AccountUpdate): Promise<import("o1js/dist/node/lib/provable/bool").Bool>;
    canChangeAdmin(_admin: PublicKey): Promise<import("o1js/dist/node/lib/provable/bool").Bool>;
    canPause(): Promise<Bool>;
    canResume(): Promise<Bool>;
}
