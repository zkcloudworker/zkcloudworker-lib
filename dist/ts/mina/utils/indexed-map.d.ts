import { Experimental } from "o1js";
declare const IndexedMerkleMap: typeof import("node_modules/o1js/dist/node/lib/provable/merkle-tree-indexed.js").IndexedMerkleMap;
type IndexedMerkleMap = Experimental.IndexedMerkleMap;
export interface IndexedMapSerialized {
    height: number;
    root: string;
    length: string;
    nodes: string;
    sortedLeaves: string;
}
export declare function loadIndexedMerkleMap(params: {
    url: string;
    type: ReturnType<typeof IndexedMerkleMap>;
    timeout?: number;
    attempts?: number;
}): Promise<import("node_modules/o1js/dist/node/lib/provable/merkle-tree-indexed.js").IndexedMerkleMapBase>;
export declare function saveIndexedMerkleMap(params: {
    map: IndexedMerkleMap;
    name?: string;
    keyvalues?: {
        key: string;
        value: string;
    }[];
    auth: string;
}): Promise<string | undefined>;
export declare function serializeIndexedMap(map: IndexedMerkleMap): IndexedMapSerialized;
export declare function deserializeIndexedMerkleMap(params: {
    serializedIndexedMap: IndexedMapSerialized;
    type?: ReturnType<typeof IndexedMerkleMap>;
}): InstanceType<ReturnType<typeof IndexedMerkleMap>> | undefined;
export declare function parseIndexedMapSerialized(serializedMap: string): IndexedMapSerialized;
export {};
