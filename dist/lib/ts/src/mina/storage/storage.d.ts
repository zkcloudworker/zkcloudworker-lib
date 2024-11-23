import { Field, Bool } from "o1js";
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
/**
 * Represents the off-chain storage information,
 * such as an IPFS hash.
 */
export declare class Storage extends Storage_base {
    constructor(value: {
        url: [Field, Field];
    });
    /**
     * Asserts that two Storage instances are equal.
     * @param a The first Storage instance.
     * @param b The second Storage instance.
     */
    static assertEquals(a: Storage, b: Storage): void;
    /**
     * Checks if two Storage instances are equal.
     * @param a The first Storage instance.
     * @param b The second Storage instance.
     * @returns A Bool indicating whether the two instances are equal.
     */
    static equals(a: Storage, b: Storage): Bool;
    /**
     * Creates a Storage instance from a string.
     * @param url The string representing the storage URL.
     * @returns A new Storage instance.
     */
    static fromString(url: string): Storage;
    /**
     * Converts the Storage instance to a string.
     * @returns The string representation of the storage URL.
     */
    toString(): string;
}
export {};
