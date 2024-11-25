import { Field, SmartContract, State } from "o1js";
export declare class TinyContract extends SmartContract {
    value: State<import("node_modules/o1js/dist/node/lib/provable/field.js").Field>;
    setValue(value: Field): Promise<void>;
}
