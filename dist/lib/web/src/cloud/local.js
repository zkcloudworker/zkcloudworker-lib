import { __awaiter } from "tslib";
export class LocalCloud {
    constructor(cache) {
        this.data = new Map();
        this.cache = cache;
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
}
//# sourceMappingURL=local.js.map