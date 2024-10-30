"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTUpdateProof = exports.NFTImmutableState = exports.NFTState = exports.CollectionData = exports.NFTData = exports.MintSignatureData = exports.MintParams = exports.Storage = void 0;
const o1js_1 = require("o1js");
class Storage extends (0, o1js_1.Struct)({
    url: o1js_1.Provable.Array(o1js_1.Field, 2),
}) {
    constructor(value) {
        super(value);
    }
    static assertEquals(a, b) {
        a.url[0].assertEquals(b.url[0]);
        a.url[1].assertEquals(b.url[1]);
    }
    static equals(a, b) {
        return a.url[0].equals(b.url[0]).and(a.url[1].equals(b.url[1]));
    }
    static fromURL(url) {
        const fields = o1js_1.Encoding.stringToFields(url);
        if (fields.length !== 2)
            throw new Error("Invalid URL");
        return new Storage({ url: [fields[0], fields[1]] });
    }
    toURL() {
        return o1js_1.Encoding.stringFromFields(this.url);
    }
}
exports.Storage = Storage;
class NFTImmutableState extends (0, o1js_1.Struct)({
    creator: o1js_1.PublicKey, // readonly
    canChangeOwner: o1js_1.Bool, // readonly
    canChangeMetadata: o1js_1.Bool, // readonly
    canChangePrice: o1js_1.Bool, // readonly
    canChangeStorage: o1js_1.Bool, // readonly
    canChangeName: o1js_1.Bool, // readonly
    canChangeMetadataVerificationKeyHash: o1js_1.Bool, // readonly
    canPause: o1js_1.Bool, // readonly
    address: o1js_1.PublicKey, // readonly
    tokenId: o1js_1.Field, // readonly
}) {
    static assertEqual(a, b) {
        a.creator.assertEquals(b.creator);
        a.canChangeOwner.assertEquals(b.canChangeOwner);
        a.canChangeMetadata.assertEquals(b.canChangeMetadata);
        a.canChangePrice.assertEquals(b.canChangePrice);
        a.canChangeStorage.assertEquals(b.canChangeStorage);
        a.canChangeName.assertEquals(b.canChangeName);
        a.canChangeMetadataVerificationKeyHash.assertEquals(b.canChangeMetadataVerificationKeyHash);
        a.canPause.assertEquals(b.canPause);
        a.address.assertEquals(b.address);
        a.tokenId.assertEquals(b.tokenId);
    }
}
exports.NFTImmutableState = NFTImmutableState;
class NFTState extends (0, o1js_1.Struct)({
    immutableState: NFTImmutableState,
    name: o1js_1.Field,
    metadata: o1js_1.Field,
    storage: Storage,
    owner: o1js_1.PublicKey,
    price: o1js_1.UInt64,
    version: o1js_1.UInt32,
    isPaused: o1js_1.Bool,
}) {
    static assertEqual(a, b) {
        NFTImmutableState.assertEqual(a.immutableState, b.immutableState);
        a.name.assertEquals(b.name);
        a.metadata.assertEquals(b.metadata);
        Storage.assertEquals(a.storage, b.storage);
        a.owner.assertEquals(b.owner);
        a.price.assertEquals(b.price);
        a.version.assertEquals(b.version);
        a.isPaused.assertEquals(b.isPaused);
    }
}
exports.NFTState = NFTState;
class NFTUpdateProof extends o1js_1.DynamicProof {
}
exports.NFTUpdateProof = NFTUpdateProof;
NFTUpdateProof.publicInputType = NFTState;
NFTUpdateProof.publicOutputType = NFTState;
NFTUpdateProof.maxProofsVerified = 2;
NFTUpdateProof.featureFlags = o1js_1.FeatureFlags.allMaybe;
class NFTData extends (0, o1js_1.Struct)({
    price: o1js_1.UInt64,
    version: o1js_1.UInt32,
    canChangeOwner: o1js_1.Bool, // readonly
    canChangeMetadata: o1js_1.Bool, // readonly
    canChangePrice: o1js_1.Bool, // readonly
    canChangeStorage: o1js_1.Bool, // readonly
    canChangeName: o1js_1.Bool, // readonly
    canChangeMetadataVerificationKeyHash: o1js_1.Bool, // readonly
    canPause: o1js_1.Bool, // readonly
    isPaused: o1js_1.Bool,
    // what else?
}) {
    new(params = {}) {
        const { price, version, canChangeOwner, canChangeMetadata, canChangePrice, canChangeStorage, canChangeName, canChangeMetadataVerificationKeyHash, canPause, isPaused, } = params;
        return new NFTData({
            price: o1js_1.UInt64.from(price ?? 0),
            version: o1js_1.UInt32.from(version ?? 0),
            canChangeOwner: (0, o1js_1.Bool)(canChangeOwner ?? true),
            canChangeMetadata: (0, o1js_1.Bool)(canChangeMetadata ?? false),
            canChangePrice: (0, o1js_1.Bool)(canChangePrice ?? true),
            canChangeStorage: (0, o1js_1.Bool)(canChangeStorage ?? false),
            canChangeName: (0, o1js_1.Bool)(canChangeName ?? false),
            canChangeMetadataVerificationKeyHash: (0, o1js_1.Bool)(canChangeMetadataVerificationKeyHash ?? false),
            canPause: (0, o1js_1.Bool)(canPause ?? false),
            isPaused: (0, o1js_1.Bool)(isPaused ?? false),
        });
    }
    pack() {
        const price = this.price.value.toBits(64);
        const version = this.version.value.toBits(32);
        return o1js_1.Field.fromBits([
            ...price,
            ...version,
            this.canChangeOwner,
            this.canChangeMetadata,
            this.canChangePrice,
            this.canChangeStorage,
            this.canChangeName,
            this.canChangeMetadataVerificationKeyHash,
            this.canPause,
            this.isPaused,
        ]);
    }
    static unpack(packed) {
        const bits = packed.toBits(64 + 32 + 8);
        const price = o1js_1.UInt64.Unsafe.fromField(o1js_1.Field.fromBits(bits.slice(0, 64)));
        const version = o1js_1.UInt32.Unsafe.fromField(o1js_1.Field.fromBits(bits.slice(64, 64 + 32)));
        const canChangeOwner = bits[64 + 32];
        const canChangeMetadata = bits[64 + 32 + 1];
        const canChangePrice = bits[64 + 32 + 2];
        const canChangeStorage = bits[64 + 32 + 3];
        const canChangeName = bits[64 + 32 + 4];
        const canChangeMetadataVerificationKeyHash = bits[64 + 32 + 5];
        const canPause = bits[64 + 32 + 6];
        const isPaused = bits[64 + 32 + 7];
        return new NFTData({
            price,
            version,
            canChangeOwner,
            canChangeMetadata,
            canChangePrice,
            canChangeStorage,
            canChangeName,
            canChangeMetadataVerificationKeyHash,
            canPause,
            isPaused,
        });
    }
}
exports.NFTData = NFTData;
class CollectionData extends (0, o1js_1.Struct)({
    requireTransferApproval: o1js_1.Bool,
    requireUpdateApproval: o1js_1.Bool,
    requireSaleApproval: o1js_1.Bool,
    requireBuyApproval: o1js_1.Bool,
    requireMintApproval: o1js_1.Bool,
    canMint: o1js_1.Bool,
    canPause: o1js_1.Bool,
    canResume: o1js_1.Bool,
    canChangeName: o1js_1.Bool,
    canChangeCreator: o1js_1.Bool,
    canChangeBaseUri: o1js_1.Bool,
    canChangeSaleCommission: o1js_1.Bool,
    isPaused: o1js_1.Bool,
}) {
    pack() {
        return o1js_1.Field.fromBits([
            this.requireTransferApproval,
            this.requireUpdateApproval,
            this.requireSaleApproval,
            this.requireMintApproval,
            this.requireBuyApproval,
            this.canMint,
            this.canChangeName,
            this.canChangeCreator,
            this.canChangeBaseUri,
            this.canChangeSaleCommission,
            this.canPause,
            this.canResume,
            this.isPaused,
        ]);
    }
    static unpack(packed) {
        const bits = packed.toBits(13);
        return new CollectionData({
            requireTransferApproval: bits[0],
            requireUpdateApproval: bits[1],
            requireSaleApproval: bits[2],
            requireMintApproval: bits[3],
            requireBuyApproval: bits[4],
            canMint: bits[5],
            canChangeName: bits[6],
            canChangeCreator: bits[7],
            canChangeBaseUri: bits[8],
            canChangeSaleCommission: bits[9],
            canPause: bits[10],
            canResume: bits[11],
            isPaused: bits[12],
        });
    }
}
exports.CollectionData = CollectionData;
class MintParams extends (0, o1js_1.Struct)({
    name: o1js_1.Field,
    address: o1js_1.PublicKey,
    tokenId: o1js_1.Field,
    owner: o1js_1.PublicKey,
    data: NFTData,
    fee: o1js_1.UInt64,
    metadata: o1js_1.Field,
    storage: Storage,
    metadataVerificationKey: o1js_1.VerificationKey,
    nftVerificationKey: o1js_1.VerificationKey,
    expiry: o1js_1.UInt32,
}) {
}
exports.MintParams = MintParams;
class MintSignatureData extends (0, o1js_1.Struct)({
    name: o1js_1.Field,
    address: o1js_1.PublicKey,
    tokenId: o1js_1.Field,
    owner: o1js_1.PublicKey,
    packedData: o1js_1.Field,
    fee: o1js_1.UInt64,
    metadata: o1js_1.Field,
    storage: Storage,
    metadataVerificationKeyHash: o1js_1.Field,
    nftVerificationKeyHash: o1js_1.Field,
    expiry: o1js_1.UInt32,
}) {
}
exports.MintSignatureData = MintSignatureData;
