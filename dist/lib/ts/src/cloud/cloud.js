"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zkCloudWorker = exports.Cloud = void 0;
class Cloud {
    constructor(params) {
        const { jobId, stepId, cache, developer, repo, task, userId, args, metadata, isLocalCloud, chain, } = params;
        this.jobId = jobId;
        this.stepId = stepId;
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
class zkCloudWorker {
    constructor(cloud) {
        this.cloud = cloud;
    }
    // To verify the SmartContract code
    async deployedContracts() {
        return [];
    }
    // Those methods should be implemented for recursive proofs calculations
    async create(transaction) {
        return undefined;
    }
    async merge(proof1, proof2) {
        return undefined;
    }
    // Those methods should be implemented for anything except for recursive proofs
    async execute() {
        return undefined;
    }
    // process the transactions received by the cloud
    async processTransactions(transactions) { }
    // process the task defined by the developer
    async task() {
        return undefined;
    }
}
exports.zkCloudWorker = zkCloudWorker;
