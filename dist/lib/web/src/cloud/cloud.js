import { __awaiter } from "tslib";
export class Cloud {
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
        this.isLocalCloud = isLocalCloud !== null && isLocalCloud !== void 0 ? isLocalCloud : false;
        this.chain = chain;
    }
}
export class zkCloudWorker {
    constructor(cloud) {
        this.cloud = cloud;
    }
    // To verify the SmartContract code
    deployedContracts() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    // Those methods should be implemented for recursive proofs calculations
    create(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    merge(proof1, proof2) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    // Those methods should be implemented for anything except for recursive proofs
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    // process the transactions received by the cloud
    processTransactions(transactions) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    // process the task defined by the developer
    task(data) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
//# sourceMappingURL=cloud.js.map