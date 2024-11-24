import { __decorate, __metadata } from "tslib";
import { AccountUpdate, AccountUpdateForest, assert, Bool, Int64, method, Permissions, Provable, PublicKey, State, state, Struct, TokenContract, Types, UInt64, UInt8, VerificationKey, } from "o1js";
import { FungibleTokenAdmin, } from "./FungibleTokenAdmin.js";
export const FungibleTokenErrors = {
    noAdminKey: "could not fetch admin contract key",
    noPermissionToChangeAdmin: "Not allowed to change admin contract",
    tokenPaused: "Token is currently paused",
    noPermissionToMint: "Not allowed to mint tokens",
    noPermissionToPause: "Not allowed to pause token",
    noPermissionToResume: "Not allowed to resume token",
    noTransferFromCirculation: "Can't transfer to/from the circulation account",
    noPermissionChangeAllowed: "Can't change permissions for access or receive on token accounts",
    flashMinting: "Flash-minting or unbalanced transaction detected. Please make sure that your transaction is balanced, and that your `AccountUpdate`s are ordered properly, so that tokens are not received before they are sent.",
    unbalancedTransaction: "Transaction is unbalanced",
};
export class FungibleToken extends TokenContract {
    constructor() {
        super(...arguments);
        this.decimals = State();
        this.admin = State();
        this.paused = State();
        this.events = {
            SetAdmin: SetAdminEvent,
            Pause: PauseEvent,
            Mint: MintEvent,
            Burn: BurnEvent,
            BalanceChange: BalanceChangeEvent,
        };
    }
    async deploy(props) {
        await super.deploy(props);
        this.paused.set(Bool(true));
        this.account.zkappUri.set(props.src);
        this.account.tokenSymbol.set(props.symbol);
        this.account.permissions.set({
            ...Permissions.default(),
            setVerificationKey: Permissions.VerificationKey.impossibleDuringCurrentVersion(),
            setPermissions: Permissions.impossible(),
            access: Permissions.proof(),
        });
    }
    /** Update the verification key.
     * Note that because we have set the permissions for setting the verification key to `impossibleDuringCurrentVersion()`, this will only be possible in case of a protocol update that requires an update.
     */
    async updateVerificationKey(vk) {
        this.account.verificationKey.set(vk);
    }
    /** Initializes the account for tracking total circulation.
     * @argument {PublicKey} admin - public key where the admin contract is deployed
     * @argument {UInt8} decimals - number of decimals for the token
     * @argument {Bool} startPaused - if set to `Bool(true), the contract will start in a mode where token minting and transfers are paused. This should be used for non-atomic deployments
     */
    async initialize(admin, decimals, startPaused) {
        this.account.provedState.requireEquals(Bool(false));
        this.admin.set(admin);
        this.decimals.set(decimals);
        this.paused.set(Bool(false));
        this.paused.set(startPaused);
        const accountUpdate = AccountUpdate.createSigned(this.address, this.deriveTokenId());
        let permissions = Permissions.default();
        // This is necessary in order to allow token holders to burn.
        permissions.send = Permissions.none();
        permissions.setPermissions = Permissions.impossible();
        accountUpdate.account.permissions.set(permissions);
    }
    async getAdminContract() {
        const admin = await Provable.witnessAsync(PublicKey, async () => {
            let pk = await this.admin.fetch();
            assert(pk !== undefined, FungibleTokenErrors.noAdminKey);
            return pk;
        });
        this.admin.requireEquals(admin);
        return new FungibleToken.AdminContract(admin);
    }
    async setAdmin(admin) {
        const adminContract = await this.getAdminContract();
        const canChangeAdmin = await adminContract.canChangeAdmin(admin);
        canChangeAdmin.assertTrue(FungibleTokenErrors.noPermissionToChangeAdmin);
        this.admin.set(admin);
        this.emitEvent("SetAdmin", new SetAdminEvent({ adminKey: admin }));
    }
    async mint(recipient, amount) {
        this.paused
            .getAndRequireEquals()
            .assertFalse(FungibleTokenErrors.tokenPaused);
        const accountUpdate = this.internal.mint({ address: recipient, amount });
        const adminContract = await this.getAdminContract();
        const canMint = await adminContract.canMint(accountUpdate);
        canMint.assertTrue(FungibleTokenErrors.noPermissionToMint);
        recipient
            .equals(this.address)
            .assertFalse(FungibleTokenErrors.noTransferFromCirculation);
        this.approve(accountUpdate);
        this.emitEvent("Mint", new MintEvent({ recipient, amount }));
        const circulationUpdate = AccountUpdate.create(this.address, this.deriveTokenId());
        circulationUpdate.balanceChange = Int64.fromUnsigned(amount);
        return accountUpdate;
    }
    async burn(from, amount) {
        this.paused
            .getAndRequireEquals()
            .assertFalse(FungibleTokenErrors.tokenPaused);
        const accountUpdate = this.internal.burn({ address: from, amount });
        const circulationUpdate = AccountUpdate.create(this.address, this.deriveTokenId());
        from
            .equals(this.address)
            .assertFalse(FungibleTokenErrors.noTransferFromCirculation);
        circulationUpdate.balanceChange = Int64.fromUnsigned(amount).neg();
        this.emitEvent("Burn", new BurnEvent({ from, amount }));
        return accountUpdate;
    }
    async pause() {
        const adminContract = await this.getAdminContract();
        const canPause = await adminContract.canPause();
        canPause.assertTrue(FungibleTokenErrors.noPermissionToPause);
        this.paused.set(Bool(true));
        this.emitEvent("Pause", new PauseEvent({ isPaused: Bool(true) }));
    }
    async resume() {
        const adminContract = await this.getAdminContract();
        const canResume = await adminContract.canResume();
        canResume.assertTrue(FungibleTokenErrors.noPermissionToResume);
        this.paused.set(Bool(false));
        this.emitEvent("Pause", new PauseEvent({ isPaused: Bool(false) }));
    }
    async transfer(from, to, amount) {
        this.paused
            .getAndRequireEquals()
            .assertFalse(FungibleTokenErrors.tokenPaused);
        from
            .equals(this.address)
            .assertFalse(FungibleTokenErrors.noTransferFromCirculation);
        to.equals(this.address).assertFalse(FungibleTokenErrors.noTransferFromCirculation);
        this.internal.send({ from, to, amount });
    }
    checkPermissionsUpdate(update) {
        let permissions = update.update.permissions;
        let { access, receive } = permissions.value;
        let accessIsNone = Provable.equal(Types.AuthRequired, access, Permissions.none());
        let receiveIsNone = Provable.equal(Types.AuthRequired, receive, Permissions.none());
        let updateAllowed = accessIsNone.and(receiveIsNone);
        assert(updateAllowed.or(permissions.isSome.not()), FungibleTokenErrors.noPermissionChangeAllowed);
    }
    /** Approve `AccountUpdate`s that have been created outside of the token contract.
     *
     * @argument {AccountUpdateForest} updates - The `AccountUpdate`s to approve. Note that the forest size is limited by the base token contract, @see TokenContractV2.MAX_ACCOUNT_UPDATES The current limit is 9.
     */
    async approveBase(updates) {
        this.paused
            .getAndRequireEquals()
            .assertFalse(FungibleTokenErrors.tokenPaused);
        let totalBalance = Int64.from(0);
        this.forEachUpdate(updates, (update, usesToken) => {
            // Make sure that the account permissions are not changed
            this.checkPermissionsUpdate(update);
            this.emitEventIf(usesToken, "BalanceChange", new BalanceChangeEvent({
                address: update.publicKey,
                amount: update.balanceChange,
            }));
            // Don't allow transfers to/from the account that's tracking circulation
            update.publicKey
                .equals(this.address)
                .and(usesToken)
                .assertFalse(FungibleTokenErrors.noTransferFromCirculation);
            totalBalance = Provable.if(usesToken, totalBalance.add(update.balanceChange), totalBalance);
            totalBalance.isPositive().assertFalse(FungibleTokenErrors.flashMinting);
        });
        totalBalance.assertEquals(Int64.zero, FungibleTokenErrors.unbalancedTransaction);
    }
    async getBalanceOf(address) {
        const account = AccountUpdate.create(address, this.deriveTokenId()).account;
        const balance = account.balance.get();
        account.balance.requireEquals(balance);
        return balance;
    }
    /** Reports the current circulating supply
     * This does take into account currently unreduced actions.
     */
    async getCirculating() {
        let circulating = await this.getBalanceOf(this.address);
        return circulating;
    }
    async getDecimals() {
        return this.decimals.getAndRequireEquals();
    }
}
// This defines the type of the contract that is used to control access to administrative actions.
// If you want to have a custom contract, overwrite this by setting FungibleToken.AdminContract to
// your own implementation of FungibleTokenAdminBase.
FungibleToken.AdminContract = FungibleTokenAdmin;
__decorate([
    state(UInt8),
    __metadata("design:type", Object)
], FungibleToken.prototype, "decimals", void 0);
__decorate([
    state(PublicKey),
    __metadata("design:type", Object)
], FungibleToken.prototype, "admin", void 0);
__decorate([
    state(Bool),
    __metadata("design:type", Object)
], FungibleToken.prototype, "paused", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerificationKey]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "updateVerificationKey", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey, UInt8, Bool]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "initialize", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "setAdmin", null);
__decorate([
    method.returns(AccountUpdate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey, UInt64]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "mint", null);
__decorate([
    method.returns(AccountUpdate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey, UInt64]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "burn", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "pause", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "resume", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey, PublicKey, UInt64]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "transfer", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AccountUpdateForest]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "approveBase", null);
__decorate([
    method.returns(UInt64),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "getBalanceOf", null);
__decorate([
    method.returns(UInt8),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "getDecimals", null);
export class SetAdminEvent extends Struct({
    adminKey: PublicKey,
}) {
}
export class PauseEvent extends Struct({
    isPaused: Bool,
}) {
}
export class MintEvent extends Struct({
    recipient: PublicKey,
    amount: UInt64,
}) {
}
export class BurnEvent extends Struct({
    from: PublicKey,
    amount: UInt64,
}) {
}
export class BalanceChangeEvent extends Struct({
    address: PublicKey,
    amount: Int64,
}) {
}
//# sourceMappingURL=FungibleToken.js.map