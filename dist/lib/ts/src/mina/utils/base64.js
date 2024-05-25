"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldFromBase64 = exports.fieldToBase64 = exports.fieldFromBase56 = exports.fieldToBase56 = void 0;
const o1js_1 = require("o1js");
const base64_1 = require("../../cloud/utils/base64");
// URL friendly base64 encoding
const TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function fieldToBase56(field) {
    const digits = (0, base64_1.toBase)(field.toBigInt(), 56n);
    //console.log("digits:", digits);
    const str = digits.map((x) => TABLE[Number(x)]).join("");
    //console.log("str:", str);
    return str;
}
exports.fieldToBase56 = fieldToBase56;
function fieldFromBase56(str) {
    const base56Digits = str.split("").map((x) => BigInt(TABLE.indexOf(x)));
    const x = (0, base64_1.fromBase)(base56Digits, 56n);
    return (0, o1js_1.Field)(x);
}
exports.fieldFromBase56 = fieldFromBase56;
function fieldToBase64(field) {
    const digits = (0, base64_1.toBase)(field.toBigInt(), 64n);
    //console.log("digits:", digits);
    const str = digits.map((x) => TABLE[Number(x)]).join("");
    //console.log("str:", str);
    return str;
}
exports.fieldToBase64 = fieldToBase64;
function fieldFromBase64(str) {
    const base64Digits = str.split("").map((x) => BigInt(TABLE.indexOf(x)));
    const x = (0, base64_1.fromBase)(base64Digits, 64n);
    return (0, o1js_1.Field)(x);
}
exports.fieldFromBase64 = fieldFromBase64;
