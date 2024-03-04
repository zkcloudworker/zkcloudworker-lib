"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fee = void 0;
const o1js_1 = require("o1js");
const config_1 = __importDefault(require("./config"));
async function fee() {
    //TODO: update after mainnet launch
    return o1js_1.UInt64.fromJSON(config_1.default.MINAFEE);
}
exports.fee = fee;
