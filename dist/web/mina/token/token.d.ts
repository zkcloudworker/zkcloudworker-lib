import { FungibleTokenAdminBase } from "./FungibleTokenContract.js";
import { FungibleTokenAdmin, FungibleTokenAdminDeployProps } from "./FungibleTokenAdmin.js";
import { FungibleTokenWhitelistedAdmin, FungibleTokenWhitelistedAdminDeployProps } from "./FungibleTokenWhitelistedAdmin.js";
import { FungibleTokenBidContract, FungibleTokenBidContractDeployProps } from "./bid.js";
import { FungibleTokenOfferContract, FungibleTokenOfferContractDeployProps } from "./offer.js";
export { FungibleToken, WhitelistedFungibleToken, FungibleTokenAdmin, FungibleTokenWhitelistedAdmin, FungibleTokenAdminBase, FungibleTokenBidContract, FungibleTokenOfferContract, FungibleTokenBidContractDeployProps, FungibleTokenOfferContractDeployProps, FungibleTokenAdminDeployProps, FungibleTokenWhitelistedAdminDeployProps, tokenVerificationKeys, };
declare const FungibleToken: {
    new (address: import("o1js").PublicKey, tokenId?: import("o1js").Field): {
        decimals: import("o1js").State<import("o1js").UInt8>;
        admin: import("o1js").State<import("o1js").PublicKey>;
        paused: import("o1js").State<import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool>;
        readonly events: {
            SetAdmin: typeof import("./FungibleTokenContract.js").SetAdminEvent;
            Pause: typeof import("./FungibleTokenContract.js").PauseEvent;
            Mint: typeof import("./FungibleTokenContract.js").MintEvent;
            Burn: typeof import("./FungibleTokenContract.js").BurnEvent;
            BalanceChange: typeof import("./FungibleTokenContract.js").BalanceChangeEvent;
        };
        deploy(props: import("./FungibleTokenContract.js").FungibleTokenDeployProps): Promise<void>;
        updateVerificationKey(vk: import("o1js").VerificationKey): Promise<void>;
        initialize(admin: import("o1js").PublicKey, decimals: import("o1js").UInt8, startPaused: import("o1js").Bool): Promise<void>;
        getAdminContract(): Promise<FungibleTokenAdminBase>;
        setAdmin(admin: import("o1js").PublicKey): Promise<void>;
        mint(recipient: import("o1js").PublicKey, amount: import("o1js").UInt64): Promise<import("o1js").AccountUpdate>;
        burn(from: import("o1js").PublicKey, amount: import("o1js").UInt64): Promise<import("o1js").AccountUpdate>;
        pause(): Promise<void>;
        resume(): Promise<void>;
        transfer(from: import("o1js").PublicKey, to: import("o1js").PublicKey, amount: import("o1js").UInt64): Promise<void>;
        checkPermissionsUpdate(update: import("o1js").AccountUpdate): void;
        approveBase(updates: import("o1js").AccountUpdateForest): Promise<void>;
        getBalanceOf(address: import("o1js").PublicKey): Promise<import("o1js").UInt64>;
        getCirculating(): Promise<import("o1js").UInt64>;
        getDecimals(): Promise<import("o1js").UInt8>;
        deriveTokenId(): import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        readonly internal: {
            mint({ address, amount, }: {
                address: import("o1js").PublicKey | import("o1js").AccountUpdate | import("o1js").SmartContract;
                amount: number | bigint | import("o1js").UInt64;
            }): import("o1js").AccountUpdate;
            burn({ address, amount, }: {
                address: import("o1js").PublicKey | import("o1js").AccountUpdate | import("o1js").SmartContract;
                amount: number | bigint | import("o1js").UInt64;
            }): import("o1js").AccountUpdate;
            send({ from, to, amount, }: {
                from: import("o1js").PublicKey | import("o1js").AccountUpdate | import("o1js").SmartContract;
                to: import("o1js").PublicKey | import("o1js").AccountUpdate | import("o1js").SmartContract;
                amount: number | bigint | import("o1js").UInt64;
            }): import("o1js").AccountUpdate;
        };
        forEachUpdate(updates: import("o1js").AccountUpdateForest, callback: (update: import("o1js").AccountUpdate, usesToken: import("o1js").Bool) => void): void;
        checkZeroBalanceChange(updates: import("o1js").AccountUpdateForest): void;
        approveAccountUpdate(accountUpdate: import("o1js").AccountUpdate | import("o1js").AccountUpdateTree): Promise<void>;
        approveAccountUpdates(accountUpdates: (import("o1js").AccountUpdate | import("o1js").AccountUpdateTree)[]): Promise<void>;
        "__#3@#private": any;
        address: import("o1js").PublicKey;
        tokenId: import("o1js").Field;
        init(): void;
        requireSignature(): void;
        skipAuthorization(): void;
        readonly self: import("o1js").AccountUpdate;
        newSelf(methodName?: string): import("o1js").AccountUpdate;
        sender: {
            self: import("o1js").SmartContract;
            getUnconstrained(): import("o1js").PublicKey;
            getAndRequireSignature(): import("o1js").PublicKey;
        };
        readonly account: import("node_modules/o1js/dist/node/lib/mina/precondition.js").Account;
        readonly network: import("node_modules/o1js/dist/node/lib/mina/precondition.js").Network;
        readonly currentSlot: import("node_modules/o1js/dist/node/lib/mina/precondition.js").CurrentSlot;
        approve(update: import("o1js").AccountUpdate | import("o1js").AccountUpdateTree | import("o1js").AccountUpdateForest): void;
        send(args: {
            to: import("o1js").PublicKey | import("o1js").AccountUpdate | import("o1js").SmartContract;
            amount: number | bigint | import("o1js").UInt64;
        }): import("o1js").AccountUpdate;
        readonly balance: {
            addInPlace(x: string | number | bigint | import("o1js").UInt64 | import("o1js").UInt32 | import("o1js").Int64): void;
            subInPlace(x: string | number | bigint | import("o1js").UInt64 | import("o1js").UInt32 | import("o1js").Int64): void;
        };
        emitEventIf<K extends "SetAdmin" | "Pause" | "Mint" | "Burn" | "BalanceChange">(condition: import("o1js").Bool, type: K, event: any): void;
        emitEvent<K extends "SetAdmin" | "Pause" | "Mint" | "Burn" | "BalanceChange">(type: K, event: any): void;
        fetchEvents(start?: import("o1js").UInt32, end?: import("o1js").UInt32): Promise<{
            type: string;
            event: {
                data: import("o1js").ProvablePure<any>;
                transactionInfo: {
                    transactionHash: string;
                    transactionStatus: string;
                    transactionMemo: string;
                };
            };
            blockHeight: import("o1js").UInt32;
            blockHash: string;
            parentBlockHash: string;
            globalSlot: import("o1js").UInt32;
            chainStatus: string;
        }[]>;
    };
    MAX_ACCOUNT_UPDATES: number;
    _methods?: import("node_modules/o1js/dist/node/lib/proof-system/zkprogram.js").MethodInterface[];
    _methodMetadata?: Record<string, {
        actions: number;
        rows: number;
        digest: string;
        gates: import("node_modules/o1js/dist/node/snarky.js").Gate[];
    }>;
    _provers?: import("node_modules/o1js/dist/node/snarky.js").Pickles.Prover[];
    _maxProofsVerified?: 0 | 1 | 2;
    _verificationKey?: {
        data: string;
        hash: import("o1js").Field;
    };
    Proof(): {
        new ({ proof, publicInput, publicOutput, maxProofsVerified, }: {
            proof: unknown;
            publicInput: import("o1js").ZkappPublicInput;
            publicOutput: undefined;
            maxProofsVerified: 0 | 2 | 1;
        }): {
            verify(): void;
            verifyIf(condition: import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool): void;
            publicInput: import("o1js").ZkappPublicInput;
            publicOutput: undefined;
            proof: unknown;
            maxProofsVerified: 0 | 2 | 1;
            shouldVerify: import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool;
            toJSON(): import("o1js").JsonProof;
            publicFields(): {
                input: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[];
                output: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[];
            };
        };
        publicInputType: Omit<import("node_modules/o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
            accountUpdate: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
            calls: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        }, {
            accountUpdate: bigint;
            calls: bigint;
        }>, "fromFields"> & {
            fromFields: (fields: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[]) => {
                accountUpdate: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
                calls: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
            };
        } & {
            toInput: (x: {
                accountUpdate: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
                calls: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
            }) => {
                fields?: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[] | undefined;
                packed?: [import("node_modules/o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
            };
            toJSON: (x: {
                accountUpdate: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
                calls: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
            }) => {
                accountUpdate: string;
                calls: string;
            };
            fromJSON: (x: {
                accountUpdate: string;
                calls: string;
            }) => {
                accountUpdate: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
                calls: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
            };
            empty: () => {
                accountUpdate: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
                calls: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
            };
        };
        publicOutputType: import("node_modules/o1js/dist/node/lib/provable/types/struct.js").ProvablePureExtended<undefined, undefined, null>;
        tag: () => typeof import("o1js").SmartContract;
        fromJSON<S extends import("node_modules/o1js/dist/node/lib/util/types.js").Subclass<typeof import("o1js").Proof>>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: import("o1js").JsonProof): Promise<import("o1js").Proof<import("o1js").InferProvable<S["publicInputType"]>, import("o1js").InferProvable<S["publicOutputType"]>>>;
        dummy<Input, OutPut>(publicInput: Input, publicOutput: OutPut, maxProofsVerified: 0 | 2 | 1, domainLog2?: number): Promise<import("o1js").Proof<Input, OutPut>>;
        readonly provable: {
            toFields: (value: import("o1js").Proof<any, any>) => import("node_modules/o1js/dist/node/lib/provable/field.js").Field[];
            toAuxiliary: (value?: import("o1js").Proof<any, any> | undefined) => any[];
            fromFields: (fields: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[], aux: any[]) => import("o1js").Proof<any, any>;
            sizeInFields(): number;
            check: (value: import("o1js").Proof<any, any>) => void;
            toValue: (x: import("o1js").Proof<any, any>) => import("node_modules/o1js/dist/node/lib/proof-system/proof.js").ProofValue<any, any>;
            fromValue: (x: import("o1js").Proof<any, any> | import("node_modules/o1js/dist/node/lib/proof-system/proof.js").ProofValue<any, any>) => import("o1js").Proof<any, any>;
            toCanonical?: ((x: import("o1js").Proof<any, any>) => import("o1js").Proof<any, any>) | undefined;
        };
        publicFields(value: import("o1js").ProofBase<any, any>): {
            input: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[];
            output: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[];
        };
    };
    compile({ cache, forceRecompile, }?: {
        cache?: import("o1js").Cache | undefined;
        forceRecompile?: boolean | undefined;
    }): Promise<{
        verificationKey: {
            data: string;
            hash: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        };
        provers: import("node_modules/o1js/dist/node/snarky.js").Pickles.Prover[];
        verify: (statement: import("node_modules/o1js/dist/node/snarky.js").Pickles.Statement<import("node_modules/o1js/dist/node/lib/provable/core/fieldvar.js").FieldConst>, proof: unknown) => Promise<boolean>;
    }>;
    digest(): Promise<string>;
    runOutsideCircuit(run: () => void): void;
    analyzeMethods({ printSummary }?: {
        printSummary?: boolean | undefined;
    }): Promise<Record<string, {
        actions: number;
        rows: number;
        digest: string;
        gates: import("node_modules/o1js/dist/node/snarky.js").Gate[];
    }>>;
};
declare const WhitelistedFungibleToken: {
    new (address: import("o1js").PublicKey, tokenId?: import("o1js").Field): {
        decimals: import("o1js").State<import("o1js").UInt8>;
        admin: import("o1js").State<import("o1js").PublicKey>;
        paused: import("o1js").State<import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool>;
        readonly events: {
            SetAdmin: typeof import("./FungibleTokenContract.js").SetAdminEvent;
            Pause: typeof import("./FungibleTokenContract.js").PauseEvent;
            Mint: typeof import("./FungibleTokenContract.js").MintEvent;
            Burn: typeof import("./FungibleTokenContract.js").BurnEvent;
            BalanceChange: typeof import("./FungibleTokenContract.js").BalanceChangeEvent;
        };
        deploy(props: import("./FungibleTokenContract.js").FungibleTokenDeployProps): Promise<void>;
        updateVerificationKey(vk: import("o1js").VerificationKey): Promise<void>;
        initialize(admin: import("o1js").PublicKey, decimals: import("o1js").UInt8, startPaused: import("o1js").Bool): Promise<void>;
        getAdminContract(): Promise<FungibleTokenAdminBase>;
        setAdmin(admin: import("o1js").PublicKey): Promise<void>;
        mint(recipient: import("o1js").PublicKey, amount: import("o1js").UInt64): Promise<import("o1js").AccountUpdate>;
        burn(from: import("o1js").PublicKey, amount: import("o1js").UInt64): Promise<import("o1js").AccountUpdate>;
        pause(): Promise<void>;
        resume(): Promise<void>;
        transfer(from: import("o1js").PublicKey, to: import("o1js").PublicKey, amount: import("o1js").UInt64): Promise<void>;
        checkPermissionsUpdate(update: import("o1js").AccountUpdate): void;
        approveBase(updates: import("o1js").AccountUpdateForest): Promise<void>;
        getBalanceOf(address: import("o1js").PublicKey): Promise<import("o1js").UInt64>;
        getCirculating(): Promise<import("o1js").UInt64>;
        getDecimals(): Promise<import("o1js").UInt8>;
        deriveTokenId(): import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        readonly internal: {
            mint({ address, amount, }: {
                address: import("o1js").PublicKey | import("o1js").AccountUpdate | import("o1js").SmartContract;
                amount: number | bigint | import("o1js").UInt64;
            }): import("o1js").AccountUpdate;
            burn({ address, amount, }: {
                address: import("o1js").PublicKey | import("o1js").AccountUpdate | import("o1js").SmartContract;
                amount: number | bigint | import("o1js").UInt64;
            }): import("o1js").AccountUpdate;
            send({ from, to, amount, }: {
                from: import("o1js").PublicKey | import("o1js").AccountUpdate | import("o1js").SmartContract;
                to: import("o1js").PublicKey | import("o1js").AccountUpdate | import("o1js").SmartContract;
                amount: number | bigint | import("o1js").UInt64;
            }): import("o1js").AccountUpdate;
        };
        forEachUpdate(updates: import("o1js").AccountUpdateForest, callback: (update: import("o1js").AccountUpdate, usesToken: import("o1js").Bool) => void): void;
        checkZeroBalanceChange(updates: import("o1js").AccountUpdateForest): void;
        approveAccountUpdate(accountUpdate: import("o1js").AccountUpdate | import("o1js").AccountUpdateTree): Promise<void>;
        approveAccountUpdates(accountUpdates: (import("o1js").AccountUpdate | import("o1js").AccountUpdateTree)[]): Promise<void>;
        "__#3@#private": any;
        address: import("o1js").PublicKey;
        tokenId: import("o1js").Field;
        init(): void;
        requireSignature(): void;
        skipAuthorization(): void;
        readonly self: import("o1js").AccountUpdate;
        newSelf(methodName?: string): import("o1js").AccountUpdate;
        sender: {
            self: import("o1js").SmartContract;
            getUnconstrained(): import("o1js").PublicKey;
            getAndRequireSignature(): import("o1js").PublicKey;
        };
        readonly account: import("node_modules/o1js/dist/node/lib/mina/precondition.js").Account;
        readonly network: import("node_modules/o1js/dist/node/lib/mina/precondition.js").Network;
        readonly currentSlot: import("node_modules/o1js/dist/node/lib/mina/precondition.js").CurrentSlot;
        approve(update: import("o1js").AccountUpdate | import("o1js").AccountUpdateTree | import("o1js").AccountUpdateForest): void;
        send(args: {
            to: import("o1js").PublicKey | import("o1js").AccountUpdate | import("o1js").SmartContract;
            amount: number | bigint | import("o1js").UInt64;
        }): import("o1js").AccountUpdate;
        readonly balance: {
            addInPlace(x: string | number | bigint | import("o1js").UInt64 | import("o1js").UInt32 | import("o1js").Int64): void;
            subInPlace(x: string | number | bigint | import("o1js").UInt64 | import("o1js").UInt32 | import("o1js").Int64): void;
        };
        emitEventIf<K extends "SetAdmin" | "Pause" | "Mint" | "Burn" | "BalanceChange">(condition: import("o1js").Bool, type: K, event: any): void;
        emitEvent<K extends "SetAdmin" | "Pause" | "Mint" | "Burn" | "BalanceChange">(type: K, event: any): void;
        fetchEvents(start?: import("o1js").UInt32, end?: import("o1js").UInt32): Promise<{
            type: string;
            event: {
                data: import("o1js").ProvablePure<any>;
                transactionInfo: {
                    transactionHash: string;
                    transactionStatus: string;
                    transactionMemo: string;
                };
            };
            blockHeight: import("o1js").UInt32;
            blockHash: string;
            parentBlockHash: string;
            globalSlot: import("o1js").UInt32;
            chainStatus: string;
        }[]>;
    };
    MAX_ACCOUNT_UPDATES: number;
    _methods?: import("node_modules/o1js/dist/node/lib/proof-system/zkprogram.js").MethodInterface[];
    _methodMetadata?: Record<string, {
        actions: number;
        rows: number;
        digest: string;
        gates: import("node_modules/o1js/dist/node/snarky.js").Gate[];
    }>;
    _provers?: import("node_modules/o1js/dist/node/snarky.js").Pickles.Prover[];
    _maxProofsVerified?: 0 | 1 | 2;
    _verificationKey?: {
        data: string;
        hash: import("o1js").Field;
    };
    Proof(): {
        new ({ proof, publicInput, publicOutput, maxProofsVerified, }: {
            proof: unknown;
            publicInput: import("o1js").ZkappPublicInput;
            publicOutput: undefined;
            maxProofsVerified: 0 | 2 | 1;
        }): {
            verify(): void;
            verifyIf(condition: import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool): void;
            publicInput: import("o1js").ZkappPublicInput;
            publicOutput: undefined;
            proof: unknown;
            maxProofsVerified: 0 | 2 | 1;
            shouldVerify: import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool;
            toJSON(): import("o1js").JsonProof;
            publicFields(): {
                input: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[];
                output: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[];
            };
        };
        publicInputType: Omit<import("node_modules/o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
            accountUpdate: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
            calls: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        }, {
            accountUpdate: bigint;
            calls: bigint;
        }>, "fromFields"> & {
            fromFields: (fields: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[]) => {
                accountUpdate: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
                calls: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
            };
        } & {
            toInput: (x: {
                accountUpdate: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
                calls: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
            }) => {
                fields?: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[] | undefined;
                packed?: [import("node_modules/o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
            };
            toJSON: (x: {
                accountUpdate: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
                calls: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
            }) => {
                accountUpdate: string;
                calls: string;
            };
            fromJSON: (x: {
                accountUpdate: string;
                calls: string;
            }) => {
                accountUpdate: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
                calls: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
            };
            empty: () => {
                accountUpdate: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
                calls: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
            };
        };
        publicOutputType: import("node_modules/o1js/dist/node/lib/provable/types/struct.js").ProvablePureExtended<undefined, undefined, null>;
        tag: () => typeof import("o1js").SmartContract;
        fromJSON<S extends import("node_modules/o1js/dist/node/lib/util/types.js").Subclass<typeof import("o1js").Proof>>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: import("o1js").JsonProof): Promise<import("o1js").Proof<import("o1js").InferProvable<S["publicInputType"]>, import("o1js").InferProvable<S["publicOutputType"]>>>;
        dummy<Input, OutPut>(publicInput: Input, publicOutput: OutPut, maxProofsVerified: 0 | 2 | 1, domainLog2?: number): Promise<import("o1js").Proof<Input, OutPut>>;
        readonly provable: {
            toFields: (value: import("o1js").Proof<any, any>) => import("node_modules/o1js/dist/node/lib/provable/field.js").Field[];
            toAuxiliary: (value?: import("o1js").Proof<any, any> | undefined) => any[];
            fromFields: (fields: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[], aux: any[]) => import("o1js").Proof<any, any>;
            sizeInFields(): number;
            check: (value: import("o1js").Proof<any, any>) => void;
            toValue: (x: import("o1js").Proof<any, any>) => import("node_modules/o1js/dist/node/lib/proof-system/proof.js").ProofValue<any, any>;
            fromValue: (x: import("o1js").Proof<any, any> | import("node_modules/o1js/dist/node/lib/proof-system/proof.js").ProofValue<any, any>) => import("o1js").Proof<any, any>;
            toCanonical?: ((x: import("o1js").Proof<any, any>) => import("o1js").Proof<any, any>) | undefined;
        };
        publicFields(value: import("o1js").ProofBase<any, any>): {
            input: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[];
            output: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[];
        };
    };
    compile({ cache, forceRecompile, }?: {
        cache?: import("o1js").Cache | undefined;
        forceRecompile?: boolean | undefined;
    }): Promise<{
        verificationKey: {
            data: string;
            hash: import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        };
        provers: import("node_modules/o1js/dist/node/snarky.js").Pickles.Prover[];
        verify: (statement: import("node_modules/o1js/dist/node/snarky.js").Pickles.Statement<import("node_modules/o1js/dist/node/lib/provable/core/fieldvar.js").FieldConst>, proof: unknown) => Promise<boolean>;
    }>;
    digest(): Promise<string>;
    runOutsideCircuit(run: () => void): void;
    analyzeMethods({ printSummary }?: {
        printSummary?: boolean | undefined;
    }): Promise<Record<string, {
        actions: number;
        rows: number;
        digest: string;
        gates: import("node_modules/o1js/dist/node/snarky.js").Gate[];
    }>>;
};
declare const tokenVerificationKeys: {
    [key in "mainnet" | "testnet"]: {
        o1js: string;
        zkcloudworker: string;
        vk: {
            [key: string]: {
                hash: string;
                data: string;
            };
        };
    };
};
