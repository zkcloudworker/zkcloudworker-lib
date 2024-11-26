import { Field, Option, PublicKey, UInt64, Bool } from "o1js";
import { Storage } from "../storage/storage.js";
declare const WhitelistMap_base: typeof import("node_modules/o1js/dist/node/lib/provable/merkle-tree-indexed.js").IndexedMerkleMapBase;
/** Represents the whitelist using an Indexed Merkle Map. */
export declare class WhitelistMap extends WhitelistMap_base {
}
declare const WhitelistMapOption_base: import("node_modules/o1js/dist/node/lib/provable/types/provable-intf.js").Provable<Option<import("node_modules/o1js/dist/node/lib/provable/merkle-tree-indexed.js").IndexedMerkleMapBase, {
    root: bigint;
    length: bigint;
    data: {
        nodes: (bigint | undefined)[][];
        sortedLeaves: {
            readonly value: bigint;
            readonly key: bigint;
            readonly nextKey: bigint;
            readonly index: number;
        }[];
    };
}>, {
    root: bigint;
    length: bigint;
    data: {
        nodes: (bigint | undefined)[][];
        sortedLeaves: {
            readonly value: bigint;
            readonly key: bigint;
            readonly nextKey: bigint;
            readonly index: number;
        }[];
    };
} | undefined> & (new (option: {
    isSome: Bool;
    value: import("node_modules/o1js/dist/node/lib/provable/merkle-tree-indexed.js").IndexedMerkleMapBase;
}) => Option<import("node_modules/o1js/dist/node/lib/provable/merkle-tree-indexed.js").IndexedMerkleMapBase, {
    root: bigint;
    length: bigint;
    data: {
        nodes: (bigint | undefined)[][];
        sortedLeaves: {
            readonly value: bigint;
            readonly key: bigint;
            readonly nextKey: bigint;
            readonly index: number;
        }[];
    };
}>) & {
    fromValue(value: import("node_modules/o1js/dist/node/lib/provable/merkle-tree-indexed.js").IndexedMerkleMapBase | {
        root: bigint;
        length: bigint;
        data: {
            nodes: (bigint | undefined)[][];
            sortedLeaves: {
                readonly value: bigint;
                readonly key: bigint;
                readonly nextKey: bigint;
                readonly index: number;
            }[];
        };
    } | {
        isSome: boolean | Bool;
        value: import("node_modules/o1js/dist/node/lib/provable/merkle-tree-indexed.js").IndexedMerkleMapBase | {
            root: bigint;
            length: bigint;
            data: {
                nodes: (bigint | undefined)[][];
                sortedLeaves: {
                    readonly value: bigint;
                    readonly key: bigint;
                    readonly nextKey: bigint;
                    readonly index: number;
                }[];
            };
        };
    } | undefined): Option<import("node_modules/o1js/dist/node/lib/provable/merkle-tree-indexed.js").IndexedMerkleMapBase, {
        root: bigint;
        length: bigint;
        data: {
            nodes: (bigint | undefined)[][];
            sortedLeaves: {
                readonly value: bigint;
                readonly key: bigint;
                readonly nextKey: bigint;
                readonly index: number;
            }[];
        };
    }>;
    from(value?: import("node_modules/o1js/dist/node/lib/provable/merkle-tree-indexed.js").IndexedMerkleMapBase | {
        root: bigint;
        length: bigint;
        data: {
            nodes: (bigint | undefined)[][];
            sortedLeaves: {
                readonly value: bigint;
                readonly key: bigint;
                readonly nextKey: bigint;
                readonly index: number;
            }[];
        };
    } | undefined): Option<import("node_modules/o1js/dist/node/lib/provable/merkle-tree-indexed.js").IndexedMerkleMapBase, {
        root: bigint;
        length: bigint;
        data: {
            nodes: (bigint | undefined)[][];
            sortedLeaves: {
                readonly value: bigint;
                readonly key: bigint;
                readonly nextKey: bigint;
                readonly index: number;
            }[];
        };
    }>;
    none(): Option<import("node_modules/o1js/dist/node/lib/provable/merkle-tree-indexed.js").IndexedMerkleMapBase, {
        root: bigint;
        length: bigint;
        data: {
            nodes: (bigint | undefined)[][];
            sortedLeaves: {
                readonly value: bigint;
                readonly key: bigint;
                readonly nextKey: bigint;
                readonly index: number;
            }[];
        };
    }>;
};
export declare class WhitelistMapOption extends WhitelistMapOption_base {
}
declare const UInt64Option_base: Omit<import("node_modules/o1js/dist/node/lib/provable/types/provable-intf.js").Provable<Option<UInt64, bigint>, bigint | undefined>, "fromFields"> & {
    fromFields: (fields: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[]) => Option<UInt64, bigint>;
} & (new (option: {
    isSome: Bool;
    value: UInt64;
}) => Option<UInt64, bigint>) & {
    fromValue(value: bigint | UInt64 | {
        isSome: boolean | Bool;
        value: bigint | UInt64;
    } | undefined): Option<UInt64, bigint>;
    from(value?: bigint | UInt64 | undefined): Option<UInt64, bigint>;
    none(): Option<UInt64, bigint>;
};
export declare class UInt64Option extends UInt64Option_base {
}
declare const WhitelistedAddress_base: (new (value: {
    address: PublicKey;
    amount: UInt64;
}) => {
    address: PublicKey;
    amount: UInt64;
}) & {
    _isStruct: true;
} & Omit<import("node_modules/o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
    address: PublicKey;
    amount: UInt64;
}, {
    address: {
        x: bigint;
        isOdd: boolean;
    };
    amount: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[]) => {
        address: PublicKey;
        amount: UInt64;
    };
} & {
    fromValue: (value: {
        address: PublicKey | {
            x: Field | bigint;
            isOdd: Bool | boolean;
        };
        amount: bigint | UInt64;
    }) => {
        address: PublicKey;
        amount: UInt64;
    };
    toInput: (x: {
        address: PublicKey;
        amount: UInt64;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        address: PublicKey;
        amount: UInt64;
    }) => {
        address: string;
        amount: string;
    };
    fromJSON: (x: {
        address: string;
        amount: string;
    }) => {
        address: PublicKey;
        amount: UInt64;
    };
    empty: () => {
        address: PublicKey;
        amount: UInt64;
    };
};
export declare class WhitelistedAddress extends WhitelistedAddress_base {
}
export type WhitelistedAddressList = WhitelistedAddress[] | {
    address: string;
    amount?: number;
}[];
declare const Whitelist_base: (new (value: {
    root: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
    storage: Storage;
}) => {
    root: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
    storage: Storage;
}) & {
    _isStruct: true;
} & Omit<import("node_modules/o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
    root: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
    storage: Storage;
}, {
    root: bigint;
    storage: {
        url: bigint[];
    };
}>, "fromFields"> & {
    fromFields: (fields: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[]) => {
        root: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        storage: Storage;
    };
} & {
    fromValue: (value: {
        root: string | number | bigint | import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        storage: Storage | {
            url: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[] | bigint[];
        };
    }) => {
        root: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        storage: Storage;
    };
    toInput: (x: {
        root: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        storage: Storage;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        root: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        storage: Storage;
    }) => {
        root: string;
        storage: {
            url: string[];
        };
    };
    fromJSON: (x: {
        root: string;
        storage: {
            url: string[];
        };
    }) => {
        root: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        storage: Storage;
    };
    empty: () => {
        root: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        storage: Storage;
    };
};
export declare class Whitelist extends Whitelist_base {
    isNone(): Bool;
    isSome(): Bool;
    load(): Promise<WhitelistMapOption>;
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
    getWhitelistedAmount(address: PublicKey): Promise<UInt64Option>;
    static empty(): Whitelist;
    /**
     * Creates a new whitelist and pins it to IPFS.
     * @param params - The parameters for creating the whitelist.
     * @returns A new `Whitelist` instance.
     */
    static create(params: {
        list: WhitelistedAddress[] | {
            address: string;
            amount?: number;
        }[];
        name?: string;
        keyvalues?: object;
        timeout?: number;
        attempts?: number;
        auth?: string;
    }): Promise<Whitelist>;
    toString(): string;
    static fromString(str: string): Whitelist;
}
export {};
