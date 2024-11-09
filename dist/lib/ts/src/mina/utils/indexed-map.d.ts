import { Experimental } from "o1js";
declare const IndexedMerkleMap: typeof import("o1js/dist/node/lib/provable/merkle-tree-indexed").IndexedMerkleMap;
type IndexedMerkleMap = Experimental.IndexedMerkleMap;
export declare function loadIndexedMerkleMap(params: {
    url: string;
    type: ReturnType<typeof IndexedMerkleMap>;
}): Promise<import("o1js/dist/node/lib/provable/merkle-tree-indexed").IndexedMerkleMapBase>;
interface IndexedMapSerialized {
    height: number;
    root: string;
    length: string;
    nodes: string;
    sortedLeaves: string;
}
export declare function serializeIndexedMap(map: IndexedMerkleMap): string;
export declare function deserializeIndexedMerkleMap(params: {
    serializedIndexedMap: string;
    type?: ReturnType<typeof IndexedMerkleMap>;
}): InstanceType<ReturnType<typeof IndexedMerkleMap>> | undefined;
export declare function parseIndexedMapSerialized(serializedMap: string): IndexedMapSerialized;
export {};
