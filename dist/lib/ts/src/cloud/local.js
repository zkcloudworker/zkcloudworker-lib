"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalCloud = void 0;
class LocalCloud {
    constructor(cache) {
        this.data = new Map();
        this.cache = cache;
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
