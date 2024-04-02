import { __awaiter } from "tslib";
import { Cache } from "o1js";
import { Cloud } from "./cloud";
export class LocalCloud extends Cloud {
    constructor(params) {
        const { job, cache, stepId } = params;
        const { jobId, developer, repo, task, userId, args, metadata } = job;
        super({
            jobId: jobId,
            stepId: stepId !== null && stepId !== void 0 ? stepId : "stepId",
            cache: cache !== null && cache !== void 0 ? cache : Cache.FileSystem("./cache"),
            developer: developer,
            repo: repo,
            task: task,
            userId: userId,
            args: args,
            metadata: metadata,
            isLocalCloud: true,
        });
        this.data = new Map();
    }
    getDeployer() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    log(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("LocalCloud:", msg);
        });
    }
    getDataByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = this.data.get(key);
            return value;
        });
    }
    saveDataByKey(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.set(key, value);
        });
    }
    saveFile(filename, value) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    loadFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    loadEnvironment(password) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    static sequencer(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { worker, data } = params;
            const { transactions } = data;
            if (transactions.length === 0)
                throw new Error("No transactions to process");
            const proofs = [];
            for (const transaction of transactions) {
                const result = yield worker.create(transaction);
                if (result === undefined)
                    throw new Error("Failed to create proof");
                proofs.push(result);
            }
            let proof = proofs[0];
            for (let i = 1; i < proofs.length; i++) {
                const result = yield worker.merge(proof, proofs[i]);
                if (result === undefined)
                    throw new Error("Failed to merge proofs");
                proof = result;
            }
            return proof;
        });
    }
}
//# sourceMappingURL=local.js.map