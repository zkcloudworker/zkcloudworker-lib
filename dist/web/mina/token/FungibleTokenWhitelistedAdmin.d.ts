import { AccountUpdate, Bool, DeployArgs, PublicKey, SmartContract, State, VerificationKey } from "o1js";
import { Whitelist } from "./whitelist.js";
import { FungibleTokenAdminBase } from "./FungibleTokenContract.js";
export interface FungibleTokenWhitelistedAdminDeployProps extends Exclude<DeployArgs, undefined> {
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
export declare class FungibleTokenWhitelistedAdmin extends SmartContract implements FungibleTokenAdminBase {
    adminPublicKey: State<PublicKey>;
    whitelist: State<Whitelist>;
    deploy(props: FungibleTokenWhitelistedAdminDeployProps): Promise<void>;
    events: {
        updateWhitelist: typeof Whitelist;
    };
    /** Update the verification key.
     * Note that because we have set the permissions for setting the verification key to `impossibleDuringCurrentVersion()`, this will only be possible in case of a protocol update that requires an update.
     */
    updateVerificationKey(vk: VerificationKey): Promise<void>;
    private ensureAdminSignature;
    canMint(_accountUpdate: AccountUpdate): Promise<import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool>;
    canChangeAdmin(_admin: PublicKey): Promise<import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool>;
    canPause(): Promise<Bool>;
    canResume(): Promise<Bool>;
    updateWhitelist(whitelist: Whitelist): Promise<void>;
}
