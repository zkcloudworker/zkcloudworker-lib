import { AccountUpdate, AccountUpdateForest, Bool, DeployArgs, Int64, PublicKey, State, TokenContractV2, Types, UInt64, UInt8, VerificationKey } from "o1js_v1";
import { FungibleTokenAdminBase } from "./FungibleTokenAdmin.js";
interface FungibleTokenDeployProps extends Exclude<DeployArgs, undefined> {
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
export declare class FungibleToken extends TokenContractV2 {
    decimals: State<UInt8>;
    admin: State<PublicKey>;
    paused: State<import("o1js_v1/dist/node/lib/provable/bool.js").Bool>;
    static AdminContract: new (...args: any) => FungibleTokenAdminBase;
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
    private checkPermissionsUpdate;
    /** Approve `AccountUpdate`s that have been created outside of the token contract.
     *
     * @argument {AccountUpdateForest} updates - The `AccountUpdate`s to approve. Note that the forest size is limited by the base token contract, @see TokenContractV2.MAX_ACCOUNT_UPDATES The current limit is 9.
     */
    approveBase(updates: AccountUpdateForest): Promise<void>;
    getBalanceOf(address: PublicKey): Promise<UInt64>;
    /** Reports the current circulating supply
     * This does take into account currently unreduced actions.
     */
    getCirculating(): Promise<UInt64>;
    getDecimals(): Promise<UInt8>;
}
declare const SetAdminEvent_base: (new (value: {
    adminKey: PublicKey;
}) => {
    adminKey: PublicKey;
}) & {
    _isStruct: true;
} & Omit<import("o1js_v1/dist/node/lib/provable/types/provable-intf.js").Provable<{
    adminKey: PublicKey;
}, {
    adminKey: {
        x: bigint;
        isOdd: boolean;
    };
}>, "fromFields"> & {
    fromFields: (fields: import("o1js_v1/dist/node/lib/provable/field.js").Field[]) => {
        adminKey: PublicKey;
    };
} & {
    fromValue: (value: {
        adminKey: PublicKey | {
            x: bigint | import("o1js_v1/dist/node/lib/provable/field.js").Field;
            isOdd: boolean | import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
        };
    }) => {
        adminKey: PublicKey;
    };
    toInput: (x: {
        adminKey: PublicKey;
    }) => {
        fields?: import("o1js_v1/dist/node/lib/provable/field.js").Field[] | undefined;
        packed?: [import("o1js_v1/dist/node/lib/provable/field.js").Field, number][] | undefined;
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
    isPaused: import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
}) => {
    isPaused: import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
}) & {
    _isStruct: true;
} & Omit<import("o1js_v1/dist/node/lib/provable/types/provable-intf.js").Provable<{
    isPaused: import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
}, {
    isPaused: boolean;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js_v1/dist/node/lib/provable/field.js").Field[]) => {
        isPaused: import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
    };
} & {
    fromValue: (value: {
        isPaused: boolean | import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
    }) => {
        isPaused: import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
    };
    toInput: (x: {
        isPaused: import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
    }) => {
        fields?: import("o1js_v1/dist/node/lib/provable/field.js").Field[] | undefined;
        packed?: [import("o1js_v1/dist/node/lib/provable/field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        isPaused: import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
    }) => {
        isPaused: boolean;
    };
    fromJSON: (x: {
        isPaused: boolean;
    }) => {
        isPaused: import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
    };
    empty: () => {
        isPaused: import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
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
} & Omit<import("o1js_v1/dist/node/lib/provable/types/provable-intf.js").Provable<{
    recipient: PublicKey;
    amount: Types.UInt64;
}, {
    recipient: {
        x: bigint;
        isOdd: boolean;
    };
    amount: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js_v1/dist/node/lib/provable/field.js").Field[]) => {
        recipient: PublicKey;
        amount: Types.UInt64;
    };
} & {
    fromValue: (value: {
        recipient: PublicKey | {
            x: bigint | import("o1js_v1/dist/node/lib/provable/field.js").Field;
            isOdd: boolean | import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
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
        fields?: import("o1js_v1/dist/node/lib/provable/field.js").Field[] | undefined;
        packed?: [import("o1js_v1/dist/node/lib/provable/field.js").Field, number][] | undefined;
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
} & Omit<import("o1js_v1/dist/node/lib/provable/types/provable-intf.js").Provable<{
    from: PublicKey;
    amount: Types.UInt64;
}, {
    from: {
        x: bigint;
        isOdd: boolean;
    };
    amount: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js_v1/dist/node/lib/provable/field.js").Field[]) => {
        from: PublicKey;
        amount: Types.UInt64;
    };
} & {
    fromValue: (value: {
        from: PublicKey | {
            x: bigint | import("o1js_v1/dist/node/lib/provable/field.js").Field;
            isOdd: boolean | import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
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
        fields?: import("o1js_v1/dist/node/lib/provable/field.js").Field[] | undefined;
        packed?: [import("o1js_v1/dist/node/lib/provable/field.js").Field, number][] | undefined;
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
} & Omit<import("o1js_v1/dist/node/lib/provable/types/provable-intf.js").Provable<{
    address: PublicKey;
    amount: Int64;
}, {
    address: {
        x: bigint;
        isOdd: boolean;
    };
    amount: any;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js_v1/dist/node/lib/provable/field.js").Field[]) => {
        address: PublicKey;
        amount: Int64;
    };
} & {
    fromValue: (value: {
        address: PublicKey | {
            x: bigint | import("o1js_v1/dist/node/lib/provable/field.js").Field;
            isOdd: boolean | import("o1js_v1/dist/node/lib/provable/bool.js").Bool;
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
        fields?: import("o1js_v1/dist/node/lib/provable/field.js").Field[] | undefined;
        packed?: [import("o1js_v1/dist/node/lib/provable/field.js").Field, number][] | undefined;
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
