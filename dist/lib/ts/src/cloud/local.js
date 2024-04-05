"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = exports.LocalCloud = void 0;
const o1js_1 = require("o1js");
const cloud_1 = require("./cloud");
const mina_1 = require("../mina");
const files_1 = require("./files");
class LocalCloud extends cloud_1.Cloud {
    constructor(params) {
        const { job, chain, cache, stepId, localWorker } = params;
        const { jobId, developer, repo, task, userId, args, metadata } = job;
        super({
            jobId: jobId,
            stepId: stepId ?? "stepId",
            cache: cache ?? o1js_1.Cache.FileSystem("./cache"),
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
    async getDeployer() {
        throw new Error("Method not implemented.");
    }
    async log(msg) {
        console.log("LocalCloud:", msg);
    }
    async getDataByKey(key) {
        const value = LocalStorage.data[key];
        return value;
    }
    async saveDataByKey(key, value) {
        LocalStorage.data[key] = value;
    }
    async saveFile(filename, value) {
        await (0, files_1.saveBinaryFile)({ data: value, filename });
    }
    async loadFile(filename) {
        const data = await (0, files_1.loadBinaryFile)(filename);
        return data;
    }
    async loadEnvironment(password) {
        throw new Error("Method not implemented.");
    }
    generateId() {
        return "local." + Date.now().toString() + "." + (0, mina_1.makeString)(32);
    }
    async recursiveProof(data) {
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
        const worker = await this.localWorker(cloud);
        if (worker === undefined)
            throw new Error("worker is undefined");
        const proof = await LocalCloud.sequencer({
            worker,
            data: { ...data, developer: this.developer, repo: this.repo },
        });
        job.timeFinished = Date.now();
        job.jobStatus = "finished";
        job.result = proof;
        job.maxAttempts = 1;
        LocalStorage.jobs[jobId] = job;
        return jobId;
    }
    async execute(data) {
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
        const worker = await this.localWorker(cloud);
        if (worker === undefined)
            throw new Error("worker is undefined");
        const result = await worker.execute();
        job.timeFinished = Date.now();
        job.jobStatus = "finished";
        job.result = result;
        job.maxAttempts = 1;
        LocalStorage.jobs[jobId] = job;
        return jobId;
    }
    async addTask(data) {
        const taskId = this.generateId();
        LocalStorage.tasks[taskId] = {
            ...data,
            id: "local",
            taskId,
            developer: this.developer,
            repo: this.repo,
        };
        return taskId;
    }
    async deleteTask(taskId) {
        delete LocalStorage.tasks[taskId];
    }
    async processTasks() {
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
            const worker = await this.localWorker(cloud);
            console.log("Executing task", { taskId, data });
            const result = await worker.task();
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
    }
    static async sequencer(params) {
        const { worker, data } = params;
        const { transactions } = data;
        if (transactions.length === 0)
            throw new Error("No transactions to process");
        const proofs = [];
        for (const transaction of transactions) {
            const result = await worker.create(transaction);
            if (result === undefined)
                throw new Error("Failed to create proof");
            proofs.push(result);
        }
        let proof = proofs[0];
        for (let i = 1; i < proofs.length; i++) {
            const result = await worker.merge(proof, proofs[i]);
            if (result === undefined)
                throw new Error("Failed to merge proofs");
            proof = result;
        }
        return proof;
    }
}
exports.LocalCloud = LocalCloud;
class LocalStorage {
    static async saveData(name) {
        const data = {
            jobs: LocalStorage.jobs,
            data: LocalStorage.data,
            transactions: LocalStorage.transactions,
            tasks: LocalStorage.tasks,
        };
        const filename = name + ".cloud";
        await (0, files_1.saveFile)({ data, filename });
    }
    static async loadData(name) {
        const filename = name + ".cloud";
        const data = await (0, files_1.loadFile)(filename);
        if (data === undefined)
            return;
        LocalStorage.jobs = data.jobs;
        LocalStorage.data = data.data;
        LocalStorage.transactions = data.transactions;
        LocalStorage.tasks = data.tasks;
    }
}
exports.LocalStorage = LocalStorage;
LocalStorage.jobs = {};
LocalStorage.data = {};
LocalStorage.transactions = {};
LocalStorage.tasks = {};
