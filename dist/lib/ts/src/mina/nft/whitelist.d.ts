import { Storage } from "./types";
declare const IndexedMerkleMap: typeof import("o1js/dist/node/lib/provable/merkle-tree-indexed").IndexedMerkleMap;
declare const Whitelist_base: typeof import("o1js/dist/node/lib/provable/merkle-tree-indexed").IndexedMerkleMapBase;
export declare class Whitelist extends Whitelist_base {
}
export declare function loadWhitelist(storage: Storage): Promise<Whitelist>;
interface IndexedMapSerialized {
    height: number;
    root: string;
    length: string;
    nodes: string;
    sortedLeaves: string;
}
export declare function serializeWhitelist(map: Whitelist): string;
export declare function deserializeWhitelist(params: {
    serializedIndexedMap: string;
    type?: ReturnType<typeof IndexedMerkleMap>;
}): InstanceType<ReturnType<typeof IndexedMerkleMap>> | undefined;
export declare function parseIndexedMapSerialized(serializedMap: string): IndexedMapSerialized;
export {};
