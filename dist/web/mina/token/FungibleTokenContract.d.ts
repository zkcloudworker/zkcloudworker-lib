import { AccountUpdate, AccountUpdateForest, Bool, DeployArgs, Field, Int64, PublicKey, SmartContract, State, Types, UInt64, UInt8, VerificationKey } from "o1js";
export type FungibleTokenAdminBase = SmartContract & {
    canMint(accountUpdate: AccountUpdate): Promise<Bool>;
    canChangeAdmin(admin: PublicKey): Promise<Bool>;
    canPause(): Promise<Bool>;
    canResume(): Promise<Bool>;
};
export type FungibleTokenAdminConstructor = new (adminPublicKey: PublicKey) => FungibleTokenAdminBase;
export interface FungibleTokenDeployProps extends Exclude<DeployArgs, undefined> {
    /** The token symbol. */
    symbol: string;
    /** A source code reference, which is placed within the `zkappUri` of the contract account.
     * Typically a link to a file on github. */
    src: string;
}
export declare const FungibleTokenErrors: {
    noAdminKey: string;
    noPermissionToChangeAdmin: string;
    tokenPaused: string;
    noPermissionToMint: string;
    noPermissionToPause: string;
    noPermissionToResume: string;
    noTransferFromCirculation: string;
    noPermissionChangeAllowed: string;
    flashMinting: string;
    unbalancedTransaction: string;
};
export declare function FungibleTokenContract(adminContract: FungibleTokenAdminConstructor): {
    new (address: PublicKey, tokenId?: Field): {
        decimals: State<UInt8>;
        admin: State<PublicKey>;
        paused: State<import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool>;
        readonly events: {
            SetAdmin: typeof SetAdminEvent;
            Pause: typeof PauseEvent;
            Mint: typeof MintEvent;
            Burn: typeof BurnEvent;
            BalanceChange: typeof BalanceChangeEvent;
        };
        deploy(props: FungibleTokenDeployProps): Promise<void>;
        /** Update the verification key.
         * Note that because we have set the permissions for setting the verification key to `impossibleDuringCurrentVersion()`, this will only be possible in case of a protocol update that requires an update.
         */
        updateVerificationKey(vk: VerificationKey): Promise<void>;
        /** Initializes the account for tracking total circulation.
         * @argument {PublicKey} admin - public key where the admin contract is deployed
         * @argument {UInt8} decimals - number of decimals for the token
         * @argument {Bool} startPaused - if set to `Bool(true), the contract will start in a mode where token minting and transfers are paused. This should be used for non-atomic deployments
         */
        initialize(admin: PublicKey, decimals: UInt8, startPaused: Bool): Promise<void>;
        getAdminContract(): Promise<FungibleTokenAdminBase>;
        setAdmin(admin: PublicKey): Promise<void>;
        mint(recipient: PublicKey, amount: UInt64): Promise<AccountUpdate>;
        burn(from: PublicKey, amount: UInt64): Promise<AccountUpdate>;
        pause(): Promise<void>;
        resume(): Promise<void>;
        transfer(from: PublicKey, to: PublicKey, amount: UInt64): Promise<void>;
        checkPermissionsUpdate(update: AccountUpdate): void;
        /** Approve `AccountUpdate`s that have been created outside of the token contract.
         *
         * @argument {AccountUpdateForest} updates - The `AccountUpdate`s to approve. Note that the forest size is limited by the base token contract, @see TokenContract.MAX_ACCOUNT_UPDATES The current limit is 9.
         */
        approveBase(updates: AccountUpdateForest): Promise<void>;
        getBalanceOf(address: PublicKey): Promise<UInt64>;
        /** Reports the current circulating supply
         * This does take into account currently unreduced actions.
         */
        getCirculating(): Promise<UInt64>;
        getDecimals(): Promise<UInt8>;
        deriveTokenId(): import("node_modules/o1js/dist/node/lib/provable/field.js").Field;
        readonly internal: {
            mint({ address, amount, }: {
                address: PublicKey | AccountUpdate | SmartContract;
                amount: number | bigint | UInt64;
            }): AccountUpdate;
            burn({ address, amount, }: {
                address: PublicKey | AccountUpdate | SmartContract;
                amount: number | bigint | UInt64;
            }): AccountUpdate;
            send({ from, to, amount, }: {
                from: PublicKey | AccountUpdate | SmartContract;
                to: PublicKey | AccountUpdate | SmartContract;
                amount: number | bigint | UInt64;
            }): AccountUpdate;
        };
        forEachUpdate(updates: AccountUpdateForest, callback: (update: AccountUpdate, usesToken: Bool) => void): void;
        checkZeroBalanceChange(updates: AccountUpdateForest): void;
        approveAccountUpdate(accountUpdate: AccountUpdate | import("o1js").AccountUpdateTree): Promise<void>;
        approveAccountUpdates(accountUpdates: (AccountUpdate | import("o1js").AccountUpdateTree)[]): Promise<void>;
        "__#3@#private": any;
        address: PublicKey;
        tokenId: Field;
        init(): void;
        requireSignature(): void;
        skipAuthorization(): void;
        readonly self: AccountUpdate;
        newSelf(methodName?: string): AccountUpdate;
        sender: {
            self: SmartContract;
            getUnconstrained(): PublicKey;
            getAndRequireSignature(): PublicKey;
        };
        readonly account: import("node_modules/o1js/dist/node/lib/mina/precondition.js").Account;
        readonly network: import("node_modules/o1js/dist/node/lib/mina/precondition.js").Network;
        readonly currentSlot: import("node_modules/o1js/dist/node/lib/mina/precondition.js").CurrentSlot;
        approve(update: AccountUpdate | import("o1js").AccountUpdateTree | AccountUpdateForest): void;
        send(args: {
            to: PublicKey | AccountUpdate | SmartContract;
            amount: number | bigint | UInt64;
        }): AccountUpdate;
        readonly balance: {
            addInPlace(x: string | number | bigint | UInt64 | Types.UInt32 | import("node_modules/o1js/dist/node/lib/provable/int.js").Int64): void;
            subInPlace(x: string | number | bigint | UInt64 | Types.UInt32 | import("node_modules/o1js/dist/node/lib/provable/int.js").Int64): void;
        };
        emitEventIf<K extends "SetAdmin" | "Pause" | "Mint" | "Burn" | "BalanceChange">(condition: Bool, type: K, event: any): void;
        emitEvent<K extends "SetAdmin" | "Pause" | "Mint" | "Burn" | "BalanceChange">(type: K, event: any): void;
        fetchEvents(start?: Types.UInt32, end?: Types.UInt32): Promise<{
            type: string;
            event: {
                data: import("o1js").ProvablePure<any>;
                transactionInfo: {
                    transactionHash: string;
                    transactionStatus: string;
                    transactionMemo: string;
                };
            };
            blockHeight: Types.UInt32;
            blockHash: string;
            parentBlockHash: string;
            globalSlot: Types.UInt32;
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
        hash: Field;
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
        tag: () => typeof SmartContract;
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
declare const SetAdminEvent_base: (new (value: {
    adminKey: PublicKey;
}) => {
    adminKey: PublicKey;
}) & {
    _isStruct: true;
} & Omit<import("node_modules/o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
    adminKey: PublicKey;
}, {
    adminKey: {
        x: bigint;
        isOdd: boolean;
    };
}>, "fromFields"> & {
    fromFields: (fields: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[]) => {
        adminKey: PublicKey;
    };
} & {
    fromValue: (value: {
        adminKey: PublicKey | {
            x: Field | bigint;
            isOdd: Bool | boolean;
        };
    }) => {
        adminKey: PublicKey;
    };
    toInput: (x: {
        adminKey: PublicKey;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        adminKey: PublicKey;
    }) => {
        adminKey: string;
    };
    fromJSON: (x: {
        adminKey: string;
    }) => {
        adminKey: PublicKey;
    };
    empty: () => {
        adminKey: PublicKey;
    };
};
export declare class SetAdminEvent extends SetAdminEvent_base {
}
declare const PauseEvent_base: (new (value: {
    isPaused: import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool;
}) => {
    isPaused: import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool;
}) & {
    _isStruct: true;
} & Omit<import("node_modules/o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
    isPaused: import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool;
}, {
    isPaused: boolean;
}>, "fromFields"> & {
    fromFields: (fields: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[]) => {
        isPaused: import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool;
    };
} & {
    fromValue: (value: {
        isPaused: boolean | import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool;
    }) => {
        isPaused: import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool;
    };
    toInput: (x: {
        isPaused: import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        isPaused: import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool;
    }) => {
        isPaused: boolean;
    };
    fromJSON: (x: {
        isPaused: boolean;
    }) => {
        isPaused: import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool;
    };
    empty: () => {
        isPaused: import("node_modules/o1js/dist/node/lib/provable/bool.js").Bool;
    };
};
export declare class PauseEvent extends PauseEvent_base {
}
declare const MintEvent_base: (new (value: {
    recipient: PublicKey;
    amount: Types.UInt64;
}) => {
    recipient: PublicKey;
    amount: Types.UInt64;
}) & {
    _isStruct: true;
} & Omit<import("node_modules/o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
    recipient: PublicKey;
    amount: Types.UInt64;
}, {
    recipient: {
        x: bigint;
        isOdd: boolean;
    };
    amount: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[]) => {
        recipient: PublicKey;
        amount: Types.UInt64;
    };
} & {
    fromValue: (value: {
        recipient: PublicKey | {
            x: Field | bigint;
            isOdd: Bool | boolean;
        };
        amount: bigint | Types.UInt64;
    }) => {
        recipient: PublicKey;
        amount: Types.UInt64;
    };
    toInput: (x: {
        recipient: PublicKey;
        amount: Types.UInt64;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        recipient: PublicKey;
        amount: Types.UInt64;
    }) => {
        recipient: string;
        amount: string;
    };
    fromJSON: (x: {
        recipient: string;
        amount: string;
    }) => {
        recipient: PublicKey;
        amount: Types.UInt64;
    };
    empty: () => {
        recipient: PublicKey;
        amount: Types.UInt64;
    };
};
export declare class MintEvent extends MintEvent_base {
}
declare const BurnEvent_base: (new (value: {
    from: PublicKey;
    amount: Types.UInt64;
}) => {
    from: PublicKey;
    amount: Types.UInt64;
}) & {
    _isStruct: true;
} & Omit<import("node_modules/o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
    from: PublicKey;
    amount: Types.UInt64;
}, {
    from: {
        x: bigint;
        isOdd: boolean;
    };
    amount: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[]) => {
        from: PublicKey;
        amount: Types.UInt64;
    };
} & {
    fromValue: (value: {
        from: PublicKey | {
            x: Field | bigint;
            isOdd: Bool | boolean;
        };
        amount: bigint | Types.UInt64;
    }) => {
        from: PublicKey;
        amount: Types.UInt64;
    };
    toInput: (x: {
        from: PublicKey;
        amount: Types.UInt64;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        from: PublicKey;
        amount: Types.UInt64;
    }) => {
        from: string;
        amount: string;
    };
    fromJSON: (x: {
        from: string;
        amount: string;
    }) => {
        from: PublicKey;
        amount: Types.UInt64;
    };
    empty: () => {
        from: PublicKey;
        amount: Types.UInt64;
    };
};
export declare class BurnEvent extends BurnEvent_base {
}
declare const BalanceChangeEvent_base: (new (value: {
    address: PublicKey;
    amount: Int64;
}) => {
    address: PublicKey;
    amount: Int64;
}) & {
    _isStruct: true;
} & Omit<import("node_modules/o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
    address: PublicKey;
    amount: Int64;
}, {
    address: {
        x: bigint;
        isOdd: boolean;
    };
    amount: any;
}>, "fromFields"> & {
    fromFields: (fields: import("node_modules/o1js/dist/node/lib/provable/field.js").Field[]) => {
        address: PublicKey;
        amount: Int64;
    };
} & {
    fromValue: (value: {
        address: PublicKey | {
            x: Field | bigint;
            isOdd: Bool | boolean;
        };
        amount: any;
    }) => {
        address: PublicKey;
        amount: Int64;
    };
    toInput: (x: {
        address: PublicKey;
        amount: Int64;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        address: PublicKey;
        amount: Int64;
    }) => {
        address: string;
        amount: any;
    };
    fromJSON: (x: {
        address: string;
        amount: any;
    }) => {
        address: PublicKey;
        amount: Int64;
    };
    empty: () => {
        address: PublicKey;
        amount: Int64;
    };
};
export declare class BalanceChangeEvent extends BalanceChangeEvent_base {
}
export {};
