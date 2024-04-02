"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalCloud = void 0;
const o1js_1 = require("o1js");
const cloud_1 = require("./cloud");
class LocalCloud extends cloud_1.Cloud {
    constructor(params) {
        const { job, cache, stepId } = params;
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
        });
        this.data = new Map();
    }
    async getDeployer() {
        throw new Error("Method not implemented.");
    }
    async log(msg) {
        console.log("LocalCloud:", msg);
    }
    async getDataByKey(key) {
        const value = this.data.get(key);
        return value;
    }
    async saveDataByKey(key, value) {
        this.data.set(key, value);
    }
    async saveFile(filename, value) {
        throw new Error("Method not implemented.");
    }
    async loadFile(filename) {
        throw new Error("Method not implemented.");
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
