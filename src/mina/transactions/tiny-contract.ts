import { Field, SmartContract, method, state, State } from "o1js";

export class TinyContract extends SmartContract {
  @state(Field) value = State<Field>();

  @method async setValue(value: Field) {
    this.value.set(value);
  }
}
