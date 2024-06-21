/**
 * Abstract class for the zkCloudWorker
 * Used to define the zkCloudWorker methods and properties
 * Should be implemented for by the developer for the zkCloudWorker in the cloud
 * @param cloud: the cloud
 */
export class zkCloudWorker {
    /**
     * Constructor for the zkCloudWorker class
     * @param cloud the cloud instance provided by the zkCloudWorker in the local environment or in the cloud
     */
    constructor(cloud) {
        this.cloud = cloud;
    }
    // Those methods should be implemented for recursive proofs calculations
    /**
     * Creates a new proof from a transaction
     * @param transaction the transaction
     * @returns the serialized proof
     */
    async create(transaction) {
        return undefined;
    }
    /**
     * Merges two proofs
     * @param proof1 the first proof
     * @param proof2 the second proof
     * @returns the merged proof
     */
    async merge(proof1, proof2) {
        return undefined;
    }
    // Those methods should be implemented for anything except for recursive proofs
    /**
     * Executes the transactions
     * @param transactions the transactions, can be empty list
     * @returns the result
     */
    async execute(transactions) {
        return undefined;
    }
    /* Process the transactions received by the cloud
     * @param transactions: the transactions
     */
    async processTransactions(transactions) { }
    /**
     * process the task defined by the developer
     * @returns the result
     */
    async task() {
        return undefined;
    }
}
//# sourceMappingURL=worker.js.map