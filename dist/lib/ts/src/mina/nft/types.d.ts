import { Field, PublicKey, Bool, VerificationKey, UInt32, UInt64, Provable, DynamicProof, SmartContract } from "o1js";
export { Storage, MintParams, MintSignatureData, NFTData, CollectionData, NFTState, NFTImmutableState, NFTUpdateProof, NFTAdminBase, };
declare const Storage_base: (new (value: {
    url: import("o1js/dist/node/lib/provable/field").Field[];
}) => {
    url: import("o1js/dist/node/lib/provable/field").Field[];
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    url: import("o1js/dist/node/lib/provable/field").Field[];
}, {
    url: bigint[];
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        url: import("o1js/dist/node/lib/provable/field").Field[];
    };
} & {
    fromValue: (value: {
        url: import("o1js/dist/node/lib/provable/field").Field[] | bigint[];
    }) => {
        url: import("o1js/dist/node/lib/provable/field").Field[];
    };
    toInput: (x: {
        url: import("o1js/dist/node/lib/provable/field").Field[];
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        url: import("o1js/dist/node/lib/provable/field").Field[];
    }) => {
        url: string[];
    };
    fromJSON: (x: {
        url: string[];
    }) => {
        url: import("o1js/dist/node/lib/provable/field").Field[];
    };
    empty: () => {
        url: import("o1js/dist/node/lib/provable/field").Field[];
    };
};
declare class Storage extends Storage_base {
    constructor(value: {
        url: [Field, Field];
    });
    static assertEquals(a: Storage, b: Storage): void;
    static equals(a: Storage, b: Storage): Bool;
    static fromURL(url: string): Storage;
    toURL(): string;
}
declare const NFTImmutableState_base: (new (value: {
    creator: PublicKey;
    canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
    canPause: import("o1js/dist/node/lib/provable/bool").Bool;
    address: PublicKey;
    tokenId: import("o1js/dist/node/lib/provable/field").Field;
}) => {
    creator: PublicKey;
    canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
    canPause: import("o1js/dist/node/lib/provable/bool").Bool;
    address: PublicKey;
    tokenId: import("o1js/dist/node/lib/provable/field").Field;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    creator: PublicKey;
    canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
    canPause: import("o1js/dist/node/lib/provable/bool").Bool;
    address: PublicKey;
    tokenId: import("o1js/dist/node/lib/provable/field").Field;
}, {
    creator: {
        x: bigint;
        isOdd: boolean;
    };
    canChangeOwner: boolean;
    canChangeMetadata: boolean;
    canChangePrice: boolean;
    canChangeStorage: boolean;
    canChangeName: boolean;
    canChangeMetadataVerificationKeyHash: boolean;
    canPause: boolean;
    address: {
        x: bigint;
        isOdd: boolean;
    };
    tokenId: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        creator: PublicKey;
        canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
    };
} & {
    fromValue: (value: {
        creator: PublicKey | {
            x: Field | bigint;
            isOdd: Bool | boolean;
        };
        canChangeOwner: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        address: PublicKey | {
            x: Field | bigint;
            isOdd: Bool | boolean;
        };
        tokenId: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        creator: PublicKey;
        canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
    };
    toInput: (x: {
        creator: PublicKey;
        canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        creator: PublicKey;
        canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        creator: string;
        canChangeOwner: boolean;
        canChangeMetadata: boolean;
        canChangePrice: boolean;
        canChangeStorage: boolean;
        canChangeName: boolean;
        canChangeMetadataVerificationKeyHash: boolean;
        canPause: boolean;
        address: string;
        tokenId: string;
    };
    fromJSON: (x: {
        creator: string;
        canChangeOwner: boolean;
        canChangeMetadata: boolean;
        canChangePrice: boolean;
        canChangeStorage: boolean;
        canChangeName: boolean;
        canChangeMetadataVerificationKeyHash: boolean;
        canPause: boolean;
        address: string;
        tokenId: string;
    }) => {
        creator: PublicKey;
        canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
    };
    empty: () => {
        creator: PublicKey;
        canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
    };
};
declare class NFTImmutableState extends NFTImmutableState_base {
    static assertEqual(a: NFTImmutableState, b: NFTImmutableState): void;
}
declare const NFTState_base: (new (value: {
    immutableState: NFTImmutableState;
    name: import("o1js/dist/node/lib/provable/field").Field;
    metadata: import("o1js/dist/node/lib/provable/field").Field;
    storage: Storage;
    owner: PublicKey;
    price: UInt64;
    version: UInt32;
    isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
}) => {
    immutableState: NFTImmutableState;
    name: import("o1js/dist/node/lib/provable/field").Field;
    metadata: import("o1js/dist/node/lib/provable/field").Field;
    storage: Storage;
    owner: PublicKey;
    price: UInt64;
    version: UInt32;
    isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    immutableState: NFTImmutableState;
    name: import("o1js/dist/node/lib/provable/field").Field;
    metadata: import("o1js/dist/node/lib/provable/field").Field;
    storage: Storage;
    owner: PublicKey;
    price: UInt64;
    version: UInt32;
    isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
}, {
    immutableState: {
        creator: {
            x: bigint;
            isOdd: boolean;
        };
        canChangeOwner: boolean;
        canChangeMetadata: boolean;
        canChangePrice: boolean;
        canChangeStorage: boolean;
        canChangeName: boolean;
        canChangeMetadataVerificationKeyHash: boolean;
        canPause: boolean;
        address: {
            x: bigint;
            isOdd: boolean;
        };
        tokenId: bigint;
    };
    name: bigint;
    metadata: bigint;
    storage: {
        url: bigint[];
    };
    owner: {
        x: bigint;
        isOdd: boolean;
    };
    price: bigint;
    version: bigint;
    isPaused: boolean;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        immutableState: NFTImmutableState;
        name: import("o1js/dist/node/lib/provable/field").Field;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        owner: PublicKey;
        price: UInt64;
        version: UInt32;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    };
} & {
    fromValue: (value: {
        immutableState: NFTImmutableState | {
            creator: PublicKey | {
                x: Field | bigint;
                isOdd: Bool | boolean;
            };
            canChangeOwner: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            canChangeMetadata: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            canChangePrice: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            canChangeStorage: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            canChangeName: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            canChangeMetadataVerificationKeyHash: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            canPause: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            address: PublicKey | {
                x: Field | bigint;
                isOdd: Bool | boolean;
            };
            tokenId: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        };
        name: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        metadata: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage | {
            url: import("o1js/dist/node/lib/provable/field").Field[] | bigint[];
        };
        owner: PublicKey | {
            x: Field | bigint;
            isOdd: Bool | boolean;
        };
        price: bigint | UInt64;
        version: bigint | UInt32;
        isPaused: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        immutableState: NFTImmutableState;
        name: import("o1js/dist/node/lib/provable/field").Field;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        owner: PublicKey;
        price: UInt64;
        version: UInt32;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    };
    toInput: (x: {
        immutableState: NFTImmutableState;
        name: import("o1js/dist/node/lib/provable/field").Field;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        owner: PublicKey;
        price: UInt64;
        version: UInt32;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        immutableState: NFTImmutableState;
        name: import("o1js/dist/node/lib/provable/field").Field;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        owner: PublicKey;
        price: UInt64;
        version: UInt32;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        immutableState: {
            creator: string;
            canChangeOwner: boolean;
            canChangeMetadata: boolean;
            canChangePrice: boolean;
            canChangeStorage: boolean;
            canChangeName: boolean;
            canChangeMetadataVerificationKeyHash: boolean;
            canPause: boolean;
            address: string;
            tokenId: string;
        };
        name: string;
        metadata: string;
        storage: {
            url: string[];
        };
        owner: string;
        price: string;
        version: string;
        isPaused: boolean;
    };
    fromJSON: (x: {
        immutableState: {
            creator: string;
            canChangeOwner: boolean;
            canChangeMetadata: boolean;
            canChangePrice: boolean;
            canChangeStorage: boolean;
            canChangeName: boolean;
            canChangeMetadataVerificationKeyHash: boolean;
            canPause: boolean;
            address: string;
            tokenId: string;
        };
        name: string;
        metadata: string;
        storage: {
            url: string[];
        };
        owner: string;
        price: string;
        version: string;
        isPaused: boolean;
    }) => {
        immutableState: NFTImmutableState;
        name: import("o1js/dist/node/lib/provable/field").Field;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        owner: PublicKey;
        price: UInt64;
        version: UInt32;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    };
    empty: () => {
        immutableState: NFTImmutableState;
        name: import("o1js/dist/node/lib/provable/field").Field;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        owner: PublicKey;
        price: UInt64;
        version: UInt32;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    };
};
declare class NFTState extends NFTState_base {
    static assertEqual(a: NFTState, b: NFTState): void;
}
declare class NFTUpdateProof extends DynamicProof<NFTState, NFTState> {
    static publicInputType: typeof NFTState;
    static publicOutputType: typeof NFTState;
    static maxProofsVerified: 2;
    static featureFlags: {
        rangeCheck0: undefined;
        rangeCheck1: undefined;
        foreignFieldAdd: undefined;
        foreignFieldMul: undefined;
        xor: undefined;
        rot: undefined;
        lookup: undefined;
        runtimeTables: undefined;
    };
}
declare const NFTData_base: (new (value: {
    price: UInt64;
    version: UInt32;
    canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
    canPause: import("o1js/dist/node/lib/provable/bool").Bool;
    isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
}) => {
    price: UInt64;
    version: UInt32;
    canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
    canPause: import("o1js/dist/node/lib/provable/bool").Bool;
    isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    price: UInt64;
    version: UInt32;
    canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
    canPause: import("o1js/dist/node/lib/provable/bool").Bool;
    isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
}, {
    price: bigint;
    version: bigint;
    canChangeOwner: boolean;
    canChangeMetadata: boolean;
    canChangePrice: boolean;
    canChangeStorage: boolean;
    canChangeName: boolean;
    canChangeMetadataVerificationKeyHash: boolean;
    canPause: boolean;
    isPaused: boolean;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        price: UInt64;
        version: UInt32;
        canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    };
} & {
    fromValue: (value: {
        price: bigint | UInt64;
        version: bigint | UInt32;
        canChangeOwner: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        price: UInt64;
        version: UInt32;
        canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    };
    toInput: (x: {
        price: UInt64;
        version: UInt32;
        canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        price: UInt64;
        version: UInt32;
        canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        price: string;
        version: string;
        canChangeOwner: boolean;
        canChangeMetadata: boolean;
        canChangePrice: boolean;
        canChangeStorage: boolean;
        canChangeName: boolean;
        canChangeMetadataVerificationKeyHash: boolean;
        canPause: boolean;
        isPaused: boolean;
    };
    fromJSON: (x: {
        price: string;
        version: string;
        canChangeOwner: boolean;
        canChangeMetadata: boolean;
        canChangePrice: boolean;
        canChangeStorage: boolean;
        canChangeName: boolean;
        canChangeMetadataVerificationKeyHash: boolean;
        canPause: boolean;
        isPaused: boolean;
    }) => {
        price: UInt64;
        version: UInt32;
        canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    };
    empty: () => {
        price: UInt64;
        version: UInt32;
        canChangeOwner: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadata: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangePrice: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeStorage: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeMetadataVerificationKeyHash: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    };
};
declare class NFTData extends NFTData_base {
    new(params?: {
        price?: number;
        version?: number;
        canChangeOwner?: boolean;
        canChangeMetadata?: boolean;
        canChangePrice?: boolean;
        canChangeStorage?: boolean;
        canChangeName?: boolean;
        canChangeMetadataVerificationKeyHash?: boolean;
        canPause?: boolean;
        isPaused?: boolean;
    }): NFTData;
    pack(): Field;
    static unpack(packed: Field): NFTData;
}
declare const CollectionData_base: (new (value: {
    requireTransferApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    requireUpdateApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    requireSaleApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    requireBuyApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    requireMintApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    canMint: import("o1js/dist/node/lib/provable/bool").Bool;
    canPause: import("o1js/dist/node/lib/provable/bool").Bool;
    canResume: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeCreator: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeBaseUri: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeSaleCommission: import("o1js/dist/node/lib/provable/bool").Bool;
    isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
}) => {
    requireTransferApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    requireUpdateApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    requireSaleApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    requireBuyApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    requireMintApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    canMint: import("o1js/dist/node/lib/provable/bool").Bool;
    canPause: import("o1js/dist/node/lib/provable/bool").Bool;
    canResume: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeCreator: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeBaseUri: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeSaleCommission: import("o1js/dist/node/lib/provable/bool").Bool;
    isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    requireTransferApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    requireUpdateApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    requireSaleApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    requireBuyApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    requireMintApproval: import("o1js/dist/node/lib/provable/bool").Bool;
    canMint: import("o1js/dist/node/lib/provable/bool").Bool;
    canPause: import("o1js/dist/node/lib/provable/bool").Bool;
    canResume: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeCreator: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeBaseUri: import("o1js/dist/node/lib/provable/bool").Bool;
    canChangeSaleCommission: import("o1js/dist/node/lib/provable/bool").Bool;
    isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
}, {
    requireTransferApproval: boolean;
    requireUpdateApproval: boolean;
    requireSaleApproval: boolean;
    requireBuyApproval: boolean;
    requireMintApproval: boolean;
    canMint: boolean;
    canPause: boolean;
    canResume: boolean;
    canChangeName: boolean;
    canChangeCreator: boolean;
    canChangeBaseUri: boolean;
    canChangeSaleCommission: boolean;
    isPaused: boolean;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        requireTransferApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireUpdateApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireSaleApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireBuyApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireMintApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        canMint: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        canResume: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeCreator: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeBaseUri: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeSaleCommission: import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    };
} & {
    fromValue: (value: {
        requireTransferApproval: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        requireUpdateApproval: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        requireSaleApproval: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        requireBuyApproval: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        requireMintApproval: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canMint: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canResume: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeCreator: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeBaseUri: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeSaleCommission: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        requireTransferApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireUpdateApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireSaleApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireBuyApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireMintApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        canMint: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        canResume: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeCreator: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeBaseUri: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeSaleCommission: import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    };
    toInput: (x: {
        requireTransferApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireUpdateApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireSaleApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireBuyApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireMintApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        canMint: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        canResume: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeCreator: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeBaseUri: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeSaleCommission: import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        requireTransferApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireUpdateApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireSaleApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireBuyApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireMintApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        canMint: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        canResume: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeCreator: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeBaseUri: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeSaleCommission: import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    }) => {
        requireTransferApproval: boolean;
        requireUpdateApproval: boolean;
        requireSaleApproval: boolean;
        requireBuyApproval: boolean;
        requireMintApproval: boolean;
        canMint: boolean;
        canPause: boolean;
        canResume: boolean;
        canChangeName: boolean;
        canChangeCreator: boolean;
        canChangeBaseUri: boolean;
        canChangeSaleCommission: boolean;
        isPaused: boolean;
    };
    fromJSON: (x: {
        requireTransferApproval: boolean;
        requireUpdateApproval: boolean;
        requireSaleApproval: boolean;
        requireBuyApproval: boolean;
        requireMintApproval: boolean;
        canMint: boolean;
        canPause: boolean;
        canResume: boolean;
        canChangeName: boolean;
        canChangeCreator: boolean;
        canChangeBaseUri: boolean;
        canChangeSaleCommission: boolean;
        isPaused: boolean;
    }) => {
        requireTransferApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireUpdateApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireSaleApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireBuyApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireMintApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        canMint: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        canResume: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeCreator: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeBaseUri: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeSaleCommission: import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    };
    empty: () => {
        requireTransferApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireUpdateApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireSaleApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireBuyApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        requireMintApproval: import("o1js/dist/node/lib/provable/bool").Bool;
        canMint: import("o1js/dist/node/lib/provable/bool").Bool;
        canPause: import("o1js/dist/node/lib/provable/bool").Bool;
        canResume: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeName: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeCreator: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeBaseUri: import("o1js/dist/node/lib/provable/bool").Bool;
        canChangeSaleCommission: import("o1js/dist/node/lib/provable/bool").Bool;
        isPaused: import("o1js/dist/node/lib/provable/bool").Bool;
    };
};
declare class CollectionData extends CollectionData_base {
    pack(): Field;
    static unpack(packed: Field): CollectionData;
}
declare const MintParams_base: (new (value: {
    name: import("o1js/dist/node/lib/provable/field").Field;
    address: PublicKey;
    tokenId: import("o1js/dist/node/lib/provable/field").Field;
    owner: PublicKey;
    data: NFTData;
    fee: UInt64;
    metadata: import("o1js/dist/node/lib/provable/field").Field;
    storage: Storage;
    metadataVerificationKey: VerificationKey;
    nftVerificationKey: VerificationKey;
    expiry: UInt32;
}) => {
    name: import("o1js/dist/node/lib/provable/field").Field;
    address: PublicKey;
    tokenId: import("o1js/dist/node/lib/provable/field").Field;
    owner: PublicKey;
    data: NFTData;
    fee: UInt64;
    metadata: import("o1js/dist/node/lib/provable/field").Field;
    storage: Storage;
    metadataVerificationKey: VerificationKey;
    nftVerificationKey: VerificationKey;
    expiry: UInt32;
}) & {
    _isStruct: true;
} & Provable<{
    name: import("o1js/dist/node/lib/provable/field").Field;
    address: PublicKey;
    tokenId: import("o1js/dist/node/lib/provable/field").Field;
    owner: PublicKey;
    data: NFTData;
    fee: UInt64;
    metadata: import("o1js/dist/node/lib/provable/field").Field;
    storage: Storage;
    metadataVerificationKey: VerificationKey;
    nftVerificationKey: VerificationKey;
    expiry: UInt32;
}, {
    name: bigint;
    address: {
        x: bigint;
        isOdd: boolean;
    };
    tokenId: bigint;
    owner: {
        x: bigint;
        isOdd: boolean;
    };
    data: {
        price: bigint;
        version: bigint;
        canChangeOwner: boolean;
        canChangeMetadata: boolean;
        canChangePrice: boolean;
        canChangeStorage: boolean;
        canChangeName: boolean;
        canChangeMetadataVerificationKeyHash: boolean;
        canPause: boolean;
        isPaused: boolean;
    };
    fee: bigint;
    metadata: bigint;
    storage: {
        url: bigint[];
    };
    metadataVerificationKey: {
        data: string;
        hash: bigint;
    };
    nftVerificationKey: {
        data: string;
        hash: bigint;
    };
    expiry: bigint;
}> & {
    fromValue: (value: {
        name: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        address: PublicKey | {
            x: Field | bigint;
            isOdd: Bool | boolean;
        };
        tokenId: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        owner: PublicKey | {
            x: Field | bigint;
            isOdd: Bool | boolean;
        };
        data: NFTData | {
            price: bigint | UInt64;
            version: bigint | UInt32;
            canChangeOwner: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            canChangeMetadata: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            canChangePrice: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            canChangeStorage: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            canChangeName: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            canChangeMetadataVerificationKeyHash: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            canPause: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
            isPaused: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        };
        fee: bigint | UInt64;
        metadata: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage | {
            url: import("o1js/dist/node/lib/provable/field").Field[] | bigint[];
        };
        metadataVerificationKey: VerificationKey | {
            data: string;
            hash: import("o1js/dist/node/lib/provable/field").Field;
        } | {
            data: string;
            hash: bigint;
        };
        nftVerificationKey: VerificationKey | {
            data: string;
            hash: import("o1js/dist/node/lib/provable/field").Field;
        } | {
            data: string;
            hash: bigint;
        };
        expiry: bigint | UInt32;
    }) => {
        name: import("o1js/dist/node/lib/provable/field").Field;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
        owner: PublicKey;
        data: NFTData;
        fee: UInt64;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        metadataVerificationKey: VerificationKey;
        nftVerificationKey: VerificationKey;
        expiry: UInt32;
    };
    toInput: (x: {
        name: import("o1js/dist/node/lib/provable/field").Field;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
        owner: PublicKey;
        data: NFTData;
        fee: UInt64;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        metadataVerificationKey: VerificationKey;
        nftVerificationKey: VerificationKey;
        expiry: UInt32;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        name: import("o1js/dist/node/lib/provable/field").Field;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
        owner: PublicKey;
        data: NFTData;
        fee: UInt64;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        metadataVerificationKey: VerificationKey;
        nftVerificationKey: VerificationKey;
        expiry: UInt32;
    }) => {
        name: string;
        address: string;
        tokenId: string;
        owner: string;
        data: {
            price: string;
            version: string;
            canChangeOwner: boolean;
            canChangeMetadata: boolean;
            canChangePrice: boolean;
            canChangeStorage: boolean;
            canChangeName: boolean;
            canChangeMetadataVerificationKeyHash: boolean;
            canPause: boolean;
            isPaused: boolean;
        };
        fee: string;
        metadata: string;
        storage: {
            url: string[];
        };
        metadataVerificationKey: string;
        nftVerificationKey: string;
        expiry: string;
    };
    fromJSON: (x: {
        name: string;
        address: string;
        tokenId: string;
        owner: string;
        data: {
            price: string;
            version: string;
            canChangeOwner: boolean;
            canChangeMetadata: boolean;
            canChangePrice: boolean;
            canChangeStorage: boolean;
            canChangeName: boolean;
            canChangeMetadataVerificationKeyHash: boolean;
            canPause: boolean;
            isPaused: boolean;
        };
        fee: string;
        metadata: string;
        storage: {
            url: string[];
        };
        metadataVerificationKey: string;
        nftVerificationKey: string;
        expiry: string;
    }) => {
        name: import("o1js/dist/node/lib/provable/field").Field;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
        owner: PublicKey;
        data: NFTData;
        fee: UInt64;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        metadataVerificationKey: VerificationKey;
        nftVerificationKey: VerificationKey;
        expiry: UInt32;
    };
    empty: () => {
        name: import("o1js/dist/node/lib/provable/field").Field;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
        owner: PublicKey;
        data: NFTData;
        fee: UInt64;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        metadataVerificationKey: VerificationKey;
        nftVerificationKey: VerificationKey;
        expiry: UInt32;
    };
};
declare class MintParams extends MintParams_base {
}
declare const MintSignatureData_base: (new (value: {
    name: import("o1js/dist/node/lib/provable/field").Field;
    address: PublicKey;
    tokenId: import("o1js/dist/node/lib/provable/field").Field;
    owner: PublicKey;
    packedData: import("o1js/dist/node/lib/provable/field").Field;
    fee: UInt64;
    metadata: import("o1js/dist/node/lib/provable/field").Field;
    storage: Storage;
    metadataVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
    nftVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
    expiry: UInt32;
}) => {
    name: import("o1js/dist/node/lib/provable/field").Field;
    address: PublicKey;
    tokenId: import("o1js/dist/node/lib/provable/field").Field;
    owner: PublicKey;
    packedData: import("o1js/dist/node/lib/provable/field").Field;
    fee: UInt64;
    metadata: import("o1js/dist/node/lib/provable/field").Field;
    storage: Storage;
    metadataVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
    nftVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
    expiry: UInt32;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    name: import("o1js/dist/node/lib/provable/field").Field;
    address: PublicKey;
    tokenId: import("o1js/dist/node/lib/provable/field").Field;
    owner: PublicKey;
    packedData: import("o1js/dist/node/lib/provable/field").Field;
    fee: UInt64;
    metadata: import("o1js/dist/node/lib/provable/field").Field;
    storage: Storage;
    metadataVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
    nftVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
    expiry: UInt32;
}, {
    name: bigint;
    address: {
        x: bigint;
        isOdd: boolean;
    };
    tokenId: bigint;
    owner: {
        x: bigint;
        isOdd: boolean;
    };
    packedData: bigint;
    fee: bigint;
    metadata: bigint;
    storage: {
        url: bigint[];
    };
    metadataVerificationKeyHash: bigint;
    nftVerificationKeyHash: bigint;
    expiry: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        name: import("o1js/dist/node/lib/provable/field").Field;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
        owner: PublicKey;
        packedData: import("o1js/dist/node/lib/provable/field").Field;
        fee: UInt64;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        metadataVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
        nftVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
        expiry: UInt32;
    };
} & {
    fromValue: (value: {
        name: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        address: PublicKey | {
            x: Field | bigint;
            isOdd: Bool | boolean;
        };
        tokenId: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        owner: PublicKey | {
            x: Field | bigint;
            isOdd: Bool | boolean;
        };
        packedData: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        fee: bigint | UInt64;
        metadata: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage | {
            url: import("o1js/dist/node/lib/provable/field").Field[] | bigint[];
        };
        metadataVerificationKeyHash: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        nftVerificationKeyHash: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        expiry: bigint | UInt32;
    }) => {
        name: import("o1js/dist/node/lib/provable/field").Field;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
        owner: PublicKey;
        packedData: import("o1js/dist/node/lib/provable/field").Field;
        fee: UInt64;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        metadataVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
        nftVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
        expiry: UInt32;
    };
    toInput: (x: {
        name: import("o1js/dist/node/lib/provable/field").Field;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
        owner: PublicKey;
        packedData: import("o1js/dist/node/lib/provable/field").Field;
        fee: UInt64;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        metadataVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
        nftVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
        expiry: UInt32;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        name: import("o1js/dist/node/lib/provable/field").Field;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
        owner: PublicKey;
        packedData: import("o1js/dist/node/lib/provable/field").Field;
        fee: UInt64;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        metadataVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
        nftVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
        expiry: UInt32;
    }) => {
        name: string;
        address: string;
        tokenId: string;
        owner: string;
        packedData: string;
        fee: string;
        metadata: string;
        storage: {
            url: string[];
        };
        metadataVerificationKeyHash: string;
        nftVerificationKeyHash: string;
        expiry: string;
    };
    fromJSON: (x: {
        name: string;
        address: string;
        tokenId: string;
        owner: string;
        packedData: string;
        fee: string;
        metadata: string;
        storage: {
            url: string[];
        };
        metadataVerificationKeyHash: string;
        nftVerificationKeyHash: string;
        expiry: string;
    }) => {
        name: import("o1js/dist/node/lib/provable/field").Field;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
        owner: PublicKey;
        packedData: import("o1js/dist/node/lib/provable/field").Field;
        fee: UInt64;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        metadataVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
        nftVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
        expiry: UInt32;
    };
    empty: () => {
        name: import("o1js/dist/node/lib/provable/field").Field;
        address: PublicKey;
        tokenId: import("o1js/dist/node/lib/provable/field").Field;
        owner: PublicKey;
        packedData: import("o1js/dist/node/lib/provable/field").Field;
        fee: UInt64;
        metadata: import("o1js/dist/node/lib/provable/field").Field;
        storage: Storage;
        metadataVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
        nftVerificationKeyHash: import("o1js/dist/node/lib/provable/field").Field;
        expiry: UInt32;
    };
};
declare class MintSignatureData extends MintSignatureData_base {
}
type NFTAdminBase = SmartContract & {
    canMint(nft: MintParams): Promise<Bool>;
    canUpdate(input: NFTState, output: NFTState): Promise<Bool>;
    canTransfer(address: PublicKey, from: PublicKey, to: PublicKey): Promise<Bool>;
    canSell(address: PublicKey, seller: PublicKey, price: UInt64): Promise<Bool>;
    canBuy(address: PublicKey, seller: PublicKey, buyer: PublicKey, price: UInt64): Promise<Bool>;
};
