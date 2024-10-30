"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whitelist = void 0;
exports.loadWhitelist = loadWhitelist;
exports.serializeWhitelist = serializeWhitelist;
exports.deserializeWhitelist = deserializeWhitelist;
exports.parseIndexedMapSerialized = parseIndexedMapSerialized;
const o1js_1 = require("o1js");
const cloud_1 = require("../../cloud");
const { IndexedMerkleMap } = o1js_1.Experimental;
class Whitelist extends IndexedMerkleMap(10) {
}
exports.Whitelist = Whitelist;
async function loadWhitelist(storage) {
    const url = "https://gateway.pinata.cloud/ipfs/" + storage.toURL();
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch whitelist");
    }
    const json = await response.json();
    const map = deserializeWhitelist({
        serializedIndexedMap: json,
        type: Whitelist,
    });
    if (!map) {
        throw new Error("Failed to deserialize whitelist");
    }
    return map;
}
function serializeWhitelist(map) {
    const serializedMap = JSON.stringify({
        height: map.height,
        root: map.root.toJSON(),
        length: map.length.toJSON(),
        nodes: JSON.stringify(map.data.get().nodes, (_, v) => typeof v === "bigint" ? "n" + (0, cloud_1.bigintToBase64)(v) : v),
        sortedLeaves: JSON.stringify(map.data
            .get()
            .sortedLeaves.map((v) => [
            (0, cloud_1.bigintToBase64)(v.key),
            (0, cloud_1.bigintToBase64)(v.nextKey),
            (0, cloud_1.bigintToBase64)(v.value),
            (0, cloud_1.bigintToBase64)(BigInt(v.index)),
        ])),
    }, null, 2);
    return serializedMap;
}
function deserializeWhitelist(params) {
    try {
        const { serializedIndexedMap, type } = params;
        const json = parseIndexedMapSerialized(serializedIndexedMap);
        return deserializeIndexedMapInternal({
            json,
            type: type ?? IndexedMerkleMap(json.height),
        });
    }
    catch (error) {
        console.error("Error deserializing map:", error?.message ?? error);
        return undefined;
    }
}
function parseIndexedMapSerialized(serializedMap) {
    const json = JSON.parse(serializedMap);
    if (json.height === undefined ||
        json.root === undefined ||
        json.length === undefined ||
        json.nodes === undefined ||
        json.sortedLeaves === undefined)
        throw new Error("wrong IndexedMerkleMap json format");
    if (typeof json.height !== "number")
        throw new Error("wrong IndexedMerkleMap height format");
    if (typeof json.root !== "string")
        throw new Error("wrong IndexedMerkleMap root format");
    if (typeof json.length !== "string")
        throw new Error("wrong IndexedMerkleMap length format");
    if (typeof json.nodes !== "string")
        throw new Error("wrong IndexedMerkleMap nodes format");
    if (typeof json.sortedLeaves !== "string")
        throw new Error("wrong IndexedMerkleMap sortedLeaves format");
    return json;
}
function deserializeIndexedMapInternal(params) {
    const { json, type } = params;
    const map = new type();
    if (json.height !== map.height) {
        throw new Error("wrong IndexedMap height");
    }
    const nodes = JSON.parse(json.nodes, (_, v) => {
        // Check if the value is a string that represents a BigInt
        if (typeof v === "string" && v[0] === "n") {
            // Remove the first 'n' and convert the string to a BigInt
            return (0, cloud_1.bigintFromBase64)(v.slice(1));
        }
        return v;
    });
    const sortedLeaves = JSON.parse(json.sortedLeaves).map((row) => {
        return {
            key: (0, cloud_1.bigintFromBase64)(row[0]),
            nextKey: (0, cloud_1.bigintFromBase64)(row[1]),
            value: (0, cloud_1.bigintFromBase64)(row[2]),
            index: Number((0, cloud_1.bigintFromBase64)(row[3])),
        };
    });
    map.root = o1js_1.Field.fromJSON(json.root);
    map.length = o1js_1.Field.fromJSON(json.length);
    map.data.updateAsProver(() => {
        return {
            nodes: nodes.map((row) => [...row]),
            sortedLeaves: [...sortedLeaves],
        };
    });
    return map;
}
