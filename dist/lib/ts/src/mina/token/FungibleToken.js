"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceChangeEvent = exports.BurnEvent = exports.MintEvent = exports.PauseEvent = exports.SetAdminEvent = exports.FungibleToken = exports.FungibleTokenErrors = void 0;
const o1js_1 = require("o1js");
const FungibleTokenAdmin_js_1 = require("./FungibleTokenAdmin.js");
exports.FungibleTokenErrors = {
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
class FungibleToken extends o1js_1.TokenContractV2 {
    constructor() {
        super(...arguments);
        this.decimals = (0, o1js_1.State)();
        this.admin = (0, o1js_1.State)();
        this.paused = (0, o1js_1.State)();
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
        this.paused.set((0, o1js_1.Bool)(true));
        this.account.zkappUri.set(props.src);
        this.account.tokenSymbol.set(props.symbol);
        this.account.permissions.set({
            ...o1js_1.Permissions.default(),
            setVerificationKey: o1js_1.Permissions.VerificationKey.impossibleDuringCurrentVersion(),
            setPermissions: o1js_1.Permissions.impossible(),
            access: o1js_1.Permissions.proof(),
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
        this.account.provedState.requireEquals((0, o1js_1.Bool)(false));
        this.admin.set(admin);
        this.decimals.set(decimals);
        this.paused.set((0, o1js_1.Bool)(false));
        this.paused.set(startPaused);
        const accountUpdate = o1js_1.AccountUpdate.createSigned(this.address, this.deriveTokenId());
        let permissions = o1js_1.Permissions.default();
        // This is necessary in order to allow token holders to burn.
        permissions.send = o1js_1.Permissions.none();
        permissions.setPermissions = o1js_1.Permissions.impossible();
        accountUpdate.account.permissions.set(permissions);
    }
    async getAdminContract() {
        const admin = await o1js_1.Provable.witnessAsync(o1js_1.PublicKey, async () => {
            let pk = await this.admin.fetch();
            (0, o1js_1.assert)(pk !== undefined, exports.FungibleTokenErrors.noAdminKey);
            return pk;
        });
        this.admin.requireEquals(admin);
        return (new FungibleToken.AdminContract(admin));
    }
    async setAdmin(admin) {
        const adminContract = await this.getAdminContract();
        const canChangeAdmin = await adminContract.canChangeAdmin(admin);
        canChangeAdmin.assertTrue(exports.FungibleTokenErrors.noPermissionToChangeAdmin);
        this.admin.set(admin);
        this.emitEvent("SetAdmin", new SetAdminEvent({ adminKey: admin }));
    }
    async mint(recipient, amount) {
        this.paused.getAndRequireEquals().assertFalse(exports.FungibleTokenErrors.tokenPaused);
        const accountUpdate = this.internal.mint({ address: recipient, amount });
        const adminContract = await this.getAdminContract();
        const canMint = await adminContract.canMint(accountUpdate);
        canMint.assertTrue(exports.FungibleTokenErrors.noPermissionToMint);
        recipient.equals(this.address).assertFalse(exports.FungibleTokenErrors.noTransferFromCirculation);
        this.approve(accountUpdate);
        this.emitEvent("Mint", new MintEvent({ recipient, amount }));
        const circulationUpdate = o1js_1.AccountUpdate.create(this.address, this.deriveTokenId());
        circulationUpdate.balanceChange = o1js_1.Int64.fromUnsigned(amount);
        return accountUpdate;
    }
    async burn(from, amount) {
        this.paused.getAndRequireEquals().assertFalse(exports.FungibleTokenErrors.tokenPaused);
        const accountUpdate = this.internal.burn({ address: from, amount });
        const circulationUpdate = o1js_1.AccountUpdate.create(this.address, this.deriveTokenId());
        from.equals(this.address).assertFalse(exports.FungibleTokenErrors.noTransferFromCirculation);
        circulationUpdate.balanceChange = o1js_1.Int64.fromUnsigned(amount).negV2();
        this.emitEvent("Burn", new BurnEvent({ from, amount }));
        return accountUpdate;
    }
    async pause() {
        const adminContract = await this.getAdminContract();
        const canPause = await adminContract.canPause();
        canPause.assertTrue(exports.FungibleTokenErrors.noPermissionToPause);
        this.paused.set((0, o1js_1.Bool)(true));
        this.emitEvent("Pause", new PauseEvent({ isPaused: (0, o1js_1.Bool)(true) }));
    }
    async resume() {
        const adminContract = await this.getAdminContract();
        const canResume = await adminContract.canResume();
        canResume.assertTrue(exports.FungibleTokenErrors.noPermissionToResume);
        this.paused.set((0, o1js_1.Bool)(false));
        this.emitEvent("Pause", new PauseEvent({ isPaused: (0, o1js_1.Bool)(false) }));
    }
    async transfer(from, to, amount) {
        this.paused.getAndRequireEquals().assertFalse(exports.FungibleTokenErrors.tokenPaused);
        from.equals(this.address).assertFalse(exports.FungibleTokenErrors.noTransferFromCirculation);
        to.equals(this.address).assertFalse(exports.FungibleTokenErrors.noTransferFromCirculation);
        this.internal.send({ from, to, amount });
    }
    checkPermissionsUpdate(update) {
        let permissions = update.update.permissions;
        let { access, receive } = permissions.value;
        let accessIsNone = o1js_1.Provable.equal(o1js_1.Types.AuthRequired, access, o1js_1.Permissions.none());
        let receiveIsNone = o1js_1.Provable.equal(o1js_1.Types.AuthRequired, receive, o1js_1.Permissions.none());
        let updateAllowed = accessIsNone.and(receiveIsNone);
        (0, o1js_1.assert)(updateAllowed.or(permissions.isSome.not()), exports.FungibleTokenErrors.noPermissionChangeAllowed);
    }
    /** Approve `AccountUpdate`s that have been created outside of the token contract.
     *
     * @argument {AccountUpdateForest} updates - The `AccountUpdate`s to approve. Note that the forest size is limited by the base token contract, @see TokenContractV2.MAX_ACCOUNT_UPDATES The current limit is 9.
     */
    async approveBase(updates) {
        this.paused.getAndRequireEquals().assertFalse(exports.FungibleTokenErrors.tokenPaused);
        let totalBalance = o1js_1.Int64.from(0);
        this.forEachUpdate(updates, (update, usesToken) => {
            // Make sure that the account permissions are not changed
            this.checkPermissionsUpdate(update);
            this.emitEventIf(usesToken, "BalanceChange", new BalanceChangeEvent({ address: update.publicKey, amount: update.balanceChange }));
            // Don't allow transfers to/from the account that's tracking circulation
            update.publicKey.equals(this.address).and(usesToken).assertFalse(exports.FungibleTokenErrors.noTransferFromCirculation);
            totalBalance = o1js_1.Provable.if(usesToken, totalBalance.add(update.balanceChange), totalBalance);
            totalBalance.isPositiveV2().assertFalse(exports.FungibleTokenErrors.flashMinting);
        });
        totalBalance.assertEquals(o1js_1.Int64.zero, exports.FungibleTokenErrors.unbalancedTransaction);
    }
    async getBalanceOf(address) {
        const account = o1js_1.AccountUpdate.create(address, this.deriveTokenId()).account;
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
exports.FungibleToken = FungibleToken;
// This defines the type of the contract that is used to control access to administrative actions.
// If you want to have a custom contract, overwrite this by setting FungibleToken.AdminContract to
// your own implementation of FungibleTokenAdminBase.
FungibleToken.AdminContract = FungibleTokenAdmin_js_1.FungibleTokenAdmin;
__decorate([
    (0, o1js_1.state)(o1js_1.UInt8),
    __metadata("design:type", Object)
], FungibleToken.prototype, "decimals", void 0);
__decorate([
    (0, o1js_1.state)(o1js_1.PublicKey),
    __metadata("design:type", Object)
], FungibleToken.prototype, "admin", void 0);
__decorate([
    (0, o1js_1.state)(o1js_1.Bool),
    __metadata("design:type", Object)
], FungibleToken.prototype, "paused", void 0);
__decorate([
    o1js_1.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.VerificationKey]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "updateVerificationKey", null);
__decorate([
    o1js_1.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.PublicKey,
        o1js_1.UInt8,
        o1js_1.Bool]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "initialize", null);
__decorate([
    o1js_1.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.PublicKey]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "setAdmin", null);
__decorate([
    o1js_1.method.returns(o1js_1.AccountUpdate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.PublicKey, o1js_1.UInt64]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "mint", null);
__decorate([
    o1js_1.method.returns(o1js_1.AccountUpdate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.PublicKey, o1js_1.UInt64]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "burn", null);
__decorate([
    o1js_1.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "pause", null);
__decorate([
    o1js_1.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "resume", null);
__decorate([
    o1js_1.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.PublicKey, o1js_1.PublicKey, o1js_1.UInt64]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "transfer", null);
__decorate([
    o1js_1.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.AccountUpdateForest]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "approveBase", null);
__decorate([
    o1js_1.method.returns(o1js_1.UInt64),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.PublicKey]),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "getBalanceOf", null);
__decorate([
    o1js_1.method.returns(o1js_1.UInt8),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FungibleToken.prototype, "getDecimals", null);
class SetAdminEvent extends (0, o1js_1.Struct)({
    adminKey: o1js_1.PublicKey,
}) {
}
exports.SetAdminEvent = SetAdminEvent;
class PauseEvent extends (0, o1js_1.Struct)({
    isPaused: o1js_1.Bool,
}) {
}
exports.PauseEvent = PauseEvent;
class MintEvent extends (0, o1js_1.Struct)({
    recipient: o1js_1.PublicKey,
    amount: o1js_1.UInt64,
}) {
}
exports.MintEvent = MintEvent;
class BurnEvent extends (0, o1js_1.Struct)({
    from: o1js_1.PublicKey,
    amount: o1js_1.UInt64,
}) {
}
exports.BurnEvent = BurnEvent;
class BalanceChangeEvent extends (0, o1js_1.Struct)({
    address: o1js_1.PublicKey,
    amount: o1js_1.Int64,
}) {
}
exports.BalanceChangeEvent = BalanceChangeEvent;
