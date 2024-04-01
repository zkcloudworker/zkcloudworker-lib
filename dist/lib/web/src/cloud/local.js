import { __awaiter } from "tslib";
import { Cache } from "o1js";
import { Cloud } from "./cloud";
export class LocalCloud extends Cloud {
    constructor(params = {}) {
        const { jobId, stepId, cache, developer, repo, task, userId, args, metadata, } = params;
        super({
            jobId: jobId || "jobId",
            stepId: stepId || "stepId",
            cache: cache || Cache.FileSystem("./cache"),
            developer: developer || "developer",
            repo: repo || "repo",
            task: task || "task",
            userId: userId || "userId",
            args: args || "args",
            metadata: metadata || "metadata",
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
}
//# sourceMappingURL=local.js.map