import { __decorate, __metadata } from "tslib";
import { Bool, method, Permissions, Provable, PublicKey, SmartContract, State, state, VerificationKey, UInt64, Field, Poseidon, } from "o1js";
import { Whitelist, loadWhitelist } from "./whitelist";
import { MintParams, NFTState, Storage } from "./types";
export class NFTWhitelistedAdmin extends SmartContract {
    constructor() {
        super(...arguments);
        this.collection = State();
        this.admin = State();
        this.whitelist = State();
        this.storage = State();
    }
    async deploy(props) {
        await super.deploy(props);
        this.collection.set(props.collection);
        this.admin.set(props.admin);
        this.whitelist.set(props.whitelist);
        this.storage.set(props.storage);
        this.account.zkappUri.set("zkcloudworker#NFTWhitelistedAdmin");
        this.account.permissions.set({
            ...Permissions.default(),
            setVerificationKey: Permissions.VerificationKey.impossibleDuringCurrentVersion(),
            setPermissions: Permissions.impossible(),
        });
    }
    async isWhitelisted(address, amount) {
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
    async updateVerificationKey(vk) {
        const sender = this.sender.getAndRequireSignature();
        this.admin.getAndRequireEquals().assertEquals(sender);
        this.account.verificationKey.set(vk);
    }
    async canMint(params) {
        return await this.isWhitelisted(params.owner, UInt64.from(0));
    }
    async canUpdate(input, output) {
        return await this.isWhitelisted(output.owner, UInt64.from(0));
    }
    async canTransfer(address, from, to) {
        return await this.isWhitelisted(to, UInt64.from(0));
    }
    async canSell(address, seller, price) {
        return await this.isWhitelisted(address, price);
    }
    async canBuy(address, seller, buyer, price) {
        return (await this.isWhitelisted(buyer, price)).and(await this.isWhitelisted(seller, price));
    }
    async updateMerkleMapRoot(root, storage) {
        const sender = this.sender.getAndRequireSignature();
        this.admin.getAndRequireEquals().assertEquals(sender);
        this.whitelist.set(root);
        this.storage.set(storage);
    }
}
__decorate([
    state(PublicKey),
    __metadata("design:type", Object)
], NFTWhitelistedAdmin.prototype, "collection", void 0);
__decorate([
    state(PublicKey),
    __metadata("design:type", Object)
], NFTWhitelistedAdmin.prototype, "admin", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], NFTWhitelistedAdmin.prototype, "whitelist", void 0);
__decorate([
    state(Storage),
    __metadata("design:type", Object)
], NFTWhitelistedAdmin.prototype, "storage", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerificationKey]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "updateVerificationKey", null);
__decorate([
    method.returns(Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MintParams]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "canMint", null);
__decorate([
    method.returns(Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NFTState, NFTState]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "canUpdate", null);
__decorate([
    method.returns(Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey, PublicKey, PublicKey]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "canTransfer", null);
__decorate([
    method.returns(Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey, PublicKey, UInt64]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "canSell", null);
__decorate([
    method.returns(Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey,
        PublicKey,
        PublicKey,
        UInt64]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "canBuy", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Storage]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "updateMerkleMapRoot", null);
//# sourceMappingURL=whitelist-admin.js.map