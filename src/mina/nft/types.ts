import {
  Field,
  PublicKey,
  Bool,
  VerificationKey,
  Struct,
  UInt32,
  UInt64,
  Encoding,
  Provable,
  DynamicProof,
  FeatureFlags,
  SmartContract,
} from "o1js";
export {
  Storage,
  MintParams,
  MintSignatureData,
  NFTData,
  CollectionData,
  NFTState,
  NFTImmutableState,
  NFTUpdateProof,
  NFTAdminBase,
};

class Storage extends Struct({
  url: Provable.Array(Field, 2),
}) {
  constructor(value: { url: [Field, Field] }) {
    super(value);
  }

  static assertEquals(a: Storage, b: Storage) {
    a.url[0].assertEquals(b.url[0]);
    a.url[1].assertEquals(b.url[1]);
  }

  static equals(a: Storage, b: Storage): Bool {
    return a.url[0].equals(b.url[0]).and(a.url[1].equals(b.url[1]));
  }

  static fromURL(url: string): Storage {
    const fields = Encoding.stringToFields(url);
    if (fields.length !== 2) throw new Error("Invalid URL");
    return new Storage({ url: [fields[0], fields[1]] });
  }

  toURL(): string {
    return Encoding.stringFromFields(this.url);
  }
}

class NFTImmutableState extends Struct({
  creator: PublicKey, // readonly
  canChangeOwner: Bool, // readonly
  canChangeMetadata: Bool, // readonly
  canChangePrice: Bool, // readonly
  canChangeStorage: Bool, // readonly
  canChangeName: Bool, // readonly
  canChangeMetadataVerificationKeyHash: Bool, // readonly
  canPause: Bool, // readonly
  address: PublicKey, // readonly
  tokenId: Field, // readonly
}) {
  static assertEqual(a: NFTImmutableState, b: NFTImmutableState) {
    a.creator.assertEquals(b.creator);
    a.canChangeOwner.assertEquals(b.canChangeOwner);
    a.canChangeMetadata.assertEquals(b.canChangeMetadata);
    a.canChangePrice.assertEquals(b.canChangePrice);
    a.canChangeStorage.assertEquals(b.canChangeStorage);
    a.canChangeName.assertEquals(b.canChangeName);
    a.canChangeMetadataVerificationKeyHash.assertEquals(
      b.canChangeMetadataVerificationKeyHash
    );
    a.canPause.assertEquals(b.canPause);
    a.address.assertEquals(b.address);
    a.tokenId.assertEquals(b.tokenId);
  }
}

class NFTState extends Struct({
  immutableState: NFTImmutableState,
  name: Field,
  metadata: Field,
  storage: Storage,
  owner: PublicKey,
  price: UInt64,
  version: UInt32,
  isPaused: Bool,
}) {
  static assertEqual(a: NFTState, b: NFTState) {
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

class NFTUpdateProof extends DynamicProof<NFTState, NFTState> {
  static publicInputType = NFTState;
  static publicOutputType = NFTState;
  static maxProofsVerified = 2 as const;
  static featureFlags = FeatureFlags.allMaybe;
}

class NFTData extends Struct({
  price: UInt64,
  version: UInt32,
  canChangeOwner: Bool, // readonly
  canChangeMetadata: Bool, // readonly
  canChangePrice: Bool, // readonly
  canChangeStorage: Bool, // readonly
  canChangeName: Bool, // readonly
  canChangeMetadataVerificationKeyHash: Bool, // readonly
  canPause: Bool, // readonly
  isPaused: Bool,
  // what else?
}) {
  new(
    params: {
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
    } = {}
  ) {
    const {
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
    } = params;
    return new NFTData({
      price: UInt64.from(price ?? 0),
      version: UInt32.from(version ?? 0),
      canChangeOwner: Bool(canChangeOwner ?? true),
      canChangeMetadata: Bool(canChangeMetadata ?? false),
      canChangePrice: Bool(canChangePrice ?? true),
      canChangeStorage: Bool(canChangeStorage ?? false),
      canChangeName: Bool(canChangeName ?? false),
      canChangeMetadataVerificationKeyHash: Bool(
        canChangeMetadataVerificationKeyHash ?? false
      ),
      canPause: Bool(canPause ?? false),
      isPaused: Bool(isPaused ?? false),
    });
  }

  pack(): Field {
    const price = this.price.value.toBits(64);
    const version = this.version.value.toBits(32);
    return Field.fromBits([
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
  static unpack(packed: Field) {
    const bits = packed.toBits(64 + 32 + 8);
    const price = UInt64.Unsafe.fromField(Field.fromBits(bits.slice(0, 64)));
    const version = UInt32.Unsafe.fromField(
      Field.fromBits(bits.slice(64, 64 + 32))
    );
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

class CollectionData extends Struct({
  requireTransferApproval: Bool,
  requireUpdateApproval: Bool,
  requireSaleApproval: Bool,
  requireBuyApproval: Bool,
  requireMintApproval: Bool,
  canMint: Bool,
  canPause: Bool,
  canResume: Bool,
  canChangeName: Bool,
  canChangeCreator: Bool,
  canChangeBaseUri: Bool,
  canChangeSaleCommission: Bool,
  isPaused: Bool,
}) {
  pack(): Field {
    return Field.fromBits([
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
  static unpack(packed: Field) {
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

class MintParams extends Struct({
  name: Field,
  address: PublicKey,
  tokenId: Field,
  owner: PublicKey,
  data: NFTData,
  fee: UInt64,
  metadata: Field,
  storage: Storage,
  metadataVerificationKey: VerificationKey,
  nftVerificationKey: VerificationKey,
  expiry: UInt32,
}) {}

class MintSignatureData extends Struct({
  name: Field,
  address: PublicKey,
  tokenId: Field,
  owner: PublicKey,
  packedData: Field,
  fee: UInt64,
  metadata: Field,
  storage: Storage,
  metadataVerificationKeyHash: Field,
  nftVerificationKeyHash: Field,
  expiry: UInt32,
}) {}

type NFTAdminBase = SmartContract & {
  canMint(nft: MintParams): Promise<Bool>;
  canUpdate(input: NFTState, output: NFTState): Promise<Bool>;
  canTransfer(
    address: PublicKey,
    from: PublicKey,
    to: PublicKey
  ): Promise<Bool>;
  canSell(address: PublicKey, seller: PublicKey, price: UInt64): Promise<Bool>;
  canBuy(
    address: PublicKey,
    seller: PublicKey,
    buyer: PublicKey,
    price: UInt64
  ): Promise<Bool>;
};
