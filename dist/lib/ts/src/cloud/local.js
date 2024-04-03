"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = exports.LocalCloud = void 0;
const o1js_1 = require("o1js");
const cloud_1 = require("./cloud");
const files_1 = require("./files");
class LocalCloud extends cloud_1.Cloud {
    constructor(params) {
        const { job, chain, cache, stepId } = params;
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
