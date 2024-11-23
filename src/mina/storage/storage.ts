import { Field, Bool, Struct, Encoding, Provable } from "o1js";

/**
 * Represents the off-chain storage information,
 * such as an IPFS hash.
 */
export class Storage extends Struct({
  url: Provable.Array(Field, 2),
}) {
  constructor(value: { url: [Field, Field] }) {
    super(value);
  }

  /**
   * Asserts that two Storage instances are equal.
   * @param a The first Storage instance.
   * @param b The second Storage instance.
   */
  static assertEquals(a: Storage, b: Storage) {
    a.url[0].assertEquals(b.url[0]);
    a.url[1].assertEquals(b.url[1]);
  }

  /**
   * Checks if two Storage instances are equal.
   * @param a The first Storage instance.
   * @param b The second Storage instance.
   * @returns A Bool indicating whether the two instances are equal.
   */
  static equals(a: Storage, b: Storage): Bool {
    return a.url[0].equals(b.url[0]).and(a.url[1].equals(b.url[1]));
  }

  /**
   * Creates a Storage instance from a string.
   * @param url The string representing the storage URL.
   * @returns A new Storage instance.
   */
  static fromString(url: string): Storage {
    const fields = Encoding.stringToFields(url);
    if (fields.length !== 2) throw new Error("Invalid string length");
    return new Storage({ url: [fields[0], fields[1]] });
  }

  /**
   * Converts the Storage instance to a string.
   * @returns The string representation of the storage URL.
   */
  toString(): string {
    if (this.url[0].toBigInt() === 0n && this.url[1].toBigInt() === 0n) {
      throw new Error("Invalid string");
    }
    return Encoding.stringFromFields([this.url[0], this.url[1]]);
  }
}
