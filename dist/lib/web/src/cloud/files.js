import { __awaiter } from "tslib";
import fs from "fs/promises";
export function saveFile(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, filename } = params;
        const folder = "./data/";
        const name = folder + filename + ".json";
        try {
            yield fs.access("./data");
        }
        catch (e) {
            // if not, create it
            yield fs.mkdir("./data");
        }
        try {
            yield fs.writeFile(name, JSON.stringify(data, null, 2));
            return name;
        }
        catch (e) {
            console.error(`Error writing file ${name}`);
            return undefined;
        }
    });
}
export function loadFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = "./data/" + filename + ".json";
        try {
            const filedata = yield fs.readFile(name, "utf8");
            const data = JSON.parse(filedata);
            return data;
        }
        catch (e) {
            console.error(`File ${name} does not exist or has wrong format`);
            return undefined;
        }
    });
}
export function saveBinaryFile(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, filename } = params;
        const folder = "./data/";
        const name = folder + filename + ".bin";
        try {
            yield fs.access("./data");
        }
        catch (e) {
            // if not, create it
            yield fs.mkdir("./data");
        }
        try {
            yield fs.writeFile(name, data);
            return name;
        }
        catch (e) {
            console.error(`Error writing file ${name}`);
            return undefined;
        }
    });
}
export function loadBinaryFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = "./data/" + filename + ".bin";
        try {
            const data = yield fs.readFile(name);
            return data;
        }
        catch (e) {
            console.error(`File ${name} does not exist or has wrong format`);
            return undefined;
        }
    });
}
//# sourceMappingURL=files.js.map