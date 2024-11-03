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
exports.NFTWhitelistedAdmin = void 0;
const o1js_1 = require("o1js");
const whitelist_1 = require("./whitelist");
const types_1 = require("./types");
class NFTWhitelistedAdmin extends o1js_1.SmartContract {
    constructor() {
        super(...arguments);
        this.collection = (0, o1js_1.State)();
        this.admin = (0, o1js_1.State)();
        this.whitelist = (0, o1js_1.State)();
        this.storage = (0, o1js_1.State)();
    }
    async deploy(props) {
        await super.deploy(props);
        this.collection.set(props.collection);
        this.admin.set(props.admin);
        this.whitelist.set(props.whitelist);
        this.storage.set(props.storage);
        this.account.zkappUri.set("zkcloudworker#NFTWhitelistedAdmin");
        this.account.permissions.set({
            ...o1js_1.Permissions.default(),
            setVerificationKey: o1js_1.Permissions.VerificationKey.impossibleDuringCurrentVersion(),
            setPermissions: o1js_1.Permissions.impossible(),
        });
    }
    async isWhitelisted(address, amount) {
        const whitelist = this.whitelist.getAndRequireEquals();
        const storage = this.storage.getAndRequireEquals();
        const map = await o1js_1.Provable.witnessAsync(whitelist_1.Whitelist, async () => {
            return await (0, whitelist_1.loadWhitelist)(storage);
        });
        map.root.assertEquals(whitelist);
        const key = o1js_1.Poseidon.hash(address.toFields());
        map.assertIncluded(key, "Address not whitelisted");
        const value = map.get(key);
        value.assertLessThanOrEqual((0, o1js_1.Field)(o1js_1.UInt64.MAXINT().value));
        const maxAmount = o1js_1.UInt64.Unsafe.fromField(value);
        return (0, o1js_1.Bool)(amount.lessThanOrEqual(maxAmount));
    }
    async updateVerificationKey(vk) {
        const sender = this.sender.getAndRequireSignature();
        this.admin.getAndRequireEquals().assertEquals(sender);
        this.account.verificationKey.set(vk);
    }
    async canMint(params) {
        return await this.isWhitelisted(params.owner, o1js_1.UInt64.from(0));
    }
    async canUpdate(input, output) {
        return await this.isWhitelisted(output.owner, o1js_1.UInt64.from(0));
    }
    async canTransfer(address, from, to) {
        return await this.isWhitelisted(to, o1js_1.UInt64.from(0));
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
exports.NFTWhitelistedAdmin = NFTWhitelistedAdmin;
__decorate([
    (0, o1js_1.state)(o1js_1.PublicKey),
    __metadata("design:type", Object)
], NFTWhitelistedAdmin.prototype, "collection", void 0);
__decorate([
    (0, o1js_1.state)(o1js_1.PublicKey),
    __metadata("design:type", Object)
], NFTWhitelistedAdmin.prototype, "admin", void 0);
__decorate([
    (0, o1js_1.state)(o1js_1.Field),
    __metadata("design:type", Object)
], NFTWhitelistedAdmin.prototype, "whitelist", void 0);
__decorate([
    (0, o1js_1.state)(types_1.Storage),
    __metadata("design:type", Object)
], NFTWhitelistedAdmin.prototype, "storage", void 0);
__decorate([
    o1js_1.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.VerificationKey]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "updateVerificationKey", null);
__decorate([
    o1js_1.method.returns(o1js_1.Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.MintParams]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "canMint", null);
__decorate([
    o1js_1.method.returns(o1js_1.Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.NFTState, types_1.NFTState]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "canUpdate", null);
__decorate([
    o1js_1.method.returns(o1js_1.Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.PublicKey, o1js_1.PublicKey, o1js_1.PublicKey]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "canTransfer", null);
__decorate([
    o1js_1.method.returns(o1js_1.Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.PublicKey, o1js_1.PublicKey, o1js_1.UInt64]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "canSell", null);
__decorate([
    o1js_1.method.returns(o1js_1.Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.PublicKey,
        o1js_1.PublicKey,
        o1js_1.PublicKey,
        o1js_1.UInt64]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "canBuy", null);
__decorate([
    o1js_1.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.Field, types_1.Storage]),
    __metadata("design:returntype", Promise)
], NFTWhitelistedAdmin.prototype, "updateMerkleMapRoot", null);
