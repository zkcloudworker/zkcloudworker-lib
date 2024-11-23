"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const o1js_1 = require("o1js");
/**
 * Represents the off-chain storage information,
 * such as an IPFS hash.
 */
class Storage extends (0, o1js_1.Struct)({
    url: o1js_1.Provable.Array(o1js_1.Field, 2),
}) {
    constructor(value) {
        super(value);
    }
    /**
     * Asserts that two Storage instances are equal.
     * @param a The first Storage instance.
     * @param b The second Storage instance.
     */
    static assertEquals(a, b) {
        a.url[0].assertEquals(b.url[0]);
        a.url[1].assertEquals(b.url[1]);
    }
    /**
     * Checks if two Storage instances are equal.
     * @param a The first Storage instance.
     * @param b The second Storage instance.
     * @returns A Bool indicating whether the two instances are equal.
     */
    static equals(a, b) {
        return a.url[0].equals(b.url[0]).and(a.url[1].equals(b.url[1]));
    }
    /**
     * Creates a Storage instance from a string.
     * @param url The string representing the storage URL.
     * @returns A new Storage instance.
     */
    static fromString(url) {
        const fields = o1js_1.Encoding.stringToFields(url);
        if (fields.length !== 2)
            throw new Error("Invalid string length");
        return new Storage({ url: [fields[0], fields[1]] });
    }
    /**
     * Converts the Storage instance to a string.
     * @returns The string representation of the storage URL.
     */
    toString() {
        if (this.url[0].toBigInt() === 0n && this.url[1].toBigInt() === 0n) {
            throw new Error("Invalid string");
        }
        return o1js_1.Encoding.stringFromFields([this.url[0], this.url[1]]);
    }
}
exports.Storage = Storage;
