"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeFields = exports.serializeFields = void 0;
const o1js_1 = require("o1js");
const base64_1 = require("./base64");
function serializeFields(fields) {
    const hash = o1js_1.Poseidon.hash(fields);
    const value = [(0, o1js_1.Field)(fields.length), hash, ...fields];
    //return value.map((f) => f.toBigInt().toString(36)).join(".");
    return value.map((f) => (0, base64_1.fieldToBase64)(f)).join(".");
}
exports.serializeFields = serializeFields;
function deserializeFields(s) {
    try {
        //const value = s.split(".").map((n) => Field(BigInt(convert(n, 36))));
        const value = s.split(".").map((n) => (0, base64_1.fieldFromBase64)(n));
        const length = value[0];
        if ((0, o1js_1.Field)(value.length - 2)
            .equals(length)
            .toBoolean() === false)
            throw new Error("deserializeFields: invalid length");
        const hash = o1js_1.Poseidon.hash(value.slice(2));
        if (hash.equals(value[1]).toBoolean()) {
            return value.slice(2);
        }
        else
            throw new Error("deserializeFields: invalid hash: data mismatch");
    }
    catch (e) {
        throw new Error(`deserializeFields: invalid string: ${s}: ${e}`);
    }
}
exports.deserializeFields = deserializeFields;
