import { Cloud, CloudTransaction } from "./cloud";
/**
 * Abstract class for the zkCloudWorker
 * Used to define the zkCloudWorker methods and properties
 * Should be implemented for by the developer for the zkCloudWorker in the cloud
 * @param cloud: the cloud
 */
export declare abstract class zkCloudWorker {
    readonly cloud: Cloud;
    /**
     * Constructor for the zkCloudWorker class
     * @param cloud the cloud instance provided by the zkCloudWorker in the local environment or in the cloud
     */
    constructor(cloud: Cloud);
    /**
     * Creates a new proof from a transaction
     * @param transaction the transaction
     * @returns the serialized proof
     */
    create(transaction: string): Promise<string | undefined>;
    /**
     * Merges two proofs
     * @param proof1 the first proof
     * @param proof2 the second proof
     * @returns the merged proof
     */
    merge(proof1: string, proof2: string): Promise<string | undefined>;
    /**
     * Executes the transactions
     * @param transactions the transactions, can be empty list
     * @returns the result
     */
    execute(transactions: string[]): Promise<string | undefined>;
    processTransactions(transactions: CloudTransaction[]): Promise<void>;
    /**
     * process the task defined by the developer
     * @returns the result
     */
    task(): Promise<string | undefined>;
}
