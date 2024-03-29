"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalCloud = void 0;
const o1js_1 = require("o1js");
const cloud_1 = require("./cloud");
class LocalCloud extends cloud_1.Cloud {
    constructor(params = {}) {
        const { jobId, stepId, cache, developer, repo, task, userId, args, metadata, } = params;
        super({
            jobId: jobId || "jobId",
            stepId: stepId || "stepId",
            cache: cache || o1js_1.Cache.FileSystem("./cache"),
            developer: developer || "developer",
            repo: repo || "repo",
            task: task || "task",
            userId: userId || "userId",
            args: args || "args",
            metadata: metadata || "metadata",
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
}
exports.LocalCloud = LocalCloud;
