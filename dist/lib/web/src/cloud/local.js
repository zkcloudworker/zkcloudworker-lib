import { __awaiter } from "tslib";
import { Cache } from "o1js";
import { Cloud } from "./cloud";
import { makeString, getDeployer } from "../mina";
import { saveFile, loadFile, saveBinaryFile, loadBinaryFile } from "./files";
export class LocalCloud extends Cloud {
    constructor(params) {
        const { job, chain, cache, stepId, localWorker } = params;
        const { jobId, developer, repo, task, userId, args, metadata, taskId } = job;
        super({
            jobId: jobId,
            stepId: stepId !== null && stepId !== void 0 ? stepId : "stepId",
            taskId: taskId !== null && taskId !== void 0 ? taskId : "taskId",
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
            return getDeployer();
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
    static generateId() {
        return "local." + Date.now().toString() + "." + makeString(32);
    }
    static addTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeReceived = Date.now();
            const id = LocalCloud.generateId();
            LocalStorage.transactions[id] = { transaction, timeReceived };
            return id;
        });
    }
    deleteTransaction(txId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (LocalStorage.transactions[txId] === undefined)
                throw new Error(`deleteTransaction: Transaction ${txId} not found`);
            delete LocalStorage.transactions[txId];
        });
    }
    getTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            const txs = Object.keys(LocalStorage.transactions).map((txId) => {
                const { transaction, timeReceived } = LocalStorage.transactions[txId];
                return {
                    txId,
                    transaction,
                    timeReceived,
                };
            });
            return txs;
        });
    }
    static run(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { command, data, chain, localWorker } = params;
            console.log("executing locally command", command);
            const { developer, repo, transactions, task, userId, args, metadata } = data;
            const timeCreated = Date.now();
            const jobId = LocalCloud.generateId();
            const job = {
                id: "local",
                jobId,
                developer,
                repo,
                task,
                userId,
                args,
                metadata,
                txNumber: command === "recursiveProof" ? transactions.length : 1,
                timeCreated,
                timeCreatedString: new Date(timeCreated).toISOString(),
                timeStarted: timeCreated,
                jobStatus: "started",
                maxAttempts: 0,
            };
            const cloud = new LocalCloud({
                job,
                chain,
                localWorker,
            });
            const worker = yield localWorker(cloud);
            if (worker === undefined)
                throw new Error("worker is undefined");
            const result = command === "recursiveProof"
                ? yield LocalCloud.sequencer({
                    worker,
                    data,
                })
                : command === "execute"
                    ? yield worker.execute(transactions)
                    : undefined;
            const timeFinished = Date.now();
            if (result !== undefined) {
                job.jobStatus = "finished";
                job.timeFinished = timeFinished;
                job.result = result;
            }
            else {
                job.jobStatus = "failed";
                job.timeFailed = timeFinished;
            }
            job.maxAttempts = 1;
            job.billedDuration = timeFinished - timeCreated;
            LocalStorage.jobs[jobId] = job;
            return jobId;
        });
    }
    recursiveProof(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield LocalCloud.run({
                command: "recursiveProof",
                data: {
                    developer: this.developer,
                    repo: this.repo,
                    transactions: data.transactions,
                    task: (_a = data.task) !== null && _a !== void 0 ? _a : "recursiveProof",
                    userId: data.userId,
                    args: data.args,
                    metadata: data.metadata,
                },
                chain: this.chain,
                localWorker: this.localWorker,
            });
        });
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LocalCloud.run({
                command: "execute",
                data: {
                    developer: this.developer,
                    repo: this.repo,
                    transactions: data.transactions,
                    task: data.task,
                    userId: data.userId,
                    args: data.args,
                    metadata: data.metadata,
                },
                chain: this.chain,
                localWorker: this.localWorker,
            });
        });
    }
    jobResult(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return LocalStorage.jobs[jobId];
        });
    }
    addTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskId = LocalCloud.generateId();
            LocalStorage.tasks[taskId] = Object.assign(Object.assign({}, data), { id: "local", taskId, developer: this.developer, repo: this.repo });
            return taskId;
        });
    }
    deleteTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (LocalStorage.tasks[taskId] === undefined)
                throw new Error(`deleteTask: Task ${taskId} not found`);
            delete LocalStorage.tasks[taskId];
        });
    }
    processTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            yield LocalCloud.processLocalTasks({
                developer: this.developer,
                repo: this.repo,
                localWorker: this.localWorker,
                chain: this.chain,
            });
        });
    }
    static processLocalTasks(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { developer, repo, localWorker, chain } = params;
            for (const taskId in LocalStorage.tasks) {
                const data = LocalStorage.tasks[taskId];
                const jobId = LocalCloud.generateId();
                const timeCreated = Date.now();
                const job = {
                    id: "local",
                    jobId: jobId,
                    taskId: taskId,
                    developer,
                    repo,
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
                    chain,
                    localWorker,
                });
                const worker = yield localWorker(cloud);
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
            let count = 0;
            for (const task in LocalStorage.tasks)
                count++;
            return count;
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