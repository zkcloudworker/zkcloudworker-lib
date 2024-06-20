"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zkCloudWorker = exports.Cloud = void 0;
/*
 * Abstract class for the cloud service
 * Used to define the cloud methods and properties
 * Should be implemented by for local testing and for the zkCloudWorker in the cloud
 * @param id the id of the user
 * @param jobId the job id
 * @param stepId the step id
 * @param taskId the task id
 * @param cache the cache folder. Use it to get the Cache object: cache = Cache.FileSystem(this.cloud.cache);
 * @param developer the developer id
 * @param repo the repo id
 * @param task the task id
 * @param userId the user id
 * @param args the arguments, should be a string or serialized JSON
 * @param metadata the metadata, should be a string or serialized JSON
 * @param chain the blockchain network
 * @param isLocalCloud a boolean to check if the cloud is local or not
 */
class Cloud {
    /**
     * Constructor for the Cloud class
     * @param params the parameters for the Cloud class
     * @param params.id the id of the user
     * @param params.jobId the job id
     * @param params.stepId the step id
     * @param params.taskId the task id
     * @param params.cache the cache folder. Use it to get the Cache object: cache = Cache.FileSystem(this.cloud.cache);
     * @param params.developer the developer id
     * @param params.repo the repo id
     * @param params.task the task id
     * @param params.userId the user id
     * @param params.args the arguments, should be a string or serialized JSON
     * @param params.metadata the metadata, should be a string or serialized JSON
     * @param params.chain the blockchain network
     * @param params.isLocalCloud a boolean to check if the cloud is local or not
     */
    constructor(params) {
        const { id, jobId, stepId, taskId, cache, developer, repo, task, userId, args, metadata, isLocalCloud, chain, } = params;
        this.id = id;
        this.jobId = jobId;
        this.stepId = stepId;
        this.taskId = taskId;
        this.cache = cache;
        this.developer = developer;
        this.repo = repo;
        this.task = task;
        this.userId = userId;
        this.args = args;
        this.metadata = metadata;
        this.isLocalCloud = isLocalCloud ?? false;
        this.chain = chain;
    }
}
exports.Cloud = Cloud;
/**
 * Abstract class for the zkCloudWorker
 * Used to define the zkCloudWorker methods and properties
 * Should be implemented for by the developer for the zkCloudWorker in the cloud
 * @param cloud: the cloud
 */
class zkCloudWorker {
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
exports.zkCloudWorker = zkCloudWorker;
