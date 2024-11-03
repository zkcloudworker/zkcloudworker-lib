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
exports.FungibleTokenAdmin = void 0;
const o1js_v1_1 = require("o1js_v1");
/** A contract that grants permissions for administrative actions on a token.
 *
 * We separate this out into a dedicated contract. That way, when issuing a token, a user can
 * specify their own rules for administrative actions, without changing the token contract itself.
 *
 * The advantage is that third party applications that only use the token in a non-privileged way
 * can integrate against the unchanged token contract.
 */
class FungibleTokenAdmin extends o1js_v1_1.SmartContract {
    constructor() {
        super(...arguments);
        this.adminPublicKey = (0, o1js_v1_1.State)();
    }
    async deploy(props) {
        await super.deploy(props);
        this.adminPublicKey.set(props.adminPublicKey);
        this.account.permissions.set({
            ...o1js_v1_1.Permissions.default(),
            setVerificationKey: o1js_v1_1.Permissions.VerificationKey.impossibleDuringCurrentVersion(),
            setPermissions: o1js_v1_1.Permissions.impossible(),
        });
    }
    /** Update the verification key.
     * Note that because we have set the permissions for setting the verification key to `impossibleDuringCurrentVersion()`, this will only be possible in case of a protocol update that requires an update.
     */
    async updateVerificationKey(vk) {
        this.account.verificationKey.set(vk);
    }
    async ensureAdminSignature() {
        const admin = await o1js_v1_1.Provable.witnessAsync(o1js_v1_1.PublicKey, async () => {
            let pk = await this.adminPublicKey.fetch();
            (0, o1js_v1_1.assert)(pk !== undefined, "could not fetch admin public key");
            return pk;
        });
        this.adminPublicKey.requireEquals(admin);
        return o1js_v1_1.AccountUpdate.createSigned(admin);
    }
    async canMint(_accountUpdate) {
        await this.ensureAdminSignature();
        return (0, o1js_v1_1.Bool)(true);
    }
    async canChangeAdmin(_admin) {
        await this.ensureAdminSignature();
        return (0, o1js_v1_1.Bool)(true);
    }
    async canPause() {
        await this.ensureAdminSignature();
        return (0, o1js_v1_1.Bool)(true);
    }
    async canResume() {
        await this.ensureAdminSignature();
        return (0, o1js_v1_1.Bool)(true);
    }
}
exports.FungibleTokenAdmin = FungibleTokenAdmin;
__decorate([
    (0, o1js_v1_1.state)(o1js_v1_1.PublicKey),
    __metadata("design:type", Object)
], FungibleTokenAdmin.prototype, "adminPublicKey", void 0);
__decorate([
    o1js_v1_1.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_v1_1.VerificationKey]),
    __metadata("design:returntype", Promise)
], FungibleTokenAdmin.prototype, "updateVerificationKey", null);
__decorate([
    o1js_v1_1.method.returns(o1js_v1_1.Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_v1_1.AccountUpdate]),
    __metadata("design:returntype", Promise)
], FungibleTokenAdmin.prototype, "canMint", null);
__decorate([
    o1js_v1_1.method.returns(o1js_v1_1.Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_v1_1.PublicKey]),
    __metadata("design:returntype", Promise)
], FungibleTokenAdmin.prototype, "canChangeAdmin", null);
__decorate([
    o1js_v1_1.method.returns(o1js_v1_1.Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FungibleTokenAdmin.prototype, "canPause", null);
__decorate([
    o1js_v1_1.method.returns(o1js_v1_1.Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FungibleTokenAdmin.prototype, "canResume", null);
