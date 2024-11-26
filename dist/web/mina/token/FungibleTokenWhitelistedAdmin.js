import { __decorate, __metadata } from "tslib";
import { AccountUpdate, assert, Bool, method, Permissions, Provable, PublicKey, SmartContract, State, state, UInt64, VerificationKey, } from "o1js";
import { Whitelist } from "./whitelist.js";
/** A contract that grants permissions for administrative actions on a token.
 *
 * We separate this out into a dedicated contract. That way, when issuing a token, a user can
 * specify their own rules for administrative actions, without changing the token contract itself.
 *
 * The advantage is that third party applications that only use the token in a non-privileged way
 * can integrate against the unchanged token contract.
 */
export class FungibleTokenWhitelistedAdmin extends SmartContract {
    constructor() {
        super(...arguments);
        this.adminPublicKey = State();
        this.whitelist = State();
        this.events = { updateWhitelist: Whitelist };
    }
    async deploy(props) {
        await super.deploy(props);
        this.adminPublicKey.set(props.adminPublicKey);
        this.whitelist.set(props.whitelist);
        this.account.permissions.set({
            ...Permissions.default(),
            setVerificationKey: Permissions.VerificationKey.impossibleDuringCurrentVersion(),
            setPermissions: Permissions.impossible(),
        });
    }
    /** Update the verification key.
     * Note that because we have set the permissions for setting the verification key to `impossibleDuringCurrentVersion()`, this will only be possible in case of a protocol update that requires an update.
     */
    async updateVerificationKey(vk) {
        this.account.verificationKey.set(vk);
    }
    async ensureAdminSignature() {
        const admin = await Provable.witnessAsync(PublicKey, async () => {
            let pk = await this.adminPublicKey.fetch();
            assert(pk !== undefined, "could not fetch admin public key");
            return pk;
        });
        this.adminPublicKey.requireEquals(admin);
        return AccountUpdate.createSigned(admin);
    }
    async canMint(_accountUpdate) {
        const address = _accountUpdate.body.publicKey;
        const balanceChange = _accountUpdate.body.balanceChange;
        balanceChange.isPositive().assertTrue();
        const whitelist = this.whitelist.getAndRequireEquals();
        const whitelistedAmount = await whitelist.getWhitelistedAmount(address);
        return balanceChange.magnitude.lessThanOrEqual(whitelistedAmount.orElse(UInt64.from(0)) // here can be a minimum amount allowed by travel rule instead of 0
        );
    }
    async canChangeAdmin(_admin) {
        await this.ensureAdminSignature();
        return Bool(true);
    }
    async canPause() {
        await this.ensureAdminSignature();
        return Bool(true);
    }
    async canResume() {
        await this.ensureAdminSignature();
        return Bool(true);
    }
    async updateWhitelist(whitelist) {
        const admin = this.adminPublicKey.getAndRequireEquals();
        const sender = this.sender.getUnconstrained();
        const senderUpdate = AccountUpdate.createSigned(sender);
        senderUpdate.body.useFullCommitment = Bool(true);
        admin.assertEquals(sender);
        this.whitelist.set(whitelist);
        this.emitEvent("updateWhitelist", whitelist);
    }
}
__decorate([
    state(PublicKey),
    __metadata("design:type", Object)
], FungibleTokenWhitelistedAdmin.prototype, "adminPublicKey", void 0);
__decorate([
    state(Whitelist),
    __metadata("design:type", Object)
], FungibleTokenWhitelistedAdmin.prototype, "whitelist", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerificationKey]),
    __metadata("design:returntype", Promise)
], FungibleTokenWhitelistedAdmin.prototype, "updateVerificationKey", null);
__decorate([
    method.returns(Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AccountUpdate]),
    __metadata("design:returntype", Promise)
], FungibleTokenWhitelistedAdmin.prototype, "canMint", null);
__decorate([
    method.returns(Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey]),
    __metadata("design:returntype", Promise)
], FungibleTokenWhitelistedAdmin.prototype, "canChangeAdmin", null);
__decorate([
    method.returns(Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FungibleTokenWhitelistedAdmin.prototype, "canPause", null);
__decorate([
    method.returns(Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FungibleTokenWhitelistedAdmin.prototype, "canResume", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Whitelist]),
    __metadata("design:returntype", Promise)
], FungibleTokenWhitelistedAdmin.prototype, "updateWhitelist", null);
//# sourceMappingURL=FungibleTokenWhitelistedAdmin.js.map