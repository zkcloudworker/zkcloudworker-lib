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
exports.TinyContract = void 0;
const o1js_1 = require("o1js");
class TinyContract extends o1js_1.SmartContract {
    constructor() {
        super(...arguments);
        this.value = (0, o1js_1.State)();
    }
    async setValue(value) {
        this.value.set(value);
    }
}
exports.TinyContract = TinyContract;
__decorate([
    (0, o1js_1.state)(o1js_1.Field),
    __metadata("design:type", Object)
], TinyContract.prototype, "value", void 0);
__decorate([
    o1js_1.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [o1js_1.Field]),
    __metadata("design:returntype", Promise)
], TinyContract.prototype, "setValue", null);
