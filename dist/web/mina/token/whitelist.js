import { Experimental, Struct, Field, Option, Provable, PublicKey, UInt64, Poseidon, } from "o1js";
import { serializeIndexedMap, loadIndexedMerkleMap, } from "../utils/indexed-map.js";
import { sleep } from "../../cloud/utils/utils.js";
import { Storage } from "../storage/storage.js";
import { createIpfsURL } from "../storage/ipfs.js";
import { pinJSON } from "../storage/pinata.js";
const { IndexedMerkleMap } = Experimental;
const WHITELIST_HEIGHT = 20;
/** Represents the whitelist using an Indexed Merkle Map. */
export class WhitelistMap extends IndexedMerkleMap(WHITELIST_HEIGHT) {
}
export class WhitelistMapOption extends Option(WhitelistMap) {
}
export class UInt64Option extends Option(UInt64) {
}
export class WhitelistedAddress extends Struct({
    address: PublicKey,
    amount: UInt64, // Maximum permitted amount of the transaction
}) {
}
export class Whitelist extends Struct({
    /** The root hash of the Merkle tree representing the whitelist. */
    root: Field,
    /** Off-chain storage information, typically an IPFS hash pointing to the whitelist data. */
    storage: Storage,
}) {
    isNone() {
        return this.root
            .equals(Field(0))
            .or(Storage.equals(this.storage, Storage.empty()));
    }
    isSome() {
        return this.isNone().not();
    }
    async load() {
        const isNone = this.isNone();
        const map = await Provable.witnessAsync(WhitelistMapOption, async () => {
            if (isNone.toBoolean())
                return WhitelistMapOption.none();
            else
                return WhitelistMapOption.fromValue(await loadIndexedMerkleMap({
                    url: createIpfsURL({ hash: this.storage.toString() }),
                    type: WhitelistMap,
                }));
        });
        isNone.assertEquals(map.isSome.not());
        const root = Provable.if(map.isSome, map.orElse(new WhitelistMap()).root, Field(0));
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
        const key = Poseidon.hashPacked(PublicKey, address);
        const value = map.orElse(new WhitelistMap()).getOption(key);
        const valueField = value.orElse(UInt64.MAXINT().value);
        valueField.assertLessThanOrEqual(UInt64.MAXINT().value);
        const amount = UInt64.Unsafe.fromField(valueField);
        return new UInt64Option({
            value: amount,
            isSome: value.isSome.or(this.isNone()),
        });
    }
    static empty() {
        return new Whitelist({
            root: Field(0),
            storage: Storage.empty(),
        });
    }
    /**
     * Creates a new whitelist and pins it to IPFS.
     * @param params - The parameters for creating the whitelist.
     * @returns A new `Whitelist` instance.
     */
    static async create(params) {
        const { name = "whitelist.json", keyvalues, timeout = 60 * 1000, attempts = 5, auth, } = params;
        const list = typeof params.list[0].address === "string"
            ? params.list.map((item) => new WhitelistedAddress({
                address: PublicKey.fromBase58(item.address),
                amount: item.amount
                    ? UInt64.from(item.amount)
                    : UInt64.MAXINT(),
            }))
            : params.list;
        const map = new WhitelistMap();
        for (const item of list) {
            map.insert(Poseidon.hashPacked(PublicKey, item.address), item.amount.toBigInt());
        }
        const serializedMap = serializeIndexedMap(map);
        const json = {
            map: serializedMap,
            whitelist: list.map((item) => ({
                address: item.address.toBase58(),
                amount: Number(item.amount.toBigInt()),
            })),
        };
        let attempt = 0;
        const start = Date.now();
        if (process.env.DEBUG === "true")
            console.log("Whitelist.create:", { json, name, keyvalues, auth }, json.whitelist);
        let hash = await pinJSON({
            data: json,
            name,
            keyvalues,
            auth,
        });
        while (!hash && attempt < attempts && Date.now() - start < timeout) {
            attempt++;
            await sleep(5000 * attempt); // handle rate-limits
            hash = await pinJSON({
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
            storage: Storage.fromString(hash),
        });
    }
    toString() {
        return JSON.stringify({ root: this.root.toJSON(), storage: this.storage.toString() }, null, 2);
    }
    static fromString(str) {
        const json = JSON.parse(str);
        return new Whitelist({
            root: Field.fromJSON(json.root),
            storage: Storage.fromString(json.storage),
        });
    }
}
//# sourceMappingURL=whitelist.js.map