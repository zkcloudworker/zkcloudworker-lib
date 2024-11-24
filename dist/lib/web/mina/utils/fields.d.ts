import { Field } from "o1js";
/**
 * Serialize fields to a string using base64 URL-friendly encoding
 * @param fields the fields array to serialize
 * @returns the serialized string
 */
export declare function serializeFields(fields: Field[]): string;
/**
 * Deserialize fields from a string using base64 URL-friendly encoding
 * @param s the string to deserialize
 * @returns the deserialized fields array
 */
export declare function deserializeFields(s: string): Field[];
