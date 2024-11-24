"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whitelist = exports.WhitelistedAddress = exports.UInt64Option = exports.WhitelistMapOption = exports.WhitelistMap = void 0;
const o1js_1 = require("o1js");
const __1 = require("../..");
const { IndexedMerkleMap } = o1js_1.Experimental;
const WHITELIST_HEIGHT = 20;
/** Represents the whitelist using an Indexed Merkle Map. */
class WhitelistMap extends IndexedMerkleMap(WHITELIST_HEIGHT) {
}
exports.WhitelistMap = WhitelistMap;
class WhitelistMapOption extends (0, o1js_1.Option)(WhitelistMap) {
}
exports.WhitelistMapOption = WhitelistMapOption;
class UInt64Option extends (0, o1js_1.Option)(o1js_1.UInt64) {
}
exports.UInt64Option = UInt64Option;
class WhitelistedAddress extends (0, o1js_1.Struct)({
    address: o1js_1.PublicKey,
    amount: o1js_1.UInt64, // Maximum permitted amount of the transaction
}) {
}
exports.WhitelistedAddress = WhitelistedAddress;
class Whitelist extends (0, o1js_1.Struct)({
    /** The root hash of the Merkle tree representing the whitelist. */
    root: o1js_1.Field,
    /** Off-chain storage information, typically an IPFS hash pointing to the whitelist data. */
    storage: __1.Storage,
}) {
    isNone() {
        return this.root
            .equals((0, o1js_1.Field)(0))
            .or(__1.Storage.equals(this.storage, __1.Storage.empty()));
    }
    isSome() {
        return this.isNone().not();
    }
    async load() {
        const isNone = this.isNone();
        const map = await o1js_1.Provable.witnessAsync(WhitelistMapOption, async () => {
            if (isNone.toBoolean())
                return WhitelistMapOption.none();
            else
                return WhitelistMapOption.fromValue(await (0, __1.loadIndexedMerkleMap)({
                    url: (0, __1.createIpfsURL)({ hash: this.storage.toString() }),
                    type: WhitelistMap,
                }));
        });
        isNone.assertEquals(map.isSome.not());
        const root = o1js_1.Provable.if(map.isSome, map.orElse(new WhitelistMap()).root, (0, o1js_1.Field)(0));
        root.equals(this.root);
        return map;
    }
    /**
     * The function fetches a whitelisted amount associated with a given address using a map and returns it
     * as a UInt64Option.
     * @param {PublicKey} address - The `address` parameter is of type `PublicKey`, which represents a
     * public key used in cryptography for various purposes such as encryption, digital signatures, and
     * authentication. In the context of the `fetchWhitelistedAmount` function, the `address` parameter is
     * used to retrieve a whitelisted amount
     * @returns The `fetchWhitelistedAmount` function returns a `Promise` that resolves to a `UInt64Option`
     * object. This object contains a `value` property representing the amount retrieved from a map based
     * on the provided address. The `isSome` property indicates whether the value is present or not.
     * The value is not present if the whitelist is NOT empty and the address is NOT whitelisted.
     * The value is present if the whitelist is NOT empty or the address IS whitelisted.
     * The value is present and equals to UInt64.MAXINT() if the whitelist IS empty.
     */
    async getWhitelistedAmount(address) {
        const map = await this.load();
        const key = o1js_1.Poseidon.hashPacked(o1js_1.PublicKey, address);
        const value = map.orElse(new WhitelistMap()).getOption(key);
        const valueField = value.orElse(o1js_1.UInt64.MAXINT().value);
        valueField.assertLessThanOrEqual(o1js_1.UInt64.MAXINT().value);
        const amount = o1js_1.UInt64.Unsafe.fromField(valueField);
        return new UInt64Option({
            value: amount,
            isSome: value.isSome.or(this.isNone()),
        });
    }
    static empty() {
        return new Whitelist({
            root: (0, o1js_1.Field)(0),
            storage: __1.Storage.empty(),
        });
    }
    /**
     * Creates a new whitelist and pins it to IPFS.
     * @param params - The parameters for creating the whitelist.
     * @returns A new `Whitelist` instance.
     */
    static async create(params) {
        const { name = "whitelist.json", keyvalues = [{ key: "library", value: "zkcloudworker" }], timeout = 60 * 1000, attempts = 5, auth, } = params;
        const list = typeof params.list[0].address === "string"
            ? params.list.map((item) => new WhitelistedAddress({
                address: o1js_1.PublicKey.fromBase58(item.address),
                amount: item.amount
                    ? o1js_1.UInt64.from(item.amount)
                    : o1js_1.UInt64.MAXINT(),
            }))
            : params.list;
        const map = new WhitelistMap();
        for (const item of list) {
            map.insert(o1js_1.Poseidon.hashPacked(o1js_1.PublicKey, item.address), item.amount.toBigInt());
        }
        const serializedMap = (0, __1.serializeIndexedMap)(map);
        const json = {
            map: serializedMap,
            whitelist: list.map((item) => ({
                address: item.address.toBase58(),
                amount: Number(item.amount.toBigInt()),
            })),
        };
        let attempt = 0;
        const start = Date.now();
        let hash = await (0, __1.pinJSON)({
            data: json,
            name,
            keyvalues,
            auth,
        });
        while (!hash && attempt < attempts && Date.now() - start < timeout) {
            attempt++;
            await (0, __1.sleep)(5000 * attempt); // handle rate-limits
            hash = await (0, __1.pinJSON)({
                data: json,
                name,
                keyvalues,
                auth,
            });
        }
        if (!hash)
            throw new Error("Failed to pin whitelist");
        return new Whitelist({
            root: map.root,
            storage: __1.Storage.fromString(hash),
        });
    }
}
exports.Whitelist = Whitelist;
