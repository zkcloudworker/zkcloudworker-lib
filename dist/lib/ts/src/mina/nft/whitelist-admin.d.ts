import { DeployArgs, PublicKey, SmartContract, State, VerificationKey, UInt64, Field } from "o1js";
import { MintParams, NFTState, NFTAdminBase, Storage } from "./types";
export interface NFTWhitelistedAdminDeployProps extends Exclude<DeployArgs, undefined> {
    admin: PublicKey;
    collection: PublicKey;
    whitelist: Field;
    storage: Storage;
}
export declare class NFTWhitelistedAdmin extends SmartContract implements NFTAdminBase {
    collection: State<PublicKey>;
    admin: State<PublicKey>;
    whitelist: State<import("o1js/dist/node/lib/provable/field").Field>;
    storage: State<Storage>;
    deploy(props: NFTWhitelistedAdminDeployProps): Promise<void>;
    isWhitelisted(address: PublicKey, amount: UInt64): Promise<import("o1js/dist/node/lib/provable/bool").Bool>;
    updateVerificationKey(vk: VerificationKey): Promise<void>;
    canMint(params: MintParams): Promise<import("o1js/dist/node/lib/provable/bool").Bool>;
    canUpdate(input: NFTState, output: NFTState): Promise<import("o1js/dist/node/lib/provable/bool").Bool>;
    canTransfer(address: PublicKey, from: PublicKey, to: PublicKey): Promise<import("o1js/dist/node/lib/provable/bool").Bool>;
    canSell(address: PublicKey, seller: PublicKey, price: UInt64): Promise<import("o1js/dist/node/lib/provable/bool").Bool>;
    canBuy(address: PublicKey, seller: PublicKey, buyer: PublicKey, price: UInt64): Promise<import("o1js/dist/node/lib/provable/bool").Bool>;
    updateMerkleMapRoot(root: Field, storage: Storage): Promise<void>;
}
