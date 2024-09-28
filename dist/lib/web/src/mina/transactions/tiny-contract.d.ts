import { Field, SmartContract, State } from "o1js";
export declare class TinyContract extends SmartContract {
    value: State<import("o1js/dist/node/lib/provable/field").Field>;
    setValue(value: Field): Promise<void>;
}
