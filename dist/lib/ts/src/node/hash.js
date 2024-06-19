"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringHash = void 0;
const crypto_1 = __importDefault(require("crypto"));
const cloud_1 = require("../cloud/");
function stringHash(jsonString) {
    if (typeof jsonString !== "string")
        throw new Error("stringHash: input must be a string");
    return (0, cloud_1.bigintToBase56)(BigInt("0x" + crypto_1.default.createHash("sha256").update(jsonString).digest("hex")));
}
exports.stringHash = stringHash;
