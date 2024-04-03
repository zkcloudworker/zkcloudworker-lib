import { __awaiter } from "tslib";
import { Cache } from "o1js";
import { Cloud } from "./cloud";
import { saveFile, loadFile, saveBinaryFile, loadBinaryFile } from "./files";
export class LocalCloud extends Cloud {
    constructor(params) {
        const { job, chain, cache, stepId } = params;
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
            chain,
        });
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
            const value = LocalStorage.data[key];
            return value;
        });
    }
    saveDataByKey(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            LocalStorage.data[key] = value;
        });
    }
    saveFile(filename, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield saveBinaryFile({ data: value, filename });
        });
    }
    loadFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield loadBinaryFile(filename);
            return data;
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
export class LocalStorage {
    static saveData(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                jobs: LocalStorage.jobs,
                data: LocalStorage.data,
                transactions: LocalStorage.transactions,
                tasks: LocalStorage.tasks,
            };
            const filename = name + ".cloud";
            yield saveFile({ data, filename });
        });
    }
    static loadData(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = name + ".cloud";
            const data = yield loadFile(filename);
            if (data === undefined)
                return;
            LocalStorage.jobs = data.jobs;
            LocalStorage.data = data.data;
            LocalStorage.transactions = data.transactions;
            LocalStorage.tasks = data.tasks;
        });
    }
}
LocalStorage.jobs = {};
LocalStorage.data = {};
LocalStorage.transactions = {};
LocalStorage.tasks = {};
//# sourceMappingURL=local.js.map