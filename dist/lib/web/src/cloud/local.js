import { __awaiter } from "tslib";
import { Cache } from "o1js";
import { Cloud } from "./cloud";
import { makeString } from "../mina";
import { saveFile, loadFile, saveBinaryFile, loadBinaryFile } from "./files";
export class LocalCloud extends Cloud {
    constructor(params) {
        const { job, chain, cache, stepId, localWorker } = params;
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
        this.localWorker = localWorker;
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
    generateId() {
        return "local." + Date.now().toString() + "." + makeString(32);
    }
    recursiveProof(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("calculating recursive proof locally...");
            const timeCreated = Date.now();
            const jobId = this.generateId();
            const job = {
                id: "local",
                jobId: jobId,
                developer: this.developer,
                repo: this.repo,
                task: data.task,
                userId: data.userId,
                args: data.args,
                metadata: data.metadata,
                filename: "recursiveProof.json",
                txNumber: data.transactions.length,
                timeCreated,
                timeCreatedString: new Date(timeCreated).toISOString(),
                timeStarted: timeCreated,
                jobStatus: "started",
                maxAttempts: 0,
            };
            const cloud = new LocalCloud({
                job,
                chain: this.chain,
                localWorker: this.localWorker,
            });
            const worker = yield this.localWorker(cloud);
            if (worker === undefined)
                throw new Error("worker is undefined");
            const proof = yield LocalCloud.sequencer({
                worker,
                data: Object.assign(Object.assign({}, data), { developer: this.developer, repo: this.repo }),
            });
            job.timeFinished = Date.now();
            job.jobStatus = "finished";
            job.result = proof;
            job.maxAttempts = 1;
            LocalStorage.jobs[jobId] = job;
            return jobId;
        });
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("executing locally...");
            const timeCreated = Date.now();
            const jobId = this.generateId();
            const job = {
                id: "local",
                jobId: jobId,
                developer: this.developer,
                repo: this.repo,
                task: data.task,
                userId: data.userId,
                args: data.args,
                metadata: data.metadata,
                txNumber: 1,
                timeCreated,
                timeCreatedString: new Date(timeCreated).toISOString(),
                timeStarted: timeCreated,
                jobStatus: "started",
                maxAttempts: 0,
            };
            const cloud = new LocalCloud({
                job,
                chain: this.chain,
                localWorker: this.localWorker,
            });
            const worker = yield this.localWorker(cloud);
            if (worker === undefined)
                throw new Error("worker is undefined");
            const result = yield worker.execute();
            job.timeFinished = Date.now();
            job.jobStatus = "finished";
            job.result = result;
            job.maxAttempts = 1;
            LocalStorage.jobs[jobId] = job;
            return jobId;
        });
    }
    addTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskId = this.generateId();
            LocalStorage.tasks[taskId] = Object.assign(Object.assign({}, data), { id: "local", taskId, developer: this.developer, repo: this.repo });
            return taskId;
        });
    }
    deleteTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            delete LocalStorage.tasks[taskId];
        });
    }
    processTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const taskId in LocalStorage.tasks) {
                const data = LocalStorage.tasks[taskId];
                const jobId = this.generateId();
                const timeCreated = Date.now();
                const job = {
                    id: "local",
                    jobId: jobId,
                    developer: this.developer,
                    repo: this.repo,
                    task: data.task,
                    userId: data.userId,
                    args: data.args,
                    metadata: data.metadata,
                    txNumber: 1,
                    timeCreated: timeCreated,
                    timeCreatedString: new Date(timeCreated).toISOString(),
                    timeStarted: Date.now(),
                    jobStatus: "started",
                    maxAttempts: 0,
                };
                const cloud = new LocalCloud({
                    job,
                    chain: this.chain,
                    localWorker: this.localWorker,
                });
                const worker = yield this.localWorker(cloud);
                console.log("Executing task", { taskId, data });
                const result = yield worker.task();
                job.timeFinished = Date.now();
                job.maxAttempts = 1;
                job.billedDuration = job.timeFinished - timeCreated;
                if (result !== undefined) {
                    job.jobStatus = "finished";
                    job.result = result;
                }
                else {
                    job.jobStatus = "failed";
                }
                LocalStorage.jobs[jobId] = job;
            }
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